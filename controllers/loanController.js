const Loan = require('../models/Loan');
const Book = require('../models/Book');

// Solicitar un préstamo (Estudiante)
exports.requestLoan = async (req, res) => {
  try {
    const { libroId } = req.body;
    const book = await Book.findById(libroId);

    if (!book || book.stock <= 0) {
      return res.status(400).json({ mensaje: 'El libro no tiene ejemplares disponibles' });
    }

    const loan = await Loan.create({
      usuario: req.user._id,
      libro: libroId,
      estado: 'pendiente'
    });

    res.status(201).json({ mensaje: 'Solicitud enviada con éxito', loan });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al solicitar el préstamo', error: error.message });
  }
};

// Aprobar un préstamo (Admin)
exports.approveLoan = async (req, res) => {
  try {
    const { dias } = req.body;
    const loan = await Loan.findById(req.params.id).populate('libro');

    if (!loan) {
      return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
    }

    if (loan.estado === 'aprobado') {
      return res.status(400).json({ mensaje: 'El préstamo ya está aprobado' });
    }

    const book = await Book.findById(loan.libro._id);
    if (!book || book.stock <= 0) {
      return res.status(400).json({ mensaje: 'No hay ejemplares disponibles de este libro' });
    }

    // Descontar 1 del stock
    book.stock = book.stock - 1;
    await book.save();

    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaVencimiento.getDate() + (Number(dias) || 7));

    loan.estado = 'aprobado';
    loan.diasAprobados = Number(dias) || 7;
    loan.fechaVencimiento = fechaVencimiento;
    await loan.save();

    res.json({ mensaje: 'Préstamo aprobado con éxito', loan });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al aprobar el préstamo', error: error.message });
  }
};

// Rechazar solicitud de préstamo (Admin)
exports.rejectLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
    }

    if (loan.estado !== 'pendiente') {
      return res.status(400).json({ mensaje: 'Solo se pueden rechazar solicitudes pendientes' });
    }

    loan.estado = 'rechazado';
    await loan.save();

    res.json({ mensaje: 'Solicitud de préstamo rechazada', loan });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al rechazar el préstamo', error: error.message });
  }
};

// Obtener todos los préstamos (Admin)
exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('usuario', 'nombre email curso')
      .populate('libro', 'titulo portada')
      .sort({ createdAt: -1 });

    res.json(loans);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener préstamos', error: error.message });
  }
};

// Obtener los préstamos del usuario logueado
exports.getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ usuario: req.user._id })
      .populate('libro', 'titulo portada')
      .sort({ createdAt: -1 });

    res.json(loans);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener tus préstamos', error: error.message });
  }
};