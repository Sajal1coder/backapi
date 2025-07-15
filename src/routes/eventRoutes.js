const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Create Event
router.post('/', eventController.createEvent);

// Get Event Details
router.get('/:id', eventController.getEventDetails);

// Register for Event
router.post('/:id/register', eventController.registerForEvent);

// Cancel Registration
router.delete('/:id/register', eventController.cancelRegistration);

// List Upcoming Events
router.get('/upcoming', eventController.listUpcomingEvents);

// Event Stats
router.get('/:id/stats', eventController.eventStats);

module.exports = router; 