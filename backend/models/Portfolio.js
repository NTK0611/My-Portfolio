const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Portfolio = sequelize.define('Portfolio', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  // Hero section
  heroName: {
    type: DataTypes.STRING,
    defaultValue: 'Nguyễn Tuấn Kiệt',
  },
  heroTagline: {
    type: DataTypes.TEXT,
    defaultValue: 'Nice to meet you! My name is Kiệt and I am passionate about backend systems.',
  },
  // About section
  bioText: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  // Contact info
  email: {
    type: DataTypes.STRING,
    defaultValue: 'nguyentuankietiu@gmail.com',
  },
  github: {
    type: DataTypes.STRING,
    defaultValue: 'https://github.com/NTK0611',
  },
}, {
  timestamps: true,
});

module.exports = Portfolio;