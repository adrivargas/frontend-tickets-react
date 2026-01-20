import api from './api';

// Servicio para obtener información del usuario actual
export const userService = {
  async getCurrentUser() {
    try {
      // Usar el endpoint /api/usuarios/me/ que retorna el usuario actual autenticado
      const response = await api.get('/api/usuarios/me/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  },
};
