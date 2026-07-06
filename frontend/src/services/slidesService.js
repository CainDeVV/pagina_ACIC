import api from './api';

export const slidesService = {
  buscarTodosPublico: async () => {
    const resposta = await api.get('/slides');
    return resposta.data;
  },

  buscarTodosAdmin: async () => {
    const resposta = await api.get('/admin/slides');
    return resposta.data;
  },

  buscarPorId: async (id) => {
    const resposta = await api.get(`/admin/slides/${id}`);
    return resposta.data;
  },

  criar: async (dados) => {
    const resposta = await api.post('/admin/slides', dados);
    return resposta.data;
  },

  atualizar: async (id, dados) => {
    const resposta = await api.patch(`/admin/slides/${id}`, dados);
    return resposta.data;
  },

  deletar: async (id) => {
    const resposta = await api.delete(`/admin/slides/${id}`);
    return resposta.data;
  }
};