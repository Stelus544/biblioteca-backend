const Loan = require('../models/Loan');
const Book = require('../models/Book');

// 1. Solicitar un préstamo (Estudiante / Usuario)
exports.requestLoan = async (req, res) => {
  try {
    // Acepta cualquier variación de nombre proveniente del body
    const libroId = req.body.libroId || req.body.bookId || req.body.libro;

    if (!libroId) {
      return res.status(400).json({ mensaje: 'ID del libro no especificado.' });
    }

    const book = await Book.findById(libroId);

    if (!book) {
      return res.status(404).json({ mensaje: 'El libro solicitado no existe.' });
    }

    // Verificar si hay ejemplares disponibles (soporta stock, ejemplares o copias)
    const stockDisponible = book.stock ?? book.ejemplares ?? book.copias ?? 0;

    if (stockDisponible <= 0) {
      return res.status(400).json({ mensaje: 'El libro no tiene ejemplares disponibles.' });
    }

    const userId = req.user._id || req.user.id;

    // Evitar solicitudes duplicadas pendientes para el mismo libro
    const prestamoExistente = await Loan.findOne({
      usuario: userId,
      libro: libroId,
      estado: { $in: ['pendiente', 'prestado', 'aprobado'] }
    });

    if (prestamoExistente) {
      return res.status(400).json({
        mensaje: 'Ya tienes una solicitud pendiente o activa para este libro.'
      });
    }

    // Crear el préstamo en estado pendiente (El stock se descuenta al aprobar)
    const loan = await Loan.create({
      usuario: userId,
      libro: libroId,
      estado: 'pendiente'
    });

    return res.status(201).json({
      mensaje: '✅ Solicitud enviada con éxito',
      loan
    });
  } catch (error) {
    console.error('Error en requestLoan:', error);
    return res.status(500).json({
      mensaje: 'Error al solicitar el préstamo',
      error: error.message
    });
  }
};

// 2. Aprobar un préstamo (Admin)
exports.approveLoan = async (req, res) => {
  try {
    const { dias } = req.body;
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
    }

    if (loan.estado === 'aprobado' || loan.estado === 'prestado') {
      return res.status(400).json({ mensaje: 'El préstamo ya ha sido aprobado previamente' });
    }

    const book = await Book.findById(loan.libro);

    if (!book) {
      return res.status(404).json({ mensaje: 'El libro asociado ya no existe' });
    }

    const stockDisponible = book.stock ?? book.ejemplares ?? book.copias ?? 0;

    if (stockDisponible <= 0) {
      return res.status(400).json({ mensaje: 'No hay ejemplares disponibles para aprobar esta solicitud' });
    }

    // Descontar 1 del stock disponible
    if (book.stock !== undefined) book.stock -= 1;
    else if (book.ejemplares !== undefined) book.ejemplares -= 1;
    else if (book.copias !== undefined) book.copias -= 1;
    
    await book.save();

    // Calcular fecha de vencimiento
    const diasAsignados = Number(dias) || 7;
    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaVencimiento.getDate() + diasAsignados);

    loan.estado = 'aprobado';
    loan.diasAprobados = diasAsignados;
    loan.fechaVencimiento = fechaVencimiento;
    await loan.save();

    return res.json({
      mensaje: '✅ Préstamo aprobado con éxito',
      loan
    });
  } catch (error) {
    console.error('Error en approveLoan:', error);
    return res.status(500).json({
      mensaje: 'Error al aprobar el préstamo',
      error: error.message
    });
  }
};

// 3. Rechazar solicitud de préstamo (Admin)
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

    return res.json({
      mensaje: 'Solicitud de préstamo rechazada',
      loan
    });
  } catch (error) {
    console.error('Error en rejectLoan:', error);
    return res.status(500).json({
      mensaje: 'Error al rechazar el préstamo',
      error: error.message
    });
  }
};

// 4. Obtener todos los préstamos (Admin)
exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('usuario', 'nombre nombreCompleto email curso grupo rol role')
      .populate('libro', 'titulo portada portadaUrl autor stock ejemplares')
      .sort({ createdAt: -1 });

    return res.json(loans);
  } catch (error) {
    console.error('Error en getLoans:', error);
    return res.status(500).json({
      mensaje: 'Error al obtener los préstamos',
      error: error.message
    });
  }
};

// 5. Obtener los préstamos del usuario logueado
exports.getMyLoans = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const loans = await Loan.find({ usuario: userId })
      .populate('libro', 'titulo portada portadaUrl autor')
      .sort({ createdAt: -1 });

    return res.json(loans);
  } catch (error) {
    console.error('Error en getMyLoans:', error);
    return res.status(500).json({
      mensaje: 'Error al obtener tus préstamos',
      error: error.message
    });
  }
};