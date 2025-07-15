const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/', eventController.createEvent);
router.get('/:id', eventController.getEventDetails);
router.post('/:id/register', eventController.registerForEvent);
router.delete('/:id/register', eventController.cancelRegistration);
router.get('/upcoming', eventController.listUpcomingEvents);
router.get('/:id/stats', eventController.eventStats);

module.exports = router; 