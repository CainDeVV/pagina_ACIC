import api from './api';

export const institucionalService = {
  // Busca as páginas de texto usando a chave (ex: 'quem-somos', 'estatuto')
  buscarPagina: async (chave) => {
    const resposta = await api.get(`/quem-somos/${chave}`);
    return resposta.data;
  },

  // Busca todos os presidentes cadastrados
  buscarPresidentes: async () => {
    const resposta = await api.get('/presidentes');
    return resposta.data;
  },

  // Buscar a lista de membros da Diretoria
  buscarDiretoria: async () => {
    const resposta = await api.get('/diretoria');
    return resposta.data;
  },

  // --- Gestão de Conteúdo (Quem Somos, Estatuto, CMEC...) ---
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
  }
};