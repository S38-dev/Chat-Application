const express = require('express');
const session = require('express-session');
const passport = require('passport');
const expressWs = require('express-ws');
const path = require('path');
const cors=require('cors')
const corsOptions={
  origin:['http://localhost:3000']
}

var LocalStrategy = require('passport-local');

const {
  db,
  fetchAllUsers,
  fetchGroups,
  addMessage,
  getAllMessagesForUser,
  addgroup,
  fetchGroupmembers
} = require('./db.js');

const userProfile = require('./routes/userProfile.js');
const authentication = require('./routes/userVerification.js');
const contacts=require('./routes/contacts.js')
const app = express();
expressWs(app);

// Middleware
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  express.static(path.join(__dirname, '../client/dist'))
);

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

// Serve React app
app.get('/', (req, res) => {
 
     res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  
});

// WebSocket setup
const clients = new Map();
const groups = new Map();

app.ws('/ws', (ws, req) => {
  console.log('WebSocket connection established');

  // Initialize clients map
  (async () => {
    const allClients = await fetchAllUsers();
    const userGroups = await fetchGroups(req.user.userId);

    allClients.forEach(clientId => {
      clients.set(clientId, { ws, joinedGroups: [] });
    });
    const current = clients.get(req.user.userId);
    if (current) {
      current.joinedGroups = userGroups;
    }
  })();

  ws.on('message', async (msg) => {
    try {
      const message = JSON.parse(msg);

      // Direct message
      if (!message.group && message.type=="direct") {
        await addMessage(message);
        const sender = req.user.userId;
        const receiver = clients.get(message.to);
        const payload = {
          message,
          from: sender,
          to: message.to,
          group: null
        };

        if (receiver) {
          receiver.ws.send(JSON.stringify(payload));
        }
        return;
      }

      // Fetch stored messages
      if (message.type === 'fetch') {
        const messages = await getAllMessagesForUser(req.user.userId);
         const query =`
      select contacts.usercontacts, contacts.id ,users.username,user.profile_pic from contacts inner join 
      users on users.username=contacts.usercontacts where contacts.username=$1 
    `
       const { contacts } = await db.query(query, [req.user.userId]);
        ws.send(
          JSON.stringify({ type: 'fetched_messages', messages ,user:req.user.userId,contacts})
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

        const clientEntry = clients.get(req.user.userId);
        if (clientEntry && !clientEntry.joinedGroups.includes(groupId)) {
          clientEntry.joinedGroups.push(groupId);
        }

        const members = await fetchGroupmembers(groupId);
        groups.set(groupId, members);

        return;
      }

      // Broadcast to group members
      clients.forEach((entry, id) => {
        if (entry.joinedGroups.includes(message.group)) {
          const payload = {
            message,
            from: req.user.userId,
            receiver: id,
            group: message.group
          };
          entry.ws.send(JSON.stringify(payload));
        }
      });
    } catch (err) {
      console.error('WebSocket message handler error:', err);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed', req.user.userId);
    clients.delete(req.user.userId);
  });

  ws.on('error', err => {
    console.error('WebSocket error:', err);
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
