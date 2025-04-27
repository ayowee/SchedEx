const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/presentationController');

router.get('/', ctrl.getAllPresentations);
router.post('/', ctrl.createPresentation);
router.put('/:id', ctrl.updatePresentation);
router.delete('/:id', ctrl.deletePresentation);

module.exports = router;
