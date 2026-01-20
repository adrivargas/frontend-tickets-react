import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const currentUser = JSON.parse(userStr);
            setUser(currentUser);
          }
        } catch (error) {
          console.error('Error al obtener usuario:', error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { access } = await authService.login(email, password);
      
      // Obtener información del usuario desde la API
      const userData = await userService.getCurrentUser();
      
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else {
        // Si no se encuentra el usuario, usar datos básicos
        const basicUser = { email: email, rol_usuario: 'CLIENTE' };
        localStorage.setItem('user', JSON.stringify(basicUser));
        setUser(basicUser);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || 'Error al iniciar sesión',
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
