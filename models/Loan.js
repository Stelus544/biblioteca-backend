const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  libro: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  estado: { 
    type: String, 
    enum: ['pendiente', 'aprobado', 'rechazado', 'devuelto'], 
    default: 'pendiente' 
  },
  fechaSolicitud: { type: Date, default: Date.now },
  fechaInicio: { type: Date },
  fechaVencimiento: { type: Date }, // Para calcular la cuenta regresiva
  diasAprobados: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);