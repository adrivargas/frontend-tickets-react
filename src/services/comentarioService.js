import api from './api';

export const comentarioService = {
  async getByTicket(ticketId) {
    const response = await api.get('/api/comentarios/', {
      params: { id_ticket: ticketId },
    });
    return response.data;
  },

  async create(data) {
    const response = await api.post('/api/comentarios/', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.patch(`/api/comentarios/${id}/`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/api/comentarios/${id}/`);
    return response.data;
  },
};
