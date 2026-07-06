import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Inicializa o estado com o usuário salvo no localStorage, ou null se estiver deslogado
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('acic_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData, token) => {
    localStorage.setItem('acic_access_token', token);
    localStorage.setItem('acic_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('acic_access_token');
    localStorage.removeItem('acic_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
