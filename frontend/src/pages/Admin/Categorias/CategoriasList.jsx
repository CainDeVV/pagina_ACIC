import { useNavigate } from 'react-router-dom';
import AdminListLayout from '@/components/Admin/AdminListLayout';
import { useAdminList } from '@/hooks/useAdminList';
import categoriasService from '@/services/categoriasService';

function CategoriasList() {
  const navigate = useNavigate();
  const { data, loading, error, handleDelete } = useAdminList({
    fetchMethod: categoriasService.buscarTodos,
    deleteMethod: categoriasService.deletar,
    itemName: 'categoria'
  });

  const columns = [
    { label: 'Nome', key: 'name' },
    { label: 'Slug', key: 'slug' },
    { 
      label: 'Cor', 
      key: 'color',
      render: (row) => (
        <span className="admin-color-swatch" style={{ backgroundColor: row.color }}></span>
      )
    },
    { 
      label: 'Status', 
      key: 'active',
      render: (row) => (
        <span className={row.active ? 'status-pill status-published' : 'status-pill status-draft'}>
          {row.active ? 'Ativo' : 'Inativo'}
        </span>
      )
    },
  ];

  const handleEdit = (row) => {
    navigate(`/admin/categorias/${row.id}/editar`);
  };

  return (
    <AdminListLayout
      title="Categorias"
      createButtonLabel="Nova Categoria"
      createPath="/admin/categorias/nova"
      loading={loading}
      error={error}
      data={data}
      columns={columns}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}

export default CategoriasList;
