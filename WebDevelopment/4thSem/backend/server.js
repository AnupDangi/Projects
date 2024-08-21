require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
    process.exit(1);
  });

const User = mongoose.model('User', {
  username: String,
  password: String
});

const loginAttemptSchema = new mongoose.Schema({
  username: String,
  loginTime: { type: Date, default: Date.now },
  successful: Boolean
});

const LoginAttempt = mongoose.model('LoginAttempt', loginAttemptSchema);

app.post('/signup', async (req, res) => {
  try {
    console.log('Signup attempt:', req.body);
    const { username, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists. Please choose a different username.' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    console.log('User created:', user);
    res.status(201).json({ message: 'User created successfully. You can now log in.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'An error occurred during signup. Please try again later.', error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log('User found:', user);
    if (!user) {
      return res.status(401).json({ message: 'User not found. Please check your username or sign up.' });
    }
    const isSuccess = await bcrypt.compare(password, user.password);
    console.log('Password match:', isSuccess);

    const loginAttempt = new LoginAttempt({
      username,
      successful: isSuccess
    });
    await loginAttempt.save();

    if (isSuccess) {
      const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful. Welcome back!', token });
    } else {
      res.status(401).json({ message: 'Invalid password. Please try again.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login. Please try again later.', error: error.message });
  }
});

app.get('/verify-token', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'No token provided. Please log in.' });
  }
  
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
    }
    res.status(200).json({ message: 'Token is valid. User is authenticated.', userId: decoded.userId });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));