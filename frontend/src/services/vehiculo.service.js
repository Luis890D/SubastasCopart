import { api } from './api';

export const vehiculoService = {
  getAll:  (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([,v]) => v !== '' && v != null))
    ).toString();
    return api.get(`/vehiculos${query ? '?' + query : ''}`);
  },
  getById:     (id)        => api.get(`/vehiculos/${id}`),
  getMios:     ()          => api.get('/vehiculos/mis-publicaciones'),
  create:      (formData)  => {
    const token = localStorage.getItem('token');
    return fetch(`${import.meta.env.VITE_API_URL}/vehiculos`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData, // multipart — NO JSON
    }).then(r => r.json());
  },
  update:      (id, data)  => api.put(`/vehiculos/${id}`, data),
  getFotos:    (id)        => api.get(`/vehiculos/${id}/fotos`),
  addFotos:    (id, formData) => {
    const token = localStorage.getItem('token');
    return fetch(`${import.meta.env.VITE_API_URL}/vehiculos/${id}/fotos`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }).then(r => r.json());
  },
  getPujas:    (id)        => api.get(`/vehiculos/${id}/pujas`),
  pujar:       (id, data)  => api.post(`/vehiculos/${id}/pujas`, data),
};
