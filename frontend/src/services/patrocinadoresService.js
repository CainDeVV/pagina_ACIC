import api from './api';

export const patrocinadoresService = {
  buscarTodosAtivos: async () => {
    const response = await api.get('/patrocinadores');
    return response.data;
  },

  buscarTodosAdmin: async () => {
    const response = await api.get('/patrocinadores/admin');
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/patrocinadores/${id}`);
    return response.data;
  },

  criar: async (dados) => {
    const response = await api.post('/patrocinadores', dados);
    return response.data;
  },

  atualizar: async (id, dados) => {
    const response = await api.put(`/patrocinadores/${id}`, dados);
    return response.data;
  },

  excluir: async (id) => {
    const response = await api.delete(`/patrocinadores/${id}`);
    return response.data;
  }
};
