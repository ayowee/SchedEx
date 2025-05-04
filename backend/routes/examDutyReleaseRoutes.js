const express = require('express');
const router = express.Router();
const examDutyReleaseController = require('../controllers/examDutyReleaseController');

// Create a new exam duty release request
router.post('/', examDutyReleaseController.createExamDutyRelease);

// Get all exam duty release requests with optional filters
router.get('/', examDutyReleaseController.getExamDutyReleases);

// Get a specific exam duty release request
router.get('/:id', examDutyReleaseController.getExamDutyRelease);

// Update the status of an exam duty release request (for admin/approvers)
router.patch('/:id/status', examDutyReleaseController.updateExamDutyReleaseStatus);

// Delete an exam duty release request (only if pending)
router.delete('/:id', examDutyReleaseController.deleteExamDutyRelease);

module.exports = router;
