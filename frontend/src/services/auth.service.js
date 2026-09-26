import { api } from './api';

export const authService = {
  /**
   * Registra un nuevo usuario
   * @param {{ nombre, correo, password }} data
   */
  register: (data) => api.post('/auth/register', data),

  /**
   * Inicia sesión y guarda el token JWT en localStorage
   * @param {{ correo, password }} credentials
   */
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.data));
    }
    return res;
  },

  /**
   * Cierra sesión limpiando el localStorage
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Devuelve el usuario actual desde localStorage
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Indica si hay sesión activa
   */
  isAuthenticated: () => !!localStorage.getItem('token'),
};
