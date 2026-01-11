const { ApiKey } = require('../models');

const verifyApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ error: 'API Key required in header: X-API-Key' });
  }

  const keyRecord = await ApiKey.findOne({
    where: { key: apiKey, isActive: true },
    include: [{ model: require('../models/User'), attributes: ['id', 'name'] }]
  });

  if (!keyRecord) {
    return res.status(401).json({ error: 'Invalid or inactive API Key' });
  }

  req.user = keyRecord.User;
  next();
};

module.exports = { verifyApiKey };