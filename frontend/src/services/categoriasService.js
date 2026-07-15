import api from './api';

const categoriasService = {
  buscarAtivas: async () => {
    const response = await api.get('/categorias/ativas');
    return response.data;
  },

  buscarTodos: async (params) => {
    const response = await api.get('/admin/categorias', { params });
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/admin/categorias/${id}`);
    return response.data;
  },

  criar: async (dados) => {
    const response = await api.post('/admin/categorias', dados);
    return response.data;
  },

  atualizar: async (id, dados) => {
    const response = await api.patch(`/admin/categorias/${id}`, dados);
    return response.data;
  },

  deletar: async (id) => {
    const response = await api.delete(`/admin/categorias/${id}`);
    return response.data;
  },
};

export default categoriasService;
