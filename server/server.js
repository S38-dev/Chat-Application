const path = require('path');
require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const expressWs = require('express-ws');
const cors = require('cors')

var LocalStrategy = require('passport-local');

const {
  db,
  fetchAllUsers,
  fetchGroups,
  addMessage,
  getAllMessagesForUser,
  addgroup,
  fetchGroupmembers,
  getGroupMessages,
  addGroupMember
} = require('./db.js');

const userProfile = require('./routes/userProfile.js');
const authentication = require('./routes/userVerification.js');
const contacts = require('./routes/contacts.js');
const app = express();
expressWs(app);


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

console.log('TEST_VAR from .env:', process.env.TEST_VAR);

app.get('/', (req, res) => {
  if (req.user) {
   
    res.json({ user: req.user });
  } else {
    console.log(
      "user is not authenticated"
    )
    
    res.status(401).json({ user: null, message: 'User not authenticated' });
  }
});

app.use(
  express.static(path.join(__dirname, '../client/dist'))
);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: 'Lax' }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/user', userProfile);
app.use('/authentication', authentication);
app.use('/contacts', contacts)

// app.get('/', (req, res) => {
//   console.log("hitting refresh" )
//   // res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));

// });


const clients = new Map();
const groupMembers = new Map(); 
app.locals.clients = clients
app.ws('/ws', (ws, req) => {
 
  if (!req.user || !req.user.username) {
    ws.close();
    return;
  }

  const username = req.user.username;

  clients.set(username, { ws, joinedGroups: [] }); 

  
  (async () => {
    try {
      const userGroupsResult = await fetchGroups(username);
      const userGroups = Array.isArray(userGroupsResult) ? userGroupsResult : userGroupsResult.rows;

     
      const clientEntry = clients.get(username);
      if (clientEntry) {
        clientEntry.joinedGroups = userGroups;

       
        if (userGroups && Array.isArray(userGroups)) {
            userGroups.forEach(group => {
                if (!groupMembers.has(group.group_id)) {
                    groupMembers.set(group.group_id, new Set());
                }
                groupMembers.get(group.group_id).add(ws);
            });
        }


         const directMessages = await getAllMessagesForUser(username);
         let contact;
         const query = `
           select contacts.usercontacts, contacts.id, users.username,
             CASE
               WHEN users.profile_pic IS NULL OR users.profile_pic LIKE 'http%' OR users.profile_pic = ''
                 THEN 'default-avatar.jpeg'
               ELSE users.profile_pic
             END as profile_pic
           from contacts
           inner join users on users.username=contacts.usercontacts
           where contacts.username=$1
            `
         try {
           contact = await db.query(query, [username]);
         } catch (e) {
           console.error("error while fetching contacts", e)
         }

         const groupsPayload = userGroups && Array.isArray(userGroups) ? userGroups : [];

         ws.send(
           JSON.stringify({ type: 'fetched_messages', directMessages, user: username, contact: contact.rows, groups: groupsPayload })
         );

         
         const groupMessages = await getGroupMessages(username);
          ws.send(
            JSON.stringify({ type: 'fetched_group_messages_only', groupMessages })
          );


      }

    } catch (error) {
      console.error(`Server: Error fetching initial data and populating groupMembers for user ${username}:`, error);
      
       ws.close();
    }
  })();


  ws.on('message', async (msg) => {
    try {
      const message = JSON.parse(msg);

      // Direct message
      if (!message.group && message.type == "direct") {
        const savedMessage = await addMessage(message, req.user.username);
        const sender = req.user.username;
        const receiver = clients.get(message.receiver_id);
        const payload = {
          type: "direct",
          message: {
            message: savedMessage.message,
            sender_id: savedMessage.sender_id,
            receiver_id: savedMessage.receiver_id,
            timestamp: savedMessage.timestamp
          }
        };

        if (receiver) {
          try {

            receiver.ws.send(JSON.stringify(payload));
          } catch (e) {
            console.error("error sending message to receiver", e)
          }
        }
        return;
      }


      if (message.type === 'fetch') {
        const directMessages = await getAllMessagesForUser(req.user.username);
        let contact;
        const query = `
          select contacts.usercontacts, contacts.id, users.username,
            CASE
              WHEN users.profile_pic IS NULL OR users.profile_pic LIKE 'http%' OR users.profile_pic = ''
                THEN 'default-avatar.jpeg'
              ELSE users.profile_pic
            END as profile_pic
          from contacts
          inner join users on users.username=contacts.usercontacts
          where contacts.username=$1
           `
        try {
          contact = await db.query(query, [req.user.username]);
        } catch (e) {
          console.error("error while fetching contacts", e)
        }
      
        const clientEntry = clients.get(req.user.username);
        const groupsPayload = (clientEntry && clientEntry.joinedGroups && Array.isArray(clientEntry.joinedGroups)) ? clientEntry.joinedGroups : [];
        ws.send(
          JSON.stringify({ type: 'fetched_messages', directMessages, user: req.user.username, contact: contact.rows, groups: groupsPayload })
        );
        return;
      }


      if (message.type == "fetch-group") {


       
        const latestUserGroups = await fetchGroups(req.user.username);
        const allGroupsArray = latestUserGroups.rows ? latestUserGroups.rows.map((g) => {
          return {
            group_name: g.group_name,
            group_id: g.group_id

          }
        }) : []; 


        const payload = {
          type: 'update-group-admin',
          allgroups: allGroupsArray

        }
        const admin = clients.get(req.user.username)
        if (admin?.ws && admin.ws.readyState === 1) {
          admin.ws.send(JSON.stringify(payload))
        }


      }

      // Handler for adding a member to a group
      if (message.type === 'add_group_member') {
        const { groupId, username } = message;

        if (!groupId || !username) {
          console.error('Invalid add_group_member message: missing groupId or username');
          return;
        }

        try {
          await addGroupMember(groupId, username);

         
          if (!groupMembers.has(groupId)) {
              groupMembers.set(groupId, new Set());
          }

         
          const adderUsername = req.user.username;
          const adderClientEntry = clients.get(adderUsername);
          if (adderClientEntry?.ws && adderClientEntry.ws.readyState === 1) {
              groupMembers.get(groupId).add(adderClientEntry.ws);
          } else {
              console.error(`Server: Could not find active WebSocket for adder (${adderUsername}). Cannot add to groupMembers map for group ${groupId}.`);
          }

          
          const addedClientEntry = clients.get(username);

          if (addedClientEntry?.ws && addedClientEntry.ws.readyState === 1) {
          
            groupMembers.get(groupId).add(addedClientEntry.ws);

            // Fetch 
            const latestUserGroups = await fetchGroups(username);
            const allGroupsArray = latestUserGroups ? latestUserGroups.map((g) => {
                return {
                    group_name: g.group_name,
                    group_id: g.group_id
                }
            }) : [];

     
            const payload = {
              type: 'update-group-admin', 
              allgroups: allGroupsArray
            };
            addedClientEntry.ws.send(JSON.stringify(payload));
          } else {
            console.error(`Server: Could not find active WebSocket connection for user ${username}. Cannot send real-time group update or add to groupMembers for group ${groupId}.`);
          }

        } catch (error) {
          console.error('Error handling add_group_member message:', error);
         
        }
        return;
      }

   
      if (message.type === 'fetch_group_messages') {
        const groupMessages = await getGroupMessages(req.user.username);
        ws.send(
          JSON.stringify({ type: 'fetched_group_messages_only', groupMessages })
        );
        return;
      }

    


  
      if (message.type === 'joinGroup') {
        const { groupId, to } = message;

        
        const clientEntry = clients.get(req.user.username);
        if (clientEntry) {
         
             clientEntry.joinedGroups = await fetchGroups(req.user.username);
        }

       
        if (!groupMembers.has(groupId)) {
            groupMembers.set(groupId, new Set());
        }
        const clientWs = clients.get(req.user.username)?.ws;
        if (clientWs) {
            groupMembers.get(groupId).add(clientWs);
        }

        return;
      }
      if (message.type === "group") {
        try {
          const savedMessage = {
            message: message.message,
            message_group: message.message_group 
          };


          await addMessage(savedMessage, req.user.username); 
          const targetGroupMembers = groupMembers.get(message.message_group);

          if (targetGroupMembers) {
              targetGroupMembers.forEach(memberWs => {
                  if (memberWs.readyState === 1) { 
                      const payload = {
                          type: "group", 
                          message: {
                              message: message.message,
                              sender_id: req.user.username,
                              receiver_id: null, 
                              group: message.message_group,
                              timestamp: new Date().toISOString()
                          }
                      };
                      memberWs.send(JSON.stringify(payload));
                  }
              });
          }
        } catch (err) {
          console.error('WebSocket message handler error:', err);
        }
      }


    } catch (e) {
      console.error("WebSocket message parsing or handling error:", e)

    }
  });

  ws.on('close', () => {
   
    clients.delete(req.user.username);

 
    groupMembers.forEach(members => {
        members.delete(ws);
    });
  });

  ws.on('error', err => {
    console.error('WebSocket error:', err);
  });
})


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
