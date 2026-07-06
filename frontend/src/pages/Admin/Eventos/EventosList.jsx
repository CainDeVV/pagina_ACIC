import { useNavigate } from 'react-router-dom';
import { eventosService } from '@/services/eventosService';
import AdminListLayout from '@/components/Admin/AdminListLayout';
import { formatNumericDateTime } from '@/utils/dateUtils';
import { useAdminList } from '@/hooks/useAdminList';
import { InlineStatusSelect, InlineFeaturedToggle, InlineOrderInput } from '@/components/Admin/TableCells';
import { CONTENT_STATUS } from '@/constants/status';

function EventosList() {
  const navigate = useNavigate();
  const { data, loading, error, handleDelete, handleUpdateField, handleReorder } = useAdminList({
    fetchMethod: eventosService.buscarTodosAdmin,
    deleteMethod: eventosService.deletar,
    updateMethod: eventosService.atualizar,
    itemName: 'evento'
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
          options={[
            CONTENT_STATUS.PUBLISHED, 
            CONTENT_STATUS.DRAFT, 
            CONTENT_STATUS.FINISHED, 
            CONTENT_STATUS.CANCELLED
          ]}
        />
      )
    },
    { label: 'Início', render: (row) => formatNumericDateTime(row.startsAt) },
    { 
      label: 'Destaque', 
      render: (row) => <InlineFeaturedToggle row={row} onUpdate={handleUpdateField} /> 
    }
  ];

  return (
    <AdminListLayout
      title="Eventos"
      createButtonLabel="Novo Evento"
      createPath="/admin/eventos/novo"
      loading={loading}
      error={error}
      data={data}
      columns={columns}
      onEdit={(row) => navigate(`/admin/eventos/${row.id}/editar`)}
      onDelete={handleDelete}
    />
  );
}

export default EventosList;
