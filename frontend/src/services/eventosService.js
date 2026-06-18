import api from './api';

export const eventosService = {
  buscarTodos: async () => {
    const resposta = await api.get('/eventos');
    return resposta.data;
  },

  buscarPorSlugOuId: async (idOrSlug) => {
    const resposta = await api.get(`/eventos/${idOrSlug}`);
    return resposta.data;
  },

  criar: async (dadosEvento) => {
    const resposta = await api.post('/admin/eventos', dadosEvento);
    return resposta.data;
  },

  atualizar: async (id, dadosEvento) => {
    const resposta = await api.patch(`/admin/eventos/${id}`, dadosEvento);
    return resposta.data;
  },

  deletar: async (id) => {
    const resposta = await api.delete(`/admin/eventos/${id}`);
    return resposta.data;
  }
};