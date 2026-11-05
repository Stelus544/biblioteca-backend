const Book = require('../models/Book');

// Obtener todos los libros
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los libros', error: error.message });
  }
};

// Crear un libro (Admin)
exports.createBook = async (req, res) => {
  try {
    const { titulo, autor, descripcion, categoria, clasificacion, stock, portada } = req.body;

    const nuevoLibro = await Book.create({
      titulo,
      autor: autor || 'Autor desconocido',
      descripcion: descripcion || '',
      categoria: categoria || 'Literatura',
      clasificacion: clasificacion || '',
      stock: Number(stock) || 1,
      portada: portada || '' // Guarda la URL directamente
    });

    res.status(201).json({ mensaje: '✅ Libro creado con éxito', book: nuevoLibro });
  } catch (error) {
    console.error('Error al crear libro:', error);
    res.status(500).json({ mensaje: 'Error al registrar el libro', error: error.message });
  }
};

// Actualizar un libro (Admin)
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, descripcion, categoria, clasificacion, stock, portada } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { titulo, autor, descripcion, categoria, clasificacion, stock, portada },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ mensaje: 'Libro no encontrado' });
    }

    res.json({ mensaje: '✅ Libro actualizado con éxito', book: updatedBook });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el libro', error: error.message });
  }
};

// Eliminar un libro (Admin)
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ mensaje: 'Libro no encontrado' });
    }

    res.json({ mensaje: '✅ Libro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el libro', error: error.message });
  }
};