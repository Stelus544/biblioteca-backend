const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  portada: { type: String, required: true },
  sinopsis: { type: String, required: true },
  stock: { type: Number, default: 1, min: 0 }, // Cantidad de ejemplares
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);