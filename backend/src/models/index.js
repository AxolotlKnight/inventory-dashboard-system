const { sequelize, testConnection } = require('../config/database');
const User = require('./User');

const models = {
  User,
  sequelize,
  testConnection
};

module.exports = models;