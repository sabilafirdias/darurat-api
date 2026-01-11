const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Emergency = sequelize.define('Emergency', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  scope: {
    type: DataTypes.ENUM('national', 'provincial'),
    defaultValue: 'national'
  },
  province: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Emergency;