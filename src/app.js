require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const eventRoutes = require('./routes/eventRoutes');
app.use('/events', eventRoutes);

app.get('/', (req, res) => {
  res.send('Event Management API');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 