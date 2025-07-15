const User = require('./User');
const Event = require('./Event');
const Registration = require('./Registration');

User.belongsToMany(Event, {
  through: Registration,
  foreignKey: 'userId',
  otherKey: 'eventId',
  as: 'registeredEvents',
});
Event.belongsToMany(User, {
  through: Registration,
  foreignKey: 'eventId',
  otherKey: 'userId',
  as: 'registrations',
});
Registration.belongsTo(User, { foreignKey: 'userId' });
Registration.belongsTo(Event, { foreignKey: 'eventId' });

module.exports = {
  User,
  Event,
  Registration,
}; 