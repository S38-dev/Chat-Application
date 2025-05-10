const express = require('express');
const { db } = require('../db.js');

const router = express.Router();

// Retrieve distinct direct-message contacts for authenticated user
router.get('/contacts', async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const userId = req.user.userId;
    const query = `
      SELECT DISTINCT
        CASE
          WHEN sender_id = $1 THEN receiver_id
          ELSE sender_id
        END AS contact_id
      FROM messages
      WHERE (sender_id = $1 OR receiver_id = $1)
        AND group_id IS NULL;
    `;
    const { rows } = await db.query(query, [userId]);
    const contacts = rows.map(r => r.contact_id);
    return res.json({ contacts });
  } catch (err) {
    console.error('Error fetching contacts:', err);
    return res.status(500).json({ message: 'Failed to fetch contacts' });
  }
});

module.exports = router;
