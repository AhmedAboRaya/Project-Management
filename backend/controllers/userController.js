const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!email || !password || !name)  {
    return res.status(400).json('Please fill all required fields');
  }
  if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
    return res.status(400).json('Invalid email address');
  }
  if (password.length < 6) {
    return res.status(400).json('Password must be at least 6 characters long');
  }


  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    return res.status(400).json('Invalid user data');
  }
});


const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password)  {
    return res.status(400).json('Please provide email and password');
  }
  if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
    return res.status(400).json('Invalid email address');
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    return res.status(401).json('Invalid credentials');
  }
});

module.exports = { registerUser, authUser };
