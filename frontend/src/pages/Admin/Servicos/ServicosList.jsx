import { useNavigate } from 'react-router-dom';
import { servicosService } from '../../../services/servicosService';
import AdminListLayout from '../../../components/Admin/AdminListLayout';
import { useAdminList } from '../../../hooks/useAdminList';
import { InlineStatusSelect, InlineOrderInput } from '../../../components/Admin/TableCells';
import { CONTENT_STATUS } from '../../../constants/status';

function ServicosList() {
  const navigate = useNavigate();
  const { data, loading, error, handleDelete, handleUpdateField, handleReorder } = useAdminList({
    fetchMethod: servicosService.buscarTodos,
    deleteMethod: servicosService.deletar,
    updateMethod: servicosService.atualizar,
    itemName: 'serviço'
  });

  const columns = [
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
    { label: 'Destaque', render: (row) => row.destaque ? 'Sim' : 'Não' },
    { 
      label: 'Ordem', 
      key: 'sortOrder',
      render: (row) => <InlineOrderInput row={row} onUpdate={handleUpdateField} />
    }
  ];

  return (
    <AdminListLayout
      title="Serviços"
      createButtonLabel="Novo Serviço"
      createPath="/admin/servicos/novo"
      loading={loading}
      error={error}
      data={data}
      columns={columns}
      onEdit={(row) => navigate(`/admin/servicos/${row.id}/editar`)}
      onDelete={handleDelete}
      onReorder={handleReorder}
    />
  );
}

export default ServicosList;