const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    descripcion: { type: String, default: '' }, // Campo de sinopsis
    categoria: { type: String, default: 'Literatura' },
    clasificacion: { type: String, default: '' }, // Clasificación manual
    stock: { type: Number, default: 1 },
    portada: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);