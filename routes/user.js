const express = require('express');
const router = express.Router();
const { generateApiKey, verifyToken } = require('../controllers/userController');
    
router.post('/generate-api-key', verifyToken, generateApiKey);

module.exports = router;