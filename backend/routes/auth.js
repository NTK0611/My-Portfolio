const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const passport = require('passport');
require('../config/passport');

// Email + Password
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
      if (err) {
        console.error('Auth error:', err);
        return res.redirect('http://127.0.0.1:5500/frontend/pages/login.html');
      }
      if (!user) {
        console.error('No user returned:', info);
        return res.redirect('http://127.0.0.1:5500/frontend/pages/login.html');
      }
      console.log('Success! Redirecting with token for:', user.email);
      return res.redirect(`${process.env.FRONTEND_URL}?token=${user.token}`);
    })(req, res, next);
  }
);

module.exports = router;