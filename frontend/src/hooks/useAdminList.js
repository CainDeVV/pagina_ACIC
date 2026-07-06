import { useState, useEffect, useCallback } from 'react';

/**
 * Hook genérico para padronizar as listagens do Painel Administrativo (DRY).
 *
 * @param {Object} options
 * @param {Function} options.fetchMethod - Método da service que busca os dados (ex: patrocinadoresService.buscarTodosAdmin)
 * @param {Function} options.deleteMethod - Método da service que exclui um item (ex: patrocinadoresService.excluir)
 * @param {Function} [options.updateMethod] - Método da service que atualiza um item (ex: patrocinadoresService.atualizar)
 * @param {string} [options.itemName='registro'] - Nome do item para exibição nas mensagens (opcional)
 * @returns {Object} { data, loading, error, fetchData, handleDelete, handleUpdateField, handleReorder }
 */
export function useAdminList({ fetchMethod, deleteMethod, updateMethod, itemName = 'registro' }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMethod();
      
      // Suporte Polimórfico Temporário (Até todos os módulos do Backend estarem refatorados)
      const isPaginated = result && result.data && Array.isArray(result.data);
      const items = isPaginated ? result.data : (result || []);
      
      // Opcional: ordenar o resultado por sortOrder para garantir consistência
      const sortedData = items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      setData(sortedData);
    } catch (err) {
      console.error(err);
      setError(`Erro ao carregar lista de ${itemName}s.`);
    } finally {
      setLoading(false);
    }
  }, [fetchMethod, itemName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id, confirmMessage = `Tem certeza que deseja excluir este ${itemName}?`) => {
    if (window.confirm(confirmMessage)) {
      try {
        await deleteMethod(id);
        fetchData();
      } catch (err) {
        console.error(err);
        alert(`Erro ao excluir ${itemName}.`);
      }
    }
  };

  const handleUpdateField = async (row, field, value) => {
    if (!updateMethod) {
      console.error("updateMethod não foi fornecido para useAdminList.");
      return;
    }
    if (row[field] === value) return; // Nenhuma mudança real

    try {
      // Atualização otimista local para UI parecer mais rápida
      setData(prev => prev.map(item => item.id === row.id ? { ...item, [field]: value } : item));
      
      // Envia APENAS o campo que mudou para não engatilhar 'forbidNonWhitelisted' do backend
      // (pois enviar o objeto completo pode incluir campos que o backend não permite no UpdateDTO)
      const payload = { [field]: value };
      
      await updateMethod(row.id, payload);
      fetchData(); 
    } catch (err) {
      console.error(err);
      alert(`Erro ao atualizar ${field} do ${itemName}.`);
      fetchData(); // Reverte a atualização otimista em caso de erro
    }
  };

  const handleReorder = useCallback(async (newArray) => {
    if (!updateMethod) return;

    // 1. Calcula novos sortOrders e identifica quem mudou
    const itemsToUpdate = [];
    const updatedArray = newArray.map((item, index) => {
      const newSortOrder = index + 1;
      if (item.sortOrder !== newSortOrder) {
        itemsToUpdate.push({ ...item, sortOrder: newSortOrder });
        return { ...item, sortOrder: newSortOrder };
      }
      return item;
    });

    // 2. Atualização otimista local
    setData(updatedArray);

    if (itemsToUpdate.length === 0) return;

    // 3. Fire PATCH requests no background enviando APENAS o sortOrder
    try {
      await Promise.all(
        itemsToUpdate.map(update => {
          const payload = { sortOrder: update.sortOrder };
          return updateMethod(update.id, payload);
        })
      );
      // Garante sincronia 100% real com o backend após o sucesso das múltiplas atualizações
      fetchData();
    } catch (err) {
      console.error("Erro ao salvar reordenação no backend", err);
      alert(`Erro ao reordenar ${itemName}s.`);
      fetchData(); // reverte em caso de erro
    }
  }, [updateMethod, itemName, fetchData]);

  return { data, loading, error, fetchData, handleDelete, handleUpdateField, handleReorder };
}
