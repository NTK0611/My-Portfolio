const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ where: { googleId: profile.id } });

      if (!user) {
        // Check if email already exists
        user = await User.findOne({ where: { email: profile.emails[0].value } });

        if (user) {
          // Link Google to existing account
          user.googleId = profile.id;
          user.avatar = profile.photos[0].value;
          await user.save();
        } else {
          // Create new user
          const userCount = await User.count();
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            avatar: profile.photos[0].value,
            role: userCount === 0 ? 'admin' : 'visitor',
          });
        }
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      user.token = token;
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport;