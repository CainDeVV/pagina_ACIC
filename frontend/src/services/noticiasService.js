import api from './api';

export const noticiasService = {
  buscarTodos: async () => {
    const resposta = await api.get('/noticias');
    return resposta.data;
  },

  buscarPorId: async (id) => {
    const resposta = await api.get(`/noticias/${id}`);
    return resposta.data;
  },

  buscarPorSlug: async (slug) => {
    const resposta = await api.get(`/noticias/${slug}`);
    return resposta.data;
  },

  criar: async (dados) => {
    const resposta = await api.post('/admin/noticias', dados);
    return resposta.data;
  },

  atualizar: async (id, dados) => {
    const resposta = await api.patch(`/admin/noticias/${id}`, dados);
    return resposta.data;
  },

  deletar: async (id) => {
    const resposta = await api.delete(`/admin/noticias/${id}`);
    return resposta.data;
  }
};