const TeamMember = require('../models/TeamMember');

exports.getTeamMembers = async (req, res) => {
  try {
    const team = await TeamMember.find().sort({ createdAt: -1 });
    res.json(team);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el equipo', error: error.message });
  }
};

exports.addTeamMember = async (req, res) => {
  try {
    const { nombre, cargo, fotoUrl } = req.body;
    let foto = '';

    if (req.file) {
      foto = `/uploads/${req.file.filename}`;
    } else if (fotoUrl) {
      foto = fotoUrl;
    } else {
      return res.status(400).json({ mensaje: 'Debes proporcionar una URL o subir una imagen' });
    }

    const member = await TeamMember.create({ nombre, cargo, foto });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar integrante del equipo', error: error.message });
  }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Integrante eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar integrante', error: error.message });
  }
};