const express = require('express');
const router = express.Router();
const { 
  getBooks, 
  createBook, 
  updateBook, 
  deleteBook 
} = require('../controllers/bookController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Obtener todos los libros
router.get('/', getBooks);

// Crear un libro (Solo Admin)
router.post('/', protect, authorize('admin'), createBook);

// Actualizar un libro (Solo Admin)
router.put('/:id', protect, authorize('admin'), updateBook);

// Eliminar un libro (Solo Admin)
router.delete('/:id', protect, authorize('admin'), deleteBook);

module.exports = router;