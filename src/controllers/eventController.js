const { Event } = require('../models');

module.exports = {
  async createEvent(req, res) {
    try {
      const { title, datetime, location, capacity } = req.body;
      // Validate required fields
      if (!title || !datetime || !location || capacity === undefined) {
        return res.status(400).json({ message: 'Missing required fields.' });
      }
      // Validate capacity
      if (typeof capacity !== 'number' || capacity < 1 || capacity > 1000) {
        return res.status(400).json({ message: 'Capacity must be a positive integer (1-1000).' });
      }
      // Validate datetime (ISO format)
      const eventDate = new Date(datetime);
      if (isNaN(eventDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format. Use ISO format.' });
      }
      // Create event
      const event = await Event.create({ title, datetime: eventDate, location, capacity });
      return res.status(201).json({ eventId: event.id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  },
  async getEventDetails(req, res) {
    const { Event, User } = require('../models');
    try {
      const event = await Event.findByPk(req.params.id, {
        include: [{
          model: User,
          as: 'registrations',
          attributes: ['id', 'name', 'email'],
          through: { attributes: [] },
        }],
      });
      if (!event) {
        return res.status(404).json({ message: 'Event not found.' });
      }
      return res.json(event);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  },
  async registerForEvent(req, res) {
    const { Event, User, Registration } = require('../models');
    const sequelize = require('../db/sequelize');
    try {
      const { userId } = req.body;
      const eventId = req.params.id;
      if (!userId) {
        return res.status(400).json({ message: 'Missing userId in request body.' });
      }
      // Use transaction for concurrency safety
      await sequelize.transaction(async (t) => {
        // Find event
        const event = await Event.findByPk(eventId, { transaction: t });
        if (!event) {
          return res.status(404).json({ message: 'Event not found.' });
        }
        // Check if event is in the past
        if (new Date(event.datetime) < new Date()) {
          return res.status(400).json({ message: 'Cannot register for past events.' });
        }
        // Check if user exists
        const user = await User.findByPk(userId, { transaction: t });
        if (!user) {
          return res.status(404).json({ message: 'User not found.' });
        }
        // Check for duplicate registration
        const existing = await Registration.findOne({ where: { userId, eventId }, transaction: t });
        if (existing) {
          return res.status(409).json({ message: 'User already registered for this event.' });
        }
        // Check if event is full
        const count = await Registration.count({ where: { eventId }, transaction: t });
        if (count >= event.capacity) {
          return res.status(400).json({ message: 'Event is full.' });
        }
        // Register user
        await Registration.create({ userId, eventId }, { transaction: t });
        res.status(201).json({ message: 'Registration successful.' });
      });
    } catch (err) {
      // If response already sent, do nothing
      if (!res.headersSent) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
      }
    }
  },
  async cancelRegistration(req, res) {
    const { Registration, User, Event } = require('../models');
    const sequelize = require('../db/sequelize');
    try {
      const { userId } = req.body;
      const eventId = req.params.id;
      if (!userId) {
        return res.status(400).json({ message: 'Missing userId in request body.' });
      }
      await sequelize.transaction(async (t) => {
        // Check if event exists
        const event = await Event.findByPk(eventId, { transaction: t });
        if (!event) {
          return res.status(404).json({ message: 'Event not found.' });
        }
        // Check if user exists
        const user = await User.findByPk(userId, { transaction: t });
        if (!user) {
          return res.status(404).json({ message: 'User not found.' });
        }
        // Check if registration exists
        const registration = await Registration.findOne({ where: { userId, eventId }, transaction: t });
        if (!registration) {
          return res.status(404).json({ message: 'User is not registered for this event.' });
        }
        await registration.destroy({ transaction: t });
        res.json({ message: 'Registration cancelled.' });
      });
    } catch (err) {
      if (!res.headersSent) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
      }
    }
  },

  async listUpcomingEvents(req, res) {
    const { Event, User } = require('../models');
    try {
      const now = new Date();
      let events = await Event.findAll({
        where: { datetime: { [require('sequelize').Op.gt]: now } },
        include: [{
          model: User,
          as: 'registrations',
          attributes: ['id', 'name', 'email'],
          through: { attributes: [] },
        }],
      });
      // Custom sort: by date ascending, then by location alphabetically
      events = events.sort((a, b) => {
        const dateDiff = new Date(a.datetime) - new Date(b.datetime);
        if (dateDiff !== 0) return dateDiff;
        return a.location.localeCompare(b.location);
      });
      res.json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error.' });
    }
  },

  async eventStats(req, res) {
    const { Event, Registration } = require('../models');
    try {
      const eventId = req.params.id;
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found.' });
      }
      const totalRegistrations = await Registration.count({ where: { eventId } });
      const remainingCapacity = event.capacity - totalRegistrations;
      const percentUsed = event.capacity === 0 ? 0 : Math.round((totalRegistrations / event.capacity) * 100);
      res.json({
        totalRegistrations,
        remainingCapacity,
        percentUsed,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error.' });
    }
  },
}; 