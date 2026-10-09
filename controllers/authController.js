const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    const { nombre, email, password, curso } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ mensaje: 'El correo ya existe' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      nombre,
      email,
      password: hashedPassword,
      curso,
      role: 'user'
    });

    res.status(201).json({
      mensaje: 'Usuario registrado con éxito',
      user: {
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        curso: user.curso,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ mensaje: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ mensaje: 'Credenciales inválidas' });

    res.json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      curso: user.curso,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener perfil', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
};

exports.updateUserRoleAndCourse = async (req, res) => {
  try {
    const { role, curso } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    if (role) user.role = role;
    if (curso) user.curso = curso;

    await user.save();
    res.json({ mensaje: 'Usuario actualizado', user });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
};