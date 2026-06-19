import api from './api';

export const servicosService = {
  buscarTodos: async () => {
    const resposta = await api.get('/servicos');
    return resposta.data;
  },

  buscarPorSlugOuId: async (idOrSlug) => {
    const resposta = await api.get(`/servicos/${idOrSlug}`);
    return resposta.data;
  }
};