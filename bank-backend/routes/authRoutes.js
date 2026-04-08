const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  updateProfile,
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.patch('/users/:id', updateProfile);

module.exports = router;
