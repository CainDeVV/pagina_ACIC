import api from './api';

export const institucionalService = {
  // --- Gestão de Conteúdo (Quem Somos, Estatuto, CMEC...) ---
  buscarTodasPaginas: async () => {
    const resposta = await api.get('/quem-somos');
    return resposta.data;
  },

  buscarPagina: async (chave) => {
    const resposta = await api.get(`/quem-somos/${chave}`);
    return resposta.data;
  },

  buscarPaginaPorId: async (id) => {
    const resposta = await api.get(`/quem-somos/${id}`);
    return resposta.data;
  },

  criarPagina: async (dados) => {
    const resposta = await api.post('/admin/quem-somos', dados);
    return resposta.data;
  },

  atualizarPagina: async (id, dados) => {
    const resposta = await api.patch(`/admin/quem-somos/${id}`, dados);
    return resposta.data;
  },

  deletarPagina: async (id) => {
    const resposta = await api.delete(`/admin/quem-somos/${id}`);
    return resposta.data;
  },

  // --- Gestão de Presidentes ---
  buscarPresidentes: async () => {
    const resposta = await api.get('/presidentes');
    return resposta.data;
  },

  buscarPresidentePorId: async (id) => {
    const resposta = await api.get(`/presidentes/${id}`);
    return resposta.data;
  },

  criarPresidente: async (dados) => {
    const resposta = await api.post('/admin/presidentes', dados);
    return resposta.data;
  },

  atualizarPresidente: async (id, dados) => {
    const resposta = await api.patch(`/admin/presidentes/${id}`, dados);
    return resposta.data;
  },

  deletarPresidente: async (id) => {
    const resposta = await api.delete(`/admin/presidentes/${id}`);
    return resposta.data;
  },

  // --- Gestão de Diretoria ---
  buscarDiretoria: async () => {
    const resposta = await api.get('/diretoria');
    return resposta.data;
  },

  buscarDiretorPorId: async (id) => {
    const resposta = await api.get(`/diretoria/${id}`);
    return resposta.data;
  },

  criarDiretoria: async (dados) => {
    const resposta = await api.post('/admin/diretoria', dados);
    return resposta.data;
  },

  atualizarDiretoria: async (id, dados) => {
    const resposta = await api.patch(`/admin/diretoria/${id}`, dados);
    return resposta.data;
  },

  deletarDiretoria: async (id) => {
    const resposta = await api.delete(`/admin/diretoria/${id}`);
    return resposta.data;
  }
};