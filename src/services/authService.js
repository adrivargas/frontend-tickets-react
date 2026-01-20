import api from './api';

export const authService = {
  async login(email, password) {
    // Django SimpleJWT por defecto usa 'username', pero puede configurarse para usar email
    // Intentamos primero con username (asumiendo que email funciona como username)
    const response = await api.post('/api/auth/login/', {
      username: email, // SimpleJWT usa 'username' por defecto
      password: password,
    });
    
    const { access, refresh } = response.data;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    
    return { access, refresh };
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getToken() {
    return localStorage.getItem('accessToken');
  },

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  async getCurrentUser() {
    // Como el backend usa JWT, necesitamos obtener el usuario desde algún endpoint
    // Por ahora, asumimos que después del login guardamos el usuario
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
