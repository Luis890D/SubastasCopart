/**
 * api.js - Cliente HTTP centralizado usando fetch
 * Todas las llamadas al backend pasan por aquí.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Obtiene el token JWT del localStorage
 */
const getToken = () => localStorage.getItem('token');

/**
 * Realiza una petición HTTP al backend
 * @param {string} endpoint  - Ruta relativa, ej: '/subastas'
 * @param {RequestInit} options - Opciones de fetch
 * @returns {Promise<any>}
 */
const request = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }

  return data;
};

// ── Helpers de conveniencia ────────────────────────────────────────────────────
export const api = {
  get:    (endpoint)              => request(endpoint, { method: 'GET' }),
  post:   (endpoint, body)        => request(endpoint, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (endpoint, body)        => request(endpoint, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (endpoint)              => request(endpoint, { method: 'DELETE' }),
};
