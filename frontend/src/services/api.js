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

export default api;