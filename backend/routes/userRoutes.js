const express = require('express');
const { registerUser, authUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// User registration route
router.post('/register', registerUser);

// User login route
router.post('/login', authUser);

// Example of protected route
router.get('/profile', protect, (req, res) => {
  res.send('User profile data');
});

module.exports = router;
