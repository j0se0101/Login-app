require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Seguridad y Middlewares
if (process.env.NODE_ENV === 'production') {
  // Necesario si hay proxy/load balancer para cookies secure
  app.set('trust proxy', 1);
}

app.use(helmet());

// CORS con múltiples orígenes permitidos
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173';
const allowedOrigins = CLIENT_ORIGIN.split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // En producción, permitir requests sin origen (mobile apps, Postman) o si coincide
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Loggear intentos rechazados en producción
    if (process.env.NODE_ENV === 'production') {
      console.warn(`CORS bloqueó origen: ${origin}`);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100
});
app.use(limiter);
app.use(express.json());
app.use(cookieParser());

// Ruta de diagnóstico para verificar cookies/origen
app.get('/api/auth/debug-cookie', (req, res) => {
  res.json({
    hasToken: Boolean(req.cookies?.token),
    origin: req.headers.origin || null,
    allowedOrigins
  });
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: '🚀 API de Autenticación',
    rutas: {
      registro: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      perfil: 'GET /api/auth/me'
    }
  });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Manejo de errores para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path 
  });
});

// Conexión a MongoDB y inicio del servidor
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conexión exitosa a MongoDB Atlas');
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en puerto: ${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
      if (process.env.NODE_ENV === 'production') {
        console.log(`🔒 Orígenes permitidos: ${allowedOrigins.join(', ')}`);
      }
    });
    
    // Manejo graceful shutdown
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM recibido, cerrando servidor...');
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log('✅ Servidor cerrado correctamente');
          process.exit(0);
        });
      });
    });
  })
  .catch((error) => {
    console.error('❌ Error de conexión:', error.message);
    process.exit(1);
  });
