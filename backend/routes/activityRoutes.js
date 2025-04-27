const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/activityController');

router.get('/', ctrl.getRecentActivities);
router.post('/', ctrl.createActivity);

module.exports = router;
