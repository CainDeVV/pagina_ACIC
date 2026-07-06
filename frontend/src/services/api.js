import axios from 'axios';

// Cria a instância do Axios apontando para o Backend
export const api = axios.create({
  // O Vite entende automaticamente a variável VITE_API_URL do docker-compose
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:3000/api',
  timeout: 10000, // Tempo limite de 10 segundos para a requisição
});

// Interceptador de Requisição (O "Porteiro")
api.interceptors.request.use(
  (config) => {
    // Busca o token do administrador no armazenamento do navegador (localStorage)
    const token = localStorage.getItem('acic_access_token');
    
    // Se o token existir, anexa na requisição como um crachá de acesso
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador de Resposta (O "Vigia" contra expiração de token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Tratamento para Token Expirado (401)
    if (error.response?.status === 401) {
      localStorage.removeItem('acic_access_token');
      localStorage.removeItem('acic_user');
      window.location.href = '/login'; 
    }
    
    // 2. Tratamento para Servidor Offline ou Internet Caiu
    if (!error.response) {
      console.error("Erro de Conexão: Servidor fora do ar ou sem internet.");
      // Aqui você poderia disparar um Toast Global (ex: react-toastify) alertando o usuário.
    }
    
    // 3. Tratamento para Erro 500
    if (error.response?.status >= 500) {
      console.error("Erro Crítico no Servidor:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;