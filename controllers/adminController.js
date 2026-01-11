const { User, ApiKey, Emergency } = require('../models');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'darurat_api_secret_2026';

const verifyAdminToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Admin token required' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access only' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid admin token' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'createdAt'],
      include: [{
        model: ApiKey,
        attributes: ['key', 'isActive', 'createdAt']
      }]
    });
    res.json({ status: 'success', data: users });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAllApiKeys = async (req, res) => {
  try {
    const keys = await ApiKey.findAll({
      include: [{
        model: User,
        attributes: ['id', 'name', 'email']
      }]
    });
    res.json({ status: 'success', data: keys });
  } catch (error) {
    console.error('Error in getAllApiKeys:', error);
    res.status(500).json({ error: error.message });
  }
};

const toggleApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    const key = await ApiKey.findByPk(id);
    if (!key) {
      return res.status(404).json({ error: 'API Key not found' });
    }
    key.isActive = !key.isActive;
    await key.save();
    res.json({
      status: 'success',
      message: `API Key ${key.isActive ? 'activated' : 'deactivated'}`,
      key: key.key,
      isActive: key.isActive
    });
  } catch (error) {
    console.error('Error in toggleApiKey:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.json({ status: 'success', message: 'User deleted' });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAllEmergencies = async (req, res) => {
  try {
    const emergencies = await Emergency.findAll();
    res.json({ status: 'success', data: emergencies });
  } catch (error) {
    console.error('Error fetching emergencies:', error);
    res.status(500).json({ error: error.message });
  }
};

const getEmergencyById = async (req, res) => {
  try {
    const { id } = req.params;
    const emergency = await Emergency.findByPk(id);
    if (!emergency) {
      return res.status(404).json({ error: 'Emergency contact not found' });
    }
    res.json({ status: 'success',  emergency });
  } catch (error) {
    console.error('Error fetching single emergency:', error);
    res.status(500).json({ error: error.message });
  }
};

const createEmergency = async (req, res) => {
  try {
    const { category, name, number, scope = 'national', province, description } = req.body;
    
    if (!category || !name || !number) {
      return res.status(400).json({ error: 'Category, name, and number are required' });
    }

    const emergency = await Emergency.create({
      category,
      name,
      number,
      scope,
      province,
      description
    });
    res.status(201).json({ message: 'Emergency contact created', data: emergency });
  } catch (error) {
    console.error('Error creating emergency:', error);
    res.status(400).json({ error: error.message });
  }
};

const updateEmergency = async (req, res) => {
  console.log('Update emergency ID:', req.params.id);
  try {
    const { id } = req.params;
    const { category, name, number, scope, province, description } = req.body;

    const emergency = await Emergency.findByPk(id);
    if (!emergency) {
      console.log('Emergency not found:', id);
      return res.status(404).json({ error: 'Emergency contact not found' });
    }

    await emergency.update({
      category,
      name,
      number,
      scope,
      province,
      description
    });

    console.log('Emergency updated:', emergency.id);
    res.json({ message: 'Emergency contact updated',  emergency });
  } catch (error) {
    console.error('Error updating emergency:', error);
    res.status(400).json({ error: error.message });
  }
};

const deleteEmergency = async (req, res) => {
  try {
    const { id } = req.params;
    const emergency = await Emergency.findByPk(id);
    if (!emergency) {
      return res.status(404).json({ error: 'Emergency contact not found' });
    }
    await emergency.destroy();
    res.json({ message: 'Emergency contact deleted' });
  } catch (error) {
    console.error('Error deleting emergency:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  verifyAdminToken,
  getAllUsers,
  getAllApiKeys,
  toggleApiKey,
  deleteUser,
  getEmergencyById,
  getAllEmergencies,
  createEmergency,
  updateEmergency,
  deleteEmergency
};