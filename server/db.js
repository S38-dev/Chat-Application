const { Client } = require('pg');

// Database client setup
const db = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Chat',
  password: '1234',
  port: 5432,
});

db.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

// Fetch a user by username
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

// Add a new user
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

// Update a user's profile picture
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


async function getAllMessagesForUser(userId) {
  try {
    const query = `
      SELECT *
      FROM messages
      WHERE sender_id = $1 OR receiver_id = $1
    `;
    const res = await db.query(query, [userId]);
    return res.rows;
  } catch (err) {
    console.error('Error fetching messages:', err);
    throw err;
  }
}


async function addMessage(message) {
  try {
    const query = `
      INSERT INTO messages
        (sender_id, receiver_id, message_group, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const res = await db.query(query, [
      message.form,
      message.to,
      message.group,
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
    const query = 'SELECT * FROM members WHERE group_id = $1';
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
    const query = 'SELECT group_id FROM groups WHERE username = $1';
    const res = await db.query(query, [username]);
    return res.rows.map(r => r.group_id);
  } catch (err) {
    console.error('Error fetching groups:', err);
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
};
