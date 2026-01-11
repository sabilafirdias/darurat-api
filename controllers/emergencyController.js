const { Emergency } = require('../models');

exports.getEmergency = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      const allEmergencies = await Emergency.findAll({
        attributes: ['id', 'category', 'name', 'number', 'scope', 'province', 'description', 'createdAt', 'updatedAt']
      });
      return res.json({
        status: 'success',
        total: allEmergencies.length,
        data: allEmergencies
      });
    }

    const emergency = await Emergency.findOne({ where: { category } });
    if (!emergency) {
      return res.status(404).json({ 
        error: `No emergency contact found for category: ${category}` 
      });
    }
    res.json({ status: 'success', data: emergency });
  } catch (error) {
    console.error('Error in getEmergency:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllEmergencies = async (req, res) => {
  try {
    const data = await Emergency.findAll();
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};