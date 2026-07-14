import api from './api';

export const usuariosService = {
  buscarTodosAdmin: async () => {
    const response = await api.get('/admin/usuarios');
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/admin/usuarios/${id}`);
    return response.data;
  },

  criar: async (dados) => {
    const response = await api.post('/admin/usuarios', dados);
    return response.data;
  },

  atualizar: async (id, dados) => {
    const response = await api.patch(`/admin/usuarios/${id}`, dados);
    return response.data;
  },

  remover: async (id) => {
    const response = await api.delete(`/admin/usuarios/${id}`);
    return response.data;
  }
};
