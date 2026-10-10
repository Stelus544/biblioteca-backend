const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Configuración de CORS para permitir Vercel y Localhost
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://biblioteca-frontend-tan.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permitir en desarrollo si cambia el dominio
    }
  },
  credentials: true
}));

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir la carpeta uploads para acceder a las imágenes estáticas/portadas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Conectado exitosamente'))
  .catch((err) => console.error('Error al conectar MongoDB:', err));

// Rutas de la API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/loans', require('./routes/loanRoutes'));
app.use('/api/team', require('./routes/teamRoutes'));

// Manejo de rutas no encontradas (404) en la API
// ✅ OPCIÓN RECOMENDADA (Usar regex para capturar cualquier subruta de /api):
app.use(/\/api\/.*/, (req, res) => {
  res.status(404).json({ mensaje: `La ruta API '${req.originalUrl}' no existe.` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});