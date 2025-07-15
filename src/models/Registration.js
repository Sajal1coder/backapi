const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Registration = sequelize.define('Registration', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  eventId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'events',
      key: 'id',
    },
  },
}, {
  tableName: 'registrations',
  timestamps: false,
});

module.exports = Registration; 