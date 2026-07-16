/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Inicializa o estado com o usuário salvo no localStorage, ou null se estiver deslogado
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('acic_user');
    const token = localStorage.getItem('acic_access_token');
    const refreshToken = localStorage.getItem('acic_refresh_token');
    return (savedUser && token && refreshToken) ? JSON.parse(savedUser) : null;
  });

  const login = (userData, accessToken, refreshToken) => {
    localStorage.setItem('acic_access_token', accessToken);
    localStorage.setItem('acic_refresh_token', refreshToken);
    localStorage.setItem('acic_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('acic_refresh_token');
    
    // Limpeza incondicional imediata no estado local e no storage para evitar Lockout na UI
    localStorage.removeItem('acic_access_token');
    localStorage.removeItem('acic_refresh_token');
    localStorage.removeItem('acic_user');
    setUser(null);

    // Tenta invalidar a sessão no backend (fire and forget)
    if (refreshToken) {
      try {
        await api.post('/auth/logout', { refreshToken });
      } catch (error) {
        console.warn('Sessão já havia expirado no servidor ou servidor indisponível:', error);
      }
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
