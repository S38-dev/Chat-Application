const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { getUser, addUser } = require('../db.js');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });


passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const users = await getUser(username);
      if (!users.length) return done(null, false);

      const user = users[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false);

      return done(null, {
        id: user.id,
        username: user.username,
       
      });
    } catch (err) {
      return done(err);
    }
  })
);


passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  try {
    const users = await getUser(username);
    if (!users.length) return done(null, false);
    const user = users[0];
    done(null, { id: user.id, username: user.username, profilePic: user.profile_pic });
  } catch (err) {
    done(err);
  }
});

// Login route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    req.login(user, err => {
      if (err) return res.status(500).json({ message: 'Login failed' });
      res.json({ message: 'Login successful', user });
    });
  })(req, res, next);
});

// Registration route
router.post('/register', upload.single('profile_pic'), async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await getUser(username);
    if (existing.length) return res.status(409).json({ message: 'User exists' });

    const hash = await bcrypt.hash(password, 10);
   const user = await addUser({
  username,
  password: hash,
  profile_pic: req.file?.filename || "http://localhost:3000/imgs/default-avatar.jpeg"
});

    res.status(201).json({ message: 'Registration successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Registration error', error: err.message });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed', error: err.message });
    }
    // Redirect or respond after successful logout
    res.json({ message: 'Logout successful' });
  });
});

module.exports = router;
