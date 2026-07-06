import api from './api';

export const eventosService = {
  buscarTodosPublico: async () => {
    const resposta = await api.get('/eventos');
    return resposta.data; // Retorna { data, meta }
  },

  buscarTodosAdmin: async () => {
    const resposta = await api.get('/admin/eventos');
    return resposta.data; // Retorna { data, meta }
  },

  buscarPorId: async (id) => {
    const resposta = await api.get(`/admin/eventos/${id}`);
    return resposta.data;
  },

  buscarPorSlugPublico: async (slug) => {
    const resposta = await api.get(`/eventos/${slug}`);
    return resposta.data;
  },

  criar: async (dados) => {
    const resposta = await api.post('/admin/eventos', dados);
    return resposta.data;
  },

  atualizar: async (id, dados) => {
    const resposta = await api.patch(`/admin/eventos/${id}`, dados);
    return resposta.data;
  },

  deletar: async (id) => {
    const resposta = await api.delete(`/admin/eventos/${id}`);
    return resposta.data;
  }
};