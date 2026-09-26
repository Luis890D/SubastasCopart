const expressRaw = require('express');
const corsRaw    = require('cors');
const morganRaw  = require('morgan');
const helmetRaw  = require('helmet');
const path       = require('path');

// Helper para compatibilidad de interoperabilidad CJS/ESM con Rolldown / Vercel bundler
const resolve = (m) => {
  let res = m;
  while (res && typeof res === 'object' && res.default && typeof res !== 'function') {
    res = res.default;
  }
  return res;
};

const express = resolve(expressRaw);
const cors    = resolve(corsRaw);
const morgan  = resolve(morganRaw);
const helmet  = resolve(helmetRaw);

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
const authRoutes     = resolve(require('./routes/auth.routes'));
const usuarioRoutes  = resolve(require('./routes/usuario.routes'));
const vehiculoRoutes = resolve(require('./routes/vehiculo.routes'));

// Soporte de subastas si existe
let subastaRoutes;
try {
  subastaRoutes = resolve(require('./routes/subasta.routes'));
} catch (_e) {}

app.use('/api/auth',      authRoutes);
app.use('/auth',          authRoutes);

app.use('/api/usuarios',  usuarioRoutes);
app.use('/usuarios',      usuarioRoutes);

app.use('/api/vehiculos', vehiculoRoutes);
app.use('/vehiculos',     vehiculoRoutes);

if (subastaRoutes) {
  app.use('/api/subastas', subastaRoutes);
  app.use('/subastas',     subastaRoutes);
}

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
module.exports.default = app;

