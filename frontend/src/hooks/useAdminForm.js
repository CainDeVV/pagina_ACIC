import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook genérico para padronizar os formulários do Painel Administrativo (DRY).
 *
 * @param {Object} options
 * @param {string} options.id - O ID da entidade (vindo do useParams), null/undefined se for criação
 * @param {Object} options.initialData - O estado inicial do formulário (vazio/defaults)
 * @param {Object} options.service - O objeto de serviço com os métodos (buscarPorId, criar, atualizar)
 * @param {string} options.redirectPath - A rota para redirecionar após sucesso (ex: '/admin/patrocinadores')
 * @returns {Object} { formData, setFormData, loading, fetching, error, setError, handleChange, handleSubmit }
 */
export function useAdminForm({ id, initialData, service, redirectPath }) {
  const isEditing = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchData = async () => {
        try {
          const data = await service.buscarPorId(id);
          
          // Mapeia os dados do banco sobre os defaults definidos no initialData.
          // Garante que chaves ausentes não virem undefined puro se initialData tem '' ou 0.
          const mappedData = { ...initialData };
          for (const key in initialData) {
            if (data[key] !== undefined && data[key] !== null) {
              mappedData[key] = data[key];
            }
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
  }, [id, service]);

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
