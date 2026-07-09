/**
 * Validação Padrão de Campos de Formulário.
 * @param {Object} currentData - Os dados atuais do formulário.
 * @param {Array<string>} requiredFields - Lista de campos obrigatórios (além de title).
 * @returns {Object} Um objeto com os erros encontrados ou vazio se estiver tudo certo.
 */
export const validateStandardFields = (currentData, requiredFields = []) => {
  const errors = {};

  // O campo title quase sempre é obrigatório na nossa arquitetura
  if ('title' in currentData && (!currentData.title || !currentData.title.trim())) {
    errors.title = 'O título é obrigatório.';
  }
  
  if ('name' in currentData && (!currentData.name || !currentData.name.trim())) {
    errors.name = 'O nome é obrigatório.';
  }

  // Validação dinâmica dos outros campos obrigatórios passados por array
  requiredFields.forEach(field => {
    if (typeof currentData[field] === 'string') {
      if (!currentData[field].trim()) {
        errors[field] = 'Este campo é obrigatório.';
      }
    } else if (currentData[field] === null || currentData[field] === undefined) {
      errors[field] = 'Este campo é obrigatório.';
    }
  });

  return errors;
};

/**
 * Limpa o payload antes de enviar para a API.
 * Converte strings vazias ('') em null, para preservar a integridade no banco (Postgres).
 * @param {Object} currentData - Os dados atuais a serem enviados.
 * @returns {Object} Payload limpo.
 */
export const cleanEmptyStrings = (currentData) => {
  const cleaned = { ...currentData };
  for (const key in cleaned) {
    if (cleaned[key] === '') {
      cleaned[key] = null;
    }
  }
  return cleaned;
};
