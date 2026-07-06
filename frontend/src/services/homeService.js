import api from './api';

export const homeService = {
  buscarDestaques: async () => {
    const resposta = await api.get('/home');
    return resposta.data;
  },
};
