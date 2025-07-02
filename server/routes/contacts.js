const express = require('express');
const { db, fetchContacts, fetchGroupmembers } = require('../db.js');

const router = express.Router();


// router.get('/contacts', async (req, res) => {

//   console.log("hitting contacts route ")
//   if (!req.isAuthenticated || !req.isAuthenticated()) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   try {
//     const username = req.user.username;
//     // const query = `
//     //   SELECT DISTINCT
//     //     CASE
//     //       WHEN sender_id = $1 THEN receiver_id
//     //       ELSE sender_id
//     //     END AS contact_id
//     //   FROM messages
//     //   WHERE (sender_id = $1 OR receiver_id = $1)
//     //     AND group_id IS NULL;
//     // `;
//     const query = `
//       select distinct on(contacts.usercontacts) contacts.usercontacts, contacts.id ,users.username,users.profile_pic from contacts inner join 
//       users on users.username=contacts.usercontacts where  contacts.username = $1

//     `
//     const result = await db.query(query, [username]);
//     console.log("contacts :", result.rows)

//    if(result.rows.length!=0) return res.json({ contacts: result.rows });
//   } catch (err) {
//     console.error('Error fetching contacts:', err);
//     return res.status(500).json({ message: 'Failed to fetch contacts' });
//   }
// });



router.post("/addgroup", async (req, res) => {
  const { groupName, members } = req.body;
  const clients = req.app.locals.clients

  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
   
    const groupRes = await db.query(
      `INSERT INTO groups (group_name, username) 
       VALUES ($1, $2) 
       RETURNING group_id,group_name`,
      [groupName, req.user.username]
    );

    const group_id = groupRes.rows[0].group_id;
    const group_name = groupRes.rows[0].group_name;
 
    const allMembers = [req.user.username, ...members];
    if (allMembers.length > 0) {
      const insertPromises = allMembers.map(username =>
        db.query(
          `INSERT INTO members (group_id, username) 
         VALUES ($1, $2)`,
          [group_id, username]
        )
      );

      await Promise.all(insertPromises);
    }
    const groupMembers = await fetchGroupmembers(group_id)
    let array = [];


    const newGroupPayload = {
        type: 'group-created',
        group: {
            group_id: group_id,
            group_name: group_name,
        }
    };
    groupMembers.forEach(user => {
        const memberClient = clients.get(user.username);
        if (memberClient?.ws && memberClient.ws.readyState === 1) {
            memberClient.ws.send(JSON.stringify(newGroupPayload));
        }
    });

    res.status(201).json({ group_id});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});













router.post('/addcontact', async (req, res) => {
  const clients = req.app.locals.clients

  try {
    const result = await db.query(
      'SELECT username FROM users WHERE username=$1',
      [req.body.username]
    );


    if (result.rows.length !== 0) {
      await db.query(
        'INSERT INTO contacts(username, usercontacts) VALUES($1, $2)',
        [req.user.username, req.body.username]
      );
      await db.query(
        'INSERT INTO contacts(username, usercontacts) VALUES($1, $2)',
        [req.body.username, req.user.username]
      );
      const user1 = clients.get(req.user.username)
      const user2 = clients.get(req.body.username)




      const updatedUser1Contacts = await fetchContacts(req.user.username)
      const updatedUser2Contacts = await fetchContacts(req.body.username)



      const payload = {
        type: "contacts_updated",
        contacts: updatedUser1Contacts
      };
      const payload2 = {
        type: "contacts_updated",
        contacts: updatedUser2Contacts
      };
      const sendIfConnected = (username, payload) => {
        const client = clients.get(username);
        if (client?.ws && client.ws.readyState === 1) {
          client.ws.send(JSON.stringify(payload));
        }
      };
      sendIfConnected(req.user.username, payload);
      sendIfConnected(req.body.username, payload2);





      return res.status(200).json({ message: 'Contact added!' });
    } else {
      return res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    console.error('Error adding contact:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});






module.exports = router;
