import api from './api';

export const ticketService = {
  async getAll(params = {}) {
    const response = await api.get('/api/tickets/', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/api/tickets/${id}/`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/api/tickets/', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.patch(`/api/tickets/${id}/`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/api/tickets/${id}/`);
    return response.data;
  },
};
