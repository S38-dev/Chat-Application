const { Client } = require('pg');
require('dotenv').config({ path: __dirname + '/.env' });
console.log(".envrocess",process.env);

console.log('DB_PASSWORD from .env:', process.env.DB_PASSWORD);

// Database client setup
const db = new Client({
  user: 'postgres',
  host:process.env.DB_HOST ,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD ,
  port: 5432,
});

db.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });


async function getUser(username) {
  try {
    const query = 'SELECT * FROM users WHERE userName = $1';
    const res = await db.query(query, [username]);
    return res.rows;
  } catch (err) {
    console.error('Error fetching user:', err);
    throw err;
  }
}


async function addUser(userObj) {
  try {
    const query = `
      INSERT INTO users (userName, profile_pic, password)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const res = await db.query(query, [
      userObj.username,
      userObj.profile_pic,
      userObj.password,
    ]);
    return res.rows[0];
  } catch (err) {
    console.error('Error adding user:', err);
    throw err;
  }
}

async function getGroupMessages(username) {
  const groupQuery = `
    SELECT group_id FROM members WHERE username = $1
  `;
  const groupsRes = await db.query(groupQuery, [username]);
  const groupIds = groupsRes.rows.map(r => r.group_id);

  if (groupIds.length === 0) return [];

  const placeholders = groupIds.map((_, i) => `$${i + 1}`).join(',');
  const messageQuery = `
    SELECT *
    FROM messages
    WHERE message_group IN (${placeholders})
    ORDER BY id
  `;
  const res = await db.query(messageQuery, groupIds);
  return res.rows;
}

async function addProfilepic(fileName, username) {
  try {
    const query = `
      UPDATE users
      SET profile_pic = $1
      WHERE userName = $2
      RETURNING *
    `;
    const res = await db.query(query, [fileName, username]);
    return res.rows[0];
  } catch (err) {
    console.error('Error updating profile picture:', err);
    throw err;
  }
}


async function getAllMessagesForUser(username) {
  try {
    const query = `
      SELECT *
      FROM messages
      WHERE sender_id = $1 OR receiver_id = $1
    `;
    const res = await db.query(query, [username]);
    return res.rows;
  } catch (err) {
    console.error('Error fetching messages:', err);
    throw err;
  }
}


async function addMessage(message,from) {
  try {
    const query = `
      INSERT INTO messages
        (sender_id, receiver_id, message_group, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const res = await db.query(query, [
      from,
      message.receiver_id ? message.receiver_id :null,
      message.message_group ?? null,
      message.message,
    ]);
    return res.rows[0];
  } catch (err) {
    console.error('Error adding message:', err);
    throw err;
  }
}



async function fetchGroupmembers(groupId) {
  try {
    const query = 'SELECT members.username,users.profile_pic FROM members inner join users on users.username=members.username WHERE group_id = $1';
    const res = await db.query(query, [groupId]);
    return res.rows;
  } catch (err) {
    console.error('Error fetching group members:', err);
    throw err;
  }
}

async function fetchAllUsers() {
  try {
    const query = 'SELECT username FROM users';
    const res = await db.query(query);
    return res.rows.map(r => r.username);
  } catch (err) {
    console.error('Error fetching clients:', err);
    throw err;
  }
}


async function fetchGroups(username) {
  try {
    const query = `
      SELECT g.group_id, g.group_name 
      FROM members m
      JOIN groups g ON m.group_id = g.group_id 
      WHERE m.username = $1
    `;
    const res = await db.query(query, [username]);
    return res.rows;
  } catch (err) {
    console.error('Error fetching groups:', err);
    throw err;
  }
}
 async function fetchContacts(username){
  try {
    const query = `
      select distinct on(contacts.usercontacts) contacts.usercontacts, contacts.id, users.username,
        CASE
          WHEN users.profile_pic IS NULL OR users.profile_pic LIKE 'http%' OR users.profile_pic = ''
            THEN 'default-avatar.jpeg'
          ELSE users.profile_pic
        END as profile_pic
      from contacts
      inner join users on users.username=contacts.usercontacts
      where contacts.username = $1
    `;
    const result = await db.query(query, [username]);
    return result.rows;
  } catch (err) {
    console.error('Error fetching contacts:', err);
    throw err;
  }
}
async function addGroup(groupId, username) {
  try {
    const checkQuery = 'SELECT * FROM groups WHERE group_id = $1';
    const existing = await db.query(checkQuery, [groupId]);
    if (existing.rows.length) {
      const updateQuery = `
        UPDATE groups
        SET username = $1
        WHERE group_id = $2
        RETURNING *
      `;
      const res = await db.query(updateQuery, [username, groupId]);
      return res.rows[0];
    } else {
      const insertQuery = `
        INSERT INTO groups (group_id, username)
        VALUES ($1, $2)
        RETURNING *
      `;
      const res = await db.query(insertQuery, [groupId, username]);
      return res.rows[0];
    }
  } catch (err) {
    console.error('Error in addGroup:', err);
    throw err;
  }
}

async function addGroupMember(groupId, username) {
  try {
    const query = `
      INSERT INTO members (group_id, username)
      VALUES ($1, $2)
      ON CONFLICT (group_id, username) DO NOTHING;
    `;
    await db.query(query, [groupId, username]);
  } catch (err) {
    console.error('Error adding group member:', err);
    throw err;
  }
}

module.exports = {
  db,
  getUser,
  addUser,
  addProfilepic,
  getAllMessagesForUser,
  addMessage,
  fetchGroupmembers,
  fetchAllUsers,
  fetchGroups,
  addGroup,
  getGroupMessages,
  fetchContacts,
  addGroupMember
};
