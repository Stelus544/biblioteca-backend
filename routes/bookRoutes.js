const express = require('express');
const router = express.Router();
const { 
  getBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook 
} = require('../controllers/bookController');

const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Rutas de lectura para usuarios autenticados
router.get('/', protect, getBooks);
router.get('/:id', protect, getBookById);

// Rutas de administración (crear, editar, eliminar)
router.post('/', protect, authorize('admin'), upload.single('portada'), createBook);
router.put('/:id', protect, authorize('admin'), upload.single('portada'), updateBook);
router.delete('/:id', protect, authorize('admin'), deleteBook);

module.exports = router;