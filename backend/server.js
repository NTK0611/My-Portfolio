const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const emailRoutes = require('./routes/email');
const portfolioRoutes = require('./routes/portfolio');

// Import models so Sequelize knows about them for sync
require('./models/User');
require('./models/Message');
require('./models/Portfolio');
require('./models/Project');
require('./models/Skill');

const app = express();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      'http://127.0.0.1:5500',
      'http://localhost:5500',
      'https://portfolio-ntk.vercel.app',
    ];
    if (!origin) return callback(null, true);
    if (allowed.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'Portfolio API running' }));

// Start server
const PORT = process.env.PORT || 5000;
connectDB().then(async () => {
  const { seedDefaults } = require('./routes/portfolio');
  await seedDefaults();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});