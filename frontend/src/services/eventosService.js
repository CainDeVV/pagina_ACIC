import api from '@/services/api';

export const eventosService = {
  buscarTodosPublico: async (params) => {
    const resposta = await api.get('/eventos', { params });
    return resposta.data;
  },

  buscarTodosAdmin: async (params) => {
    const resposta = await api.get('/admin/eventos', { params });
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