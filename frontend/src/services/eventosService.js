import api from './api';

export const eventosService = {
  buscarTodos: async () => {
    const resposta = await api.get('/eventos');
    return resposta.data;
  },

  buscarPorId: async (id) => {
    const resposta = await api.get(`/eventos/${id}`);
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