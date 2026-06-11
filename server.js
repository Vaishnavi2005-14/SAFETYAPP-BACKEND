const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authMiddleware = require('./middleware/auth');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');

const app = express();

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/safeher';
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/google', authController.googleLogin);

app.get('/api/user/data', authMiddleware, userController.getData);
app.put('/api/user/profile', authMiddleware, userController.updateProfile);
app.put('/api/user/contacts', authMiddleware, userController.updateContacts);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
