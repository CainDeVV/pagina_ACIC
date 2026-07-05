import { useNavigate } from 'react-router-dom';
import { noticiasService } from '../../../services/noticiasService';
import AdminListLayout from '../../../components/Admin/AdminListLayout';
import { formatNumericDateTime } from '../../../utils/dateUtils';
import { useAdminList } from '../../../hooks/useAdminList';
import { InlineStatusSelect } from '../../../components/Admin/TableCells';

function NoticiasList() {
  const navigate = useNavigate();
  const { data, loading, error, handleDelete, handleUpdateField, handleReorder } = useAdminList({
    fetchMethod: noticiasService.buscarTodos,
    deleteMethod: noticiasService.deletar,
    updateMethod: noticiasService.atualizar,
    itemName: 'notícia'
  });

  const columns = [
    { label: 'Título', key: 'title' },
    { 
      label: 'Status', 
      key: 'status',
      render: (row) => <InlineStatusSelect row={row} onUpdate={handleUpdateField} />
    },
    { 
      label: 'Publicado em', 
      render: (row) => row.publishedAt ? formatNumericDateTime(row.publishedAt) : '—' 
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