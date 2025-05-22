const express = require('express');
const { db } = require('../db.js');

const router = express.Router();


router.get('/contacts', async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const username = req.user.userId;
    // const query = `
    //   SELECT DISTINCT
    //     CASE
    //       WHEN sender_id = $1 THEN receiver_id
    //       ELSE sender_id
    //     END AS contact_id
    //   FROM messages
    //   WHERE (sender_id = $1 OR receiver_id = $1)
    //     AND group_id IS NULL;
    // `;
    const query =`
      select contacts.usercontacts, contacts.id ,users.username,user.profile_pic from contacts inner join 
      users on users.username=contacts.usercontacts where contacts.username=$1 
    `
    const { rows } = await db.query(query, [username]);
   
    return res.json({ contacts:rows });
  } catch (err) {
    console.error('Error fetching contacts:', err);
    return res.status(500).json({ message: 'Failed to fetch contacts' });
  }
});
router.post("/addgroup", async (req, res) => {
  const { groupName, admin, members } = req.body; 

  if (!groupName || !admin || !Array.isArray(members)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {

    const [groupResult] = await db.query(
      'INSERT INTO groups (group_name, username) VALUES ($1, $2)',
      [groupName,req.user.username]
    );
    const groupId = groupResult.group_Id;

    // 2. Insert members
    const memberInserts = members.map(username => 
      db.query('INSERT INTO members (group_id, username) VALUES ($1, $2)', [groupId, username])
    );
    await Promise.all(memberInserts);

    res.status(201).json({ groupId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
