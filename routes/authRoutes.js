const express = require('express');
const router = express.Router();

const { 
  register, 
  login, 
  getProfile, 
  getAllUsers, 
  updateUserRoleAndCourse 
} = require('../controllers/authController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Rutas Públicas
router.post('/register', register);
router.post('/login', login);

// Rutas Protegidas
router.get('/profile', protect, getProfile);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id', protect, authorize('admin'), updateUserRoleAndCourse);

module.exports = router;