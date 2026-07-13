import { useNavigate } from 'react-router-dom';
import { noticiasService } from '@/services/noticiasService';
import AdminListLayout from '@/components/Admin/AdminListLayout';
import { formatNumericDateTime } from '@/utils/dateUtils';
import { useAdminList } from '@/hooks/useAdminList';
import { InlineStatusSelect, InlineFeaturedToggle } from '@/components/Admin/TableCells';
import { CONTENT_STATUS } from '@/constants/status';

function NoticiasList() {
  const navigate = useNavigate();
  const { data, loading, error, handleDelete, handleUpdateField, handleReorder } = useAdminList({
    fetchMethod: noticiasService.buscarTodosAdmin,
    deleteMethod: noticiasService.deletar,
    updateMethod: noticiasService.atualizar,
    itemName: 'notícia'
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
    { 
      label: 'Publicado em', 
      render: (row) => row.publishedAt ? formatNumericDateTime(row.publishedAt) : '—' 
    },
    { 
      label: 'Destaque', 
      render: (row) => <InlineFeaturedToggle row={row} onUpdate={handleUpdateField} /> 
    }
  ];

  return (
    <AdminListLayout
      title="Notícias"
      createButtonLabel="Nova Notícia"
      createPath="/admin/noticias/nova"
      loading={loading}
      error={error}
      data={data}
      columns={columns}
      onEdit={(row) => navigate(`/admin/noticias/${row.id}/editar`)}
      onDelete={handleDelete}
      onReorder={handleReorder}
    />
  );
}

export default NoticiasList;