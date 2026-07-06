import api from './api';

export const patrocinadoresService = {
  buscarTodosAtivos: async () => {
    const response = await api.get('/patrocinadores');
    return response.data;
  },

  buscarTodosAdmin: async () => {
    const response = await api.get('/admin/patrocinadores');
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/admin/patrocinadores/${id}`);
    return response.data;
  },

  criar: async (dados) => {
    const response = await api.post('/admin/patrocinadores', dados);
    return response.data;
  },

  atualizar: async (id, dados) => {
    const response = await api.put(`/admin/patrocinadores/${id}`, dados);
    return response.data;
  },

  excluir: async (id) => {
    const response = await api.delete(`/admin/patrocinadores/${id}`);
    return response.data;
  }
};
