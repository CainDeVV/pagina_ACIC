import api from './api';

export const noticiasService = {
  buscarTodos: async () => {
    const resposta = await api.get('/noticias');
    return resposta.data;
  }
};