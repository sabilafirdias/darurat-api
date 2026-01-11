const express = require('express');
const router = express.Router();
const {
  verifyAdminToken,
  getAllEmergencies,
  getEmergencyById,
  createEmergency,
  updateEmergency,
  deleteEmergency
} = require('../controllers/adminController');

router.use(verifyAdminToken);

router.get('/emergency/:id', getEmergencyById);

router.get('/emergency', getAllEmergencies);
router.post('/emergency', createEmergency);
router.put('/emergency/:id', updateEmergency);
router.delete('/emergency/:id', deleteEmergency);

module.exports = router;