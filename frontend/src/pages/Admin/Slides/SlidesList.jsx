import { useNavigate } from 'react-router-dom';
import { slidesService } from '@/services/slidesService';
import AdminListLayout from '@/components/Admin/AdminListLayout';
import { useAdminList } from '@/hooks/useAdminList';
import { InlineOrderInput, InlineStatusSelect } from '@/components/Admin/TableCells';
import { CONTENT_STATUS } from '@/constants/status';

function SlidesList() {
  const navigate = useNavigate();
  const { data, loading, error, handleDelete, handleUpdateField, handleReorder } = useAdminList({
    fetchMethod: slidesService.buscarTodosAdmin,
    deleteMethod: slidesService.deletar,
    updateMethod: slidesService.atualizar,
    itemName: 'slide'
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
      label: 'Ordem', 
      key: 'sortOrder',
      render: (row) => <InlineOrderInput row={row} onUpdate={handleUpdateField} />
    }
  ];

  return (
    <AdminListLayout
      title="Slides"
      createButtonLabel="Novo Slide"
      createPath="/admin/slides/novo"
      loading={loading}
      error={error}
      data={data}
      columns={columns}
      onEdit={(row) => navigate(`/admin/slides/${row.id}/editar`)}
      onDelete={handleDelete}
      onReorder={handleReorder}
    />
  );
}

export default SlidesList;