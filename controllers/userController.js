const { ApiKey } = require('../models');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'darurat_api_secret_2026';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const generateApiKey = async (req, res) => {
  console.log('Generate API key (mengganti yang lama jika ada)...');
  
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const activeKey = await ApiKey.findOne({
      where: { userId: req.user.id, isActive: true }
    });

    if (activeKey) {
      console.log('Menonaktifkan API key lama:', activeKey.key);
      activeKey.isActive = false;
      await activeKey.save();
    }

    const apiKeyValue = 'dar_' + uuidv4().replace(/-/g, '').substring(0, 12);
    const newKey = await ApiKey.create({
      userId: req.user.id,
      key: apiKeyValue,
      isActive: true
    });

    console.log('API key baru dibuat:', newKey.key);
    return res.status(201).json({
      message: 'New API Key generated successfully',
      key: newKey.key
    });

  } catch (error) {
    console.error('Error generating API key:', error);
    return res.status(500).json({ error: 'Failed to generate API key' });
  }
};

const getApiKey = async (req, res) => {
  try {
    const userId = req.user.id;
    const key = await ApiKey.findOne({ 
      where: { userId, isActive: true },
      attributes: ['key']
    });

    if (!key) {
      return res.status(404).json({ error: 'API key not found' });
    }

    res.json({ key: key.key });
  } catch (error) {
    console.error('Error fetching API key:', error);
    res.status(500).json({ error: 'Failed to retrieve API key' });
  }
};

module.exports = { generateApiKey, verifyToken, getApiKey };