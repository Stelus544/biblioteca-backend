const express = require('express');
const router = express.Router();

const { 
  requestLoan, 
  approveLoan,
  rejectLoan,
  getLoans, 
  getMyLoans 
} = require('../controllers/loanController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Obtener préstamos del estudiante logueado
router.get('/my-loans', protect, getMyLoans);

// Solicitar préstamo (Estudiantes y Admins)
router.post('/request', protect, requestLoan);

// Obtener todos los préstamos (Solo Admin)
router.get('/', protect, authorize('admin'), getLoans);

// Aprobar préstamo asignando días (Solo Admin)
router.put('/:id/approve', protect, authorize('admin'), approveLoan);

// Rechazar préstamo (Solo Admin)
router.put('/:id/reject', protect, authorize('admin'), rejectLoan);

module.exports = router;