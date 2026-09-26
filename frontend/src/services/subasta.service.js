import { api } from './api';

export const subastaService = {
  /**
   * Obtiene todas las subastas
   * @returns {Promise<Array>}
   */
  getAll: () => api.get('/subastas'),

  /**
   * Obtiene una subasta por ID
   * @param {number} id
   */
  getById: (id) => api.get(`/subastas/${id}`),

  /**
   * Crea una nueva subasta
   * @param {{ titulo, descripcion, precio_base, fecha_inicio, fecha_fin }} data
   */
  create: (data) => api.post('/subastas', data),

  /**
   * Actualiza una subasta
   * @param {number} id
   * @param {Object} data
   */
  update: (id, data) => api.put(`/subastas/${id}`, data),

  /**
   * Elimina una subasta
   * @param {number} id
   */
  delete: (id) => api.delete(`/subastas/${id}`),

  /**
   * Obtiene las pujas de una subasta
   * @param {number} id
   */
  getPujas: (id) => api.get(`/subastas/${id}/pujas`),

  /**
   * Realiza una puja en una subasta
   * @param {number} id
   * @param {{ monto }} data
   */
  pujar: (id, data) => api.post(`/subastas/${id}/pujas`, data),
};
