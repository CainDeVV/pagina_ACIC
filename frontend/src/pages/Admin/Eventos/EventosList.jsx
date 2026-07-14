import { useNavigate } from 'react-router-dom';
import { eventosService } from '@/services/eventosService';
import AdminListLayout from '@/components/Admin/AdminListLayout';
import { formatNumericDateTime } from '@/utils/dateUtils';
import { useAdminList } from '@/hooks/useAdminList';
import { InlineStatusSelect, InlineFeaturedToggle } from '@/components/Admin/TableCells';
import { CONTENT_STATUS } from '@/constants/status';

function EventosList() {
  const navigate = useNavigate();
  const { data, loading, error, handleDelete, handleUpdateField } = useAdminList({
    fetchMethod: eventosService.buscarTodosAdmin,
    deleteMethod: eventosService.deletar,
    updateMethod: eventosService.atualizar,
    itemName: 'evento'
  });

  const columns = [
    { 
      label: 'Título', 
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{row.title}</span>
          {row.status === CONTENT_STATUS.DRAFT && row.publishedAt && new Date(row.publishedAt) > new Date() && (
            <span style={{ 
              fontSize: '0.75rem', padding: '2px 6px', background: '#fff3cd', 
              color: '#856404', borderRadius: '4px', border: '1px solid #ffeeba', whiteSpace: 'nowrap' 
            }}>
              ⏰ Agendado
            </span>
          )}
        </div>
      )
    },
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
