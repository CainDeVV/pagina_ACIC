import axios from 'axios';

// Cria a instância do Axios apontando para o Backend
export const api = axios.create({
  // O Vite entende automaticamente a variável VITE_API_URL do docker-compose
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:3000/api',
  timeout: 10000, // Tempo limite de 10 segundos para a requisição
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
  async (error) => {
    const originalRequest = error.config;

    // 1. Tratamento para Token Expirado (401) com Mutex e Ghost Queue
    if (error.response?.status === 401 && !originalRequest.url.includes('/auth/login') && !originalRequest.url.includes('/auth/refresh')) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          // Mutex: Se já está atualizando, enfileira a requisição
          return new Promise(function(resolve, reject) {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return api(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        isRefreshing = true;
        const refreshToken = localStorage.getItem('acic_refresh_token');

        if (!refreshToken) {
           isRefreshing = false;
           localStorage.removeItem('acic_access_token');
           localStorage.removeItem('acic_refresh_token');
           localStorage.removeItem('acic_user');
           window.location.href = '/login';
           return Promise.reject(error);
        }

        try {
          // Tenta pegar um novo access_token usando o refresh_token
          const { data } = await api.post('/auth/refresh', { refreshToken });
          const newAccessToken = data.access_token;
          const newRefreshToken = data.refresh_token;

          // Atualiza o local storage
          localStorage.setItem('acic_access_token', newAccessToken);
          localStorage.setItem('acic_refresh_token', newRefreshToken);

          // Avisa a fila que deu certo
          processQueue(null, newAccessToken);
          
          // Refaz a requisição original com o novo token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (err) {
          // Se o refresh falhar (P2025 ou expirado)
          processQueue(err, null);
          localStorage.removeItem('acic_access_token');
          localStorage.removeItem('acic_refresh_token');
          localStorage.removeItem('acic_user');
          window.location.href = '/login';
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
    }

    // 1.5. Tratamento para Permissões Revogadas (403 - Forbidden)
    if (error.response?.status === 403) {
      localStorage.removeItem('acic_access_token');
      localStorage.removeItem('acic_refresh_token');
      localStorage.removeItem('acic_user');
      alert('Suas permissões foram alteradas ou você não tem acesso a este recurso. Por favor, faça login novamente.');
      window.location.href = '/login'; 
    }
    
    // 2. Tratamento para Servidor Offline ou Internet Caiu
    if (!error.response) {
      console.error("Erro de Conexão: Servidor fora do ar ou sem internet.");
    }
    
    // 3. Tratamento para Erro 500
    if (error.response?.status >= 500) {
      console.error("Erro Crítico no Servidor:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;