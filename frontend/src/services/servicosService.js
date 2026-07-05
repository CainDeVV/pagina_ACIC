import api from './api';

export const servicosService = {
  buscarTodos: async () => {
    const resposta = await api.get('/servicos');
    return resposta.data;
  },

  buscarPorId: async (id) => {
    const resposta = await api.get(`/servicos/${id}`);
    return resposta.data;
  },

  criar: async (dados) => {
    const resposta = await api.post('/admin/servicos', dados);
    return resposta.data;
  },

  atualizar: async (id, dados) => {
    const resposta = await api.patch(`/admin/servicos/${id}`, dados);
    return resposta.data;
  },

  deletar: async (id) => {
    const resposta = await api.delete(`/admin/servicos/${id}`);
    return resposta.data;
  }
};