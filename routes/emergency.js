const express = require('express');
const router = express.Router();
const { verifyApiKey } = require('../middleware/auth');
const { getEmergency, getAllEmergencies } = require('../controllers/emergencyController');

router.get('/emergency', verifyApiKey, getEmergency);
router.get('/emergencies', verifyApiKey, getAllEmergencies);

module.exports = router;