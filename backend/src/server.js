require('dotenv').config();
const http       = require('http');
const { Server } = require('socket.io');
const app        = require('./app');

const PORT   = process.env.PORT || 3000;
const server = http.createServer(app);

// ── Socket.io ─────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin:  process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`);

  // El cliente se une a la sala de una subasta específica
  socket.on('unirse_subasta', (vehiculo_id) => {
    socket.join(`subasta-${vehiculo_id}`);
    console.log(`👤 ${socket.id} se unió a subasta-${vehiculo_id}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`);
  });
});

// Exportar io para usarlo en los controladores
module.exports.io = io;

// ── Iniciar servidor ──────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔗 Socket.io activo`);
  console.log(`📦 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📅 ${new Date().toLocaleString()}\n`);
});
