const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const User = require('../models/User');

// GET /api/admin/users — all users
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'avatar', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// GET /api/admin/messages — all contact messages
// For now returns empty array since Message model doesn't exist yet
// Will be populated once email/contact route saves to DB
router.get('/messages', protect, isAdmin, async (req, res) => {
  try {
    // Try to load Message model if it exists
    let Message;
    try {
      Message = require('../models/Message');
    } catch (e) {
      // Model doesn't exist yet — return empty array
      return res.json([]);
    }
    const messages = await Message.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

module.exports = router;