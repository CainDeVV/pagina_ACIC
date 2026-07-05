import { useNavigate } from 'react-router-dom';
import AdminListLayout from '../../../components/Admin/AdminListLayout';
import { patrocinadoresService } from '../../../services/patrocinadoresService';
import { useAdminList } from '../../../hooks/useAdminList';
import { InlineOrderInput, InlineStatusSelect } from '../../../components/Admin/TableCells';

function PatrocinadoresList() {
  const navigate = useNavigate();
  const { data, loading, error, handleDelete, handleUpdateField, handleReorder } = useAdminList({
    fetchMethod: patrocinadoresService.buscarTodosAdmin,
    deleteMethod: patrocinadoresService.excluir,
    updateMethod: patrocinadoresService.atualizar,
    itemName: 'patrocinador'
  });

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'linkUrl', label: 'Link' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <InlineStatusSelect row={row} onUpdate={handleUpdateField} />
    },
    { 
      key: 'sortOrder', 
      label: 'Ordem',
      render: (row) => <InlineOrderInput row={row} onUpdate={handleUpdateField} />
    }
  ];

  return (
    <AdminListLayout
      title="Patrocinadores"
      createButtonLabel="Novo Patrocinador"
      createPath="/admin/patrocinadores/novo"
      loading={loading}
      error={error}
      data={data}
      columns={columns}
      onEdit={(row) => navigate(`/admin/patrocinadores/${row.id}/editar`)}
      onDelete={handleDelete}
      onReorder={handleReorder}
    />
  );
}

export default PatrocinadoresList;
