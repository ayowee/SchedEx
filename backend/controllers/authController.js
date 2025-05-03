const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT secret key - should be in environment variables in production
const JWT_SECRET = 'your-secret-key';

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // For first time login, just check email
    if (user.isFirstLogin && !user.password) {
      return res.json({
        isFirstLogin: true,
        email: user.email,
        message: 'First time login. Please set your password.'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        userType: user.userType
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        fullName: user.fullName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.setInitialPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isFirstLogin) {
      return res.status(400).json({ message: 'Password already set' });
    }

    user.password = password;
    user.isFirstLogin = false;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        userType: user.userType
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        fullName: user.fullName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
