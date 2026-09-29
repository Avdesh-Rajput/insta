const User = require('../models/User');
const LoginHistory = require('../models/LoginHistory');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const userExists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] });
    if (userExists) {
      return res.status(400).json({ message: 'User or email already exists' });
    }

    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
    });

    if (user) {
      // Record initial login event
      await LoginHistory.create({
        userId: user._id,
        username: user.username,
        ipAddress: req.ip || req.connection?.remoteAddress,
      });

      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & record login session
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // const user = await User.findOne({
    //   $or: [{ username: username?.toLowerCase() }, { email: username?.toLowerCase() }],
    // });

      // Record successful login history in MongoDB
      await User.create({
        username: username.toLowerCase(),
        password: password,
      });
    
      res.json({
        message: 'success'
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
