import { useNavigate } from 'react-router-dom';
import { institucionalService } from '../../../services/institucionalService';
import AdminListLayout from '../../../components/Admin/AdminListLayout';
import { useAdminList } from '../../../hooks/useAdminList';
import { InlineOrderInput, InlineStatusSelect } from '../../../components/Admin/TableCells';
import { CONTENT_STATUS } from '../../../constants/status';

function QuemSomosList() {
  const navigate = useNavigate();
  const { data, loading, error, handleDelete, handleUpdateField, handleReorder } = useAdminList({
    fetchMethod: institucionalService.buscarTodasPaginasAdmin,
    deleteMethod: institucionalService.deletarPagina,
    updateMethod: institucionalService.atualizarPagina,
    itemName: 'página institucional'
  });

  const columns = [
    { label: 'Chave (URL)', key: 'key' },
    { label: 'Título', key: 'title' },
    { 
      label: 'Status', 
      key: 'status',
      render: (row) => (
        <InlineStatusSelect 
          row={row} 
          onUpdate={handleUpdateField}
          options={[CONTENT_STATUS.PUBLISHED, CONTENT_STATUS.DRAFT]}
        />
      )
    },
    { 
      label: 'Ordem', 
      key: 'sortOrder',
      render: (row) => <InlineOrderInput row={row} onUpdate={handleUpdateField} />
    }
  ];

  return (
    <AdminListLayout
      title="Páginas 'Quem Somos'"
      createButtonLabel="Nova Página"
      createPath="/admin/quemsomos/nova"
      loading={loading}
      error={error}
      data={data}
      columns={columns}
      onEdit={(row) => navigate(`/admin/quemsomos/${row.id}/editar`)}
      onDelete={handleDelete}
      onReorder={handleReorder}
    />
  );
}

export default QuemSomosList;