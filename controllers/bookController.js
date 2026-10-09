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

// Obtener libro por ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ mensaje: 'Libro no encontrado' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el libro', error: error.message });
  }
};

// Crear un libro
exports.createBook = async (req, res) => {
  try {
    const { titulo, sinopsis, portadaUrl, stock } = req.body;

    let portada = '';
    if (req.file) {
      portada = `/uploads/${req.file.filename}`;
    } else if (portadaUrl) {
      portada = portadaUrl;
    } else {
      return res.status(400).json({ mensaje: 'Debes proporcionar una URL o subir un archivo de portada' });
    }

    const newBook = await Book.create({
      titulo,
      sinopsis,
      portada,
      stock: Number(stock) || 1,
      creadoPor: req.user._id
    });

    res.status(201).json({ mensaje: 'Libro creado exitosamente', book: newBook });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el libro', error: error.message });
  }
};

// Actualizar libro
exports.updateBook = async (req, res) => {
  try {
    const { titulo, sinopsis, portadaUrl, disponible, stock } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ mensaje: 'Libro no encontrado' });

    if (req.file) {
      book.portada = `/uploads/${req.file.filename}`;
    } else if (portadaUrl) {
      book.portada = portadaUrl;
    }

    if (titulo) book.titulo = titulo;
    if (sinopsis) book.sinopsis = sinopsis;
    if (stock !== undefined) book.stock = stock;
    if (disponible !== undefined) book.disponible = disponible;

    await book.save();
    res.json({ mensaje: 'Libro actualizado exitosamente', book });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el libro', error: error.message });
  }
};

// Eliminar libro
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ mensaje: 'Libro no encontrado' });

    res.json({ mensaje: 'Libro eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el libro', error: error.message });
  }
};