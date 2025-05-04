const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

// Middleware for authentication and authorization would be added here in a real application
// For example: const { authenticate, authorize } = require('../middleware/auth');

// Create availability slots
router.post('/', availabilityController.createSlots); // Admin access

// Generate availability report - IMPORTANT: This route must be defined BEFORE the /:examinerId route
router.get('/report', availabilityController.generateAvailabilityReport); // Admin access

// Get availability for an examiner
router.get('/:examinerId', availabilityController.getAvailability); // Admin/Coordinator access

// Update a specific slot
router.patch('/slots/:slotId', availabilityController.updateSlot); // Admin/Coordinator access

// Toggle slot status
router.put('/status/:slotId', availabilityController.toggleSlotStatus); // Admin access

// Delete a slot
router.delete('/slots/:slotId', availabilityController.deleteSlot); // Admin access

module.exports = router;