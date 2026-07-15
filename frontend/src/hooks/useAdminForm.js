import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook genérico para padronizar os formulários do Painel Administrativo (DRY).
 *
 * @param {Object} options
 * @param {string} options.id - O ID da entidade (vindo do useParams), null/undefined se for criação
 * @param {Object} options.initialData - O estado inicial do formulário (vazio/defaults)
 * @param {Object} options.service - O objeto de serviço com os métodos (buscarPorId, criar, atualizar)
 * @param {Function} [options.fetchItemsFn] - Opcional: Função que busca todos os itens para auto-incrementar o sortOrder na criação
 * @param {Function} [options.onDataLoad] - Opcional: Callback (data, mappedData) para processar os dados após o carregamento da API
 * @returns {Object} { formData, setFormData, loading, fetching, error, setError, handleChange, handleSubmit }
 */
export function useAdminForm({ id, initialData, service, redirectPath, fetchItemsFn, onDataLoad }) {
  const isEditing = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState(null);

  // Efeito para carregar dados de edição
  useEffect(() => {
    if (isEditing) {
      const fetchData = async () => {
        try {
          const data = await service.buscarPorId(id);
          
          // Mapeia os dados do banco sobre os defaults definidos no initialData.
          // Garante que chaves ausentes não virem undefined puro se initialData tem '' ou 0.
          let mappedData = { ...initialData };
          for (const key in initialData) {
            if (data[key] !== undefined && data[key] !== null) {
              mappedData[key] = data[key];
            }
          }
          
          if (onDataLoad) {
            mappedData = onDataLoad(data, mappedData);
          }
          
          setFormData(mappedData);
          
        } catch (err) {
          console.error(err);
          setError('Erro ao carregar dados. Verifique a conexão.');
        } finally {
          setFetching(false);
        }
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, service]);

  // Efeito para adivinhar a ordem de exibição (auto-incremento DRY)
  useEffect(() => {
    if (!isEditing && fetchItemsFn) {
      const fetchMaxOrder = async () => {
        try {
          const payload = await fetchItemsFn();
          const items = payload.data || [];
          if (items.length > 0) {
            const maxOrder = Math.max(...items.map(i => Number(i.sortOrder) || 0));
            setFormData(prev => ({ ...prev, sortOrder: maxOrder + 1 }));
          } else {
            setFormData(prev => ({ ...prev, sortOrder: 1 }));
          }
        } catch (err) {
          console.error("Erro ao tentar auto-preencher sortOrder:", err);
        }
      };
      fetchMaxOrder();
    }
  }, [isEditing, fetchItemsFn]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' && value !== '' ? Number(value) : value)
    }));
  };

  /**
   * Função para lidar com o envio.
   * @param {Event} e - O evento do form
   * @param {Function} [validationFn] - Opcional: Função (formData) => errorMessage
   * @param {Function} [mapDataFn] - Opcional: Função (formData) => Object (modifica os dados antes de enviar)
   */
  const handleSubmit = async (e, validationFn = null, mapDataFn = null) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validação customizada
    if (validationFn) {
      const validationError = validationFn(formData);
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }
    }

    // Mapeamento/Formatação customizada antes de enviar para API
    const finalData = mapDataFn ? await mapDataFn(formData) : formData;

    try {
      if (isEditing) {
        await service.atualizar(id, finalData);
      } else {
        await service.criar(finalData);
      }
      navigate(redirectPath);
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar os dados. Verifique e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    fetching,
    error,
    setError,
    handleChange,
    handleSubmit
  };
}
