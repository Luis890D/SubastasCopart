import { api } from './api';

const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
      ? '/api'
      : 'http://localhost:3000/api');

export const vehiculoService = {
  getAll:  (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([,v]) => v !== '' && v != null))
    ).toString();
    return api.get(`/vehiculos${query ? '?' + query : ''}`);
  },
  getById:     (id)        => api.get(`/vehiculos/${id}`),
  getMios:     ()          => api.get('/vehiculos/mis-publicaciones'),
  getMisPujas: ()          => api.get('/vehiculos/mis-pujas'),
  create:      (formData)  => {
    const token = localStorage.getItem('token');
    return fetch(`${API_BASE}/vehiculos`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData, // multipart — NO JSON
    }).then(r => r.json());
  },
  update:      (id, data)  => api.put(`/vehiculos/${id}`, data),
  getFotos:    (id)        => api.get(`/vehiculos/${id}/fotos`),
  addFotos:    (id, formData) => {
    const token = localStorage.getItem('token');
    return fetch(`${API_BASE}/vehiculos/${id}/fotos`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }).then(r => r.json());
  },
  getPujas:    (id)        => api.get(`/vehiculos/${id}/pujas`),
  pujar:       (id, data)  => api.post(`/vehiculos/${id}/pujas`, data),
};
