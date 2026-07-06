import api from '@/services/api';

export const uploadService = {
  uploadArquivo: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const resposta = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return resposta.data;
  }
};
