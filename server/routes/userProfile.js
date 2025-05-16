const express = require('express');
const path = require('path');
const multer = require('multer');
const { addProfilePic, getUserByUsername } = require('../db.js');

const router = express.Router();

const upload = multer({ dest: path.join(__dirname, '../uploads') });


router.post(
  '/profile/edit/upload',
  upload.single('profile_pic'),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }
      const username = req.user.username;
      const updatedUser = await addProfilePic(file.filename, username);
      return res.json({ message: 'Upload successful', user: updatedUser });
    } catch (err) {
      console.error('Profile upload error:', err);
      return res.status(500).json({ message: 'Upload failed', error: err.message });
    }
  }
);


router.get('/api/profile-pic', async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ profilePic: '/imgs/default-avatar.jpg' });
  }
  try {
    const user = await getUserByUsername(req.user.username);
    const profilePic = user.profile_pic
      ? `/uploads/${user.profile_pic}`
      : '/imgs/default-avatar.jpg';
    return res.json({ profilePic });
  } catch (err) {
    console.error('Error fetching profile pic:', err);
    return res.status(500).json({ profilePic: '/imgs/default-avatar.jpg' });
  }
});

module.exports = router;
