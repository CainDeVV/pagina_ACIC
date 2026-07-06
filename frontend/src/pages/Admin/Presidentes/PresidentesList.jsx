import { useNavigate } from 'react-router-dom';
import { institucionalService } from '../../../services/institucionalService';
import AdminListLayout from '../../../components/Admin/AdminListLayout';
import { useAdminList } from '../../../hooks/useAdminList';
import { InlineOrderInput } from '../../../components/Admin/TableCells';

function PresidentesList() {
  const navigate = useNavigate();
  const { data, loading, error, handleDelete, handleUpdateField, handleReorder } = useAdminList({
    fetchMethod: institucionalService.buscarPresidentesAdmin,
    deleteMethod: institucionalService.deletarPresidente,
    updateMethod: institucionalService.atualizarPresidente,
    itemName: 'presidente'
  });

  const columns = [
    { label: 'Nome', key: 'name' },
    { 
      label: 'Período', 
      render: (row) => `${row.termStart} - ${row.termEnd || 'Atual'}` 
    },
    { 
      label: 'Ordem', 
      key: 'sortOrder',
      render: (row) => <InlineOrderInput row={row} onUpdate={handleUpdateField} />
    }
  ];

  return (
    <AdminListLayout
      title="Presidentes"
      createButtonLabel="Novo Presidente"
      createPath="/admin/presidentes/novo"
      loading={loading}
      error={error}
      data={data}
      columns={columns}
      onEdit={(row) => navigate(`/admin/presidentes/${row.id}/editar`)}
      onDelete={handleDelete}
      onReorder={handleReorder}
    />
  );
}

export default PresidentesList;