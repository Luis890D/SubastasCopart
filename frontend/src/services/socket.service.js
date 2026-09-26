import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

let socket = null;

export const socketService = {
  connect() {
    if (!socket) {
      socket = io(SOCKET_URL, { autoConnect: true });
    }
    return socket;
  },

  unirseSubasta(vehiculo_id) {
    if (socket) socket.emit('unirse_subasta', vehiculo_id);
  },

  onNuevaPuja(callback) {
    if (socket) socket.on('nueva_puja', callback);
  },

  offNuevaPuja() {
    if (socket) socket.off('nueva_puja');
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket() { return socket; },
};
