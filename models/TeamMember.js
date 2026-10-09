const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cargo: { type: String, required: true }, // ej: "Monitor de Biblioteca", "Organizador de Catálogo"
  foto: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);