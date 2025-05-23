const express = require('express');
const session = require('express-session');
const passport = require('passport');
const expressWs = require('express-ws');
const path = require('path');
const cors = require('cors')
const corsOptions = {
  origin: ['http://localhost:3000']
}

var LocalStrategy = require('passport-local');

const {
  db,
  fetchAllUsers,
  fetchGroups,
  addMessage,
  getAllMessagesForUser,
  addgroup,
  fetchGroupmembers,
  getGroupMessages
} = require('./db.js');

const userProfile = require('./routes/userProfile.js');
const authentication = require('./routes/userVerification.js');
const contacts = require('./routes/contacts.js')
const app = express();
expressWs(app);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,               
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  express.static(path.join(__dirname, '../client/dist'))
);
app.use('/uploads', express.static(path.join(__dirname, '.routes/uploads')));
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/user', userProfile);
app.use('/authentication', authentication);
app.use('/contacts',contacts)
// Serve React app
app.get('/', (req, res) => {

  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));

});


const clients = new Map();
const groups = new Map();

app.ws('/ws', (ws, req) => {
  console.log('WebSocket connection established');

  (async () => {
    const allClients = await fetchAllUsers();
    const userGroups = await fetchGroups(req.user.username);

    allClients.forEach(clientId => {
      clients.set(clientId, { ws, joinedGroups: [] });
    });
    const current = clients.get(req.user.username);
    if (current) {
      current.joinedGroups = userGroups;
    }
  })();

  ws.on('message', async (msg) => {
    console.log("message in ws",msg)
    try {
      const message = JSON.parse(msg);

      // Direct message
      if (!message.group && message.type == "direct") {
        await addMessage(message,req.user.username);
        const sender = req.user.username;
        const receiver = clients.get(message.to);
        const payload = {
          message:message.message,
          from: sender,
          to: message.to,
          group: null,
          timestamp: new Date().toISOString()
        };

        if (receiver) {
          receiver.ws.send(JSON.stringify(payload));
        }
        return;
      }


      if (message.type === 'fetch') {
        console.log("fetch message is hitting...")
        console.log("username fetch",req.user.username)
        const directMessages = await getAllMessagesForUser(req.user.username);
        let contact;
        const query = `
          select contacts.usercontacts, contacts.id ,users.username,users.profile_pic from contacts inner join 
          users on users.username=contacts.usercontacts where contacts.username=$1 
           `
        try{
         contact = await db.query(query, [req.user.username]);
        console.log("fetched contacts ",contact )
        }catch(e){
          console.log("error while fetching contacts",e)
        }
        const groups = clients.get(req.user.username).joinedGroups
        const groupMessages = await getGroupMessages()
         console.log("direct-messages",directMessages)
        ws.send(
          JSON.stringify({ type: 'fetched_messages', directMessages, user: req.user.username, contact:contact.rows, groups: groups.rows, groupMessages })
        );
        return;
      } 

      // Join group
      if (message.type === 'joinGroup') {
        const { groupId, to } = message;

        if (!groups.has(groupId)) {
          groups.set(groupId, []);
          await addgroup(groupId, req.user.userId);
          await addgroup(groupId, to);
        }

        const clientEntry = clients.get(req.user.username);
        if (clientEntry && !clientEntry.joinedGroups.includes(groupId)) {
          clientEntry.joinedGroups.push(groupId);
        }

        const members = await fetchGroupmembers(groupId);
        groups.set(groupId, members);

        return;
      }
      if (message.type === "group") {
        try {
          const savedMessage = {
            message: message.content,
            from: req.user.username,
            receiver: null,
            group: message.group
          };


          await addMessage(savedMessage);

          clients.forEach(async (entry, id) => {
            if (entry.joinedGroups.includes(message.group)) {
              const payload = {
                message: message.content,
                from: req.user.username,
                receiver: id,
                group: message.group
              };
              entry.ws.send(JSON.stringify(payload));
             
            }
          });
        } catch (err) {
          console.error('WebSocket message handler error:', err);
        }
      }


    } catch (e) {
      console.log("error ", e)

    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed', req.user.userId);
    clients.delete(req.user.userId);
  });

  ws.on('error', err => {
    console.error('WebSocket error:', err);
  });
})

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
