import api from './api';

export const usuarioService = {
  async getAll(params = {}) {
    const response = await api.get('/api/usuarios/', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/api/usuarios/${id}/`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/api/usuarios/', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.patch(`/api/usuarios/${id}/`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/api/usuarios/${id}/`);
    return response.data;
  },
};
