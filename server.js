const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const emergencyRoutes = require('./routes/emergency');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', emergencyRoutes);

sequelize.authenticate().then(() => {
  console.log('Connected to PostgreSQL');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Database connection failed:', err);
});
