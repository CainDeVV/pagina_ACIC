import api from './api';

export const slidesService = {
  buscarTodos: async () => {
    const resposta = await api.get('/slides');
    return resposta.data;
  }
};