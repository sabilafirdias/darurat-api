const { sequelize } = require('../config/database');
const User = require('./User');
const ApiKey = require('./Apikey');
const Admin = require('./Admin');
const Emergency = require('./Emergency');

ApiKey.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(ApiKey, { foreignKey: 'userId' });

module.exports = { sequelize, User, ApiKey, Admin, Emergency };