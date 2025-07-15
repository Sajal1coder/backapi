const sequelize = require('./sequelize');
require('../models'); // Import models and associations

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Database sync failed:', err);
    process.exit(1);
  }
})(); 