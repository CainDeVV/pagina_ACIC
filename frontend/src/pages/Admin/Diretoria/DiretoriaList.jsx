import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { institucionalService } from '../../../services/institucionalService';
import AdminListLayout from '../../../components/Admin/AdminListLayout';
import { useAdminList } from '../../../hooks/useAdminList';
import { InlineOrderInput, InlineCategorySelect } from '../../../components/Admin/TableCells';

function DiretoriaList() {
  const navigate = useNavigate();

  const fetchDiretoriaFlat = useCallback(async () => {
    const result = await institucionalService.buscarDiretoria();
    const flatList = [];
    if (Array.isArray(result)) {
      result.forEach(group => {
        if (group.members && Array.isArray(group.members)) {
          flatList.push(...group.members);
        }
      });
    }
    return flatList;
  }, []);

  const { data, loading, error, handleDelete, handleUpdateField, handleReorder } = useAdminList({
    fetchMethod: fetchDiretoriaFlat,
    deleteMethod: institucionalService.deletarDiretoria,
    updateMethod: institucionalService.atualizarDiretoria,
    itemName: 'membro da diretoria'
  });

  const columns = [
    { label: 'Nome', key: 'name' },
    { label: 'Empresa', key: 'role' },
    { 
      label: 'Cargo (Categoria)', 
      key: 'category',
      render: (row) => <InlineCategorySelect row={row} onUpdate={handleUpdateField} />
    },
    { 
      label: 'Ordem', 
      key: 'sortOrder',
      render: (row) => <InlineOrderInput row={row} onUpdate={handleUpdateField} />
    }
  ];

  return (
    <AdminListLayout
      title="Diretoria"
      createButtonLabel="Novo Diretor"
      createPath="/admin/diretoria/novo"
      loading={loading}
      error={error}
      data={data}
      columns={columns}
      onEdit={(row) => navigate(`/admin/diretoria/${row.id}/editar`)}
      onDelete={handleDelete}
      onReorder={handleReorder}
    />
  );
}

export default DiretoriaList;