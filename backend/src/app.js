const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const helmet  = require('helmet');
const path    = require('path');

const app = express();

// ── Middlewares globales ──────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false })); // permite servir imágenes
app.use(cors({
  origin: true, // Refleja el origen de la petición (Vercel, localhost, Render)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Archivos estáticos (imágenes subidas) ─────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Rutas API (soporta con y sin prefijo /api para Vercel rewrites) ───────────
const authRoutes     = require('./routes/auth.routes');
const usuarioRoutes  = require('./routes/usuario.routes');
const vehiculoRoutes = require('./routes/vehiculo.routes');

app.use('/api/auth',      authRoutes);
app.use('/auth',          authRoutes);

app.use('/api/usuarios',  usuarioRoutes);
app.use('/usuarios',      usuarioRoutes);

app.use('/api/vehiculos', vehiculoRoutes);
app.use('/vehiculos',     vehiculoRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get(['/api/health', '/health'], (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Ruta no encontrada' });
});

// ── Error global ──────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Error interno del servidor',
    details: err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

module.exports = app;
