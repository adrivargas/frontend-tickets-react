import api from './api';

export const catalogoService = {
  async getCategorias() {
    const response = await api.get('/api/categorias/');
    return response.data;
  },

  async getPrioridades() {
    const response = await api.get('/api/prioridades/');
    return response.data;
  },

  async getEstados() {
    const response = await api.get('/api/estados/');
    return response.data;
  },

  async getCanales() {
    const response = await api.get('/api/canales/');
    return response.data;
  },

  // CRUD para categorías (solo admin)
  async createCategoria(data) {
    const response = await api.post('/api/categorias/', data);
    return response.data;
  },

  async updateCategoria(id, data) {
    const response = await api.patch(`/api/categorias/${id}/`, data);
    return response.data;
  },

  async deleteCategoria(id) {
    const response = await api.delete(`/api/categorias/${id}/`);
    return response.data;
  },

  // CRUD para estados (solo admin)
  async createEstado(data) {
    const response = await api.post('/api/estados/', data);
    return response.data;
  },

  async updateEstado(id, data) {
    const response = await api.patch(`/api/estados/${id}/`, data);
    return response.data;
  },

  async deleteEstado(id) {
    const response = await api.delete(`/api/estados/${id}/`);
    return response.data;
  },

  // CRUD para canales (solo admin)
  async createCanal(data) {
    const response = await api.post('/api/canales/', data);
    return response.data;
  },

  async updateCanal(id, data) {
    const response = await api.patch(`/api/canales/${id}/`, data);
    return response.data;
  },

  async deleteCanal(id) {
    const response = await api.delete(`/api/canales/${id}/`);
    return response.data;
  },
};
