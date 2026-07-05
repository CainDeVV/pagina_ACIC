import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminListLayout from '../../../components/Admin/AdminListLayout';
import AdminTable from '../../../components/Admin/AdminTable';
import { patrocinadoresService } from '../../../services/patrocinadoresService';
import { CONTENT_STATUS } from '../../../constants/status';
import { toast } from 'react-toastify';

function PatrocinadoresList() {
  const [patrocinadores, setPatrocinadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatrocinadores();
  }, []);

  const fetchPatrocinadores = async () => {
    try {
      const data = await patrocinadoresService.buscarTodosAdmin();
      setPatrocinadores(data);
    } catch (err) {
      toast.error('Erro ao carregar patrocinadores');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este patrocinador?')) {
      try {
        await patrocinadoresService.excluir(id);
        toast.success('Patrocinador excluído com sucesso');
        fetchPatrocinadores();
      } catch (err) {
        toast.error('Erro ao excluir patrocinador');
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'linkUrl', label: 'Link' },
    {
      key: 'status',
      label: 'Status',
      render: (item) => (
        <span className={`status-badge ${item.status === CONTENT_STATUS.PUBLISHED ? 'published' : 'draft'}`}>
          {item.status === CONTENT_STATUS.PUBLISHED ? 'Público' : 'Rascunho'}
        </span>
      )
    }
  ];

  return (
    <AdminListLayout
      title="Patrocinadores"
      onAddClick={() => navigate('/admin/patrocinadores/novo')}
      addButtonText="Novo Patrocinador"
    >
      <AdminTable
        columns={columns}
        data={patrocinadores}
        loading={loading}
        onEdit={(item) => navigate(`/admin/patrocinadores/editar/${item.id}`)}
        onDelete={(item) => handleDelete(item.id)}
      />
    </AdminListLayout>
  );
}

export default PatrocinadoresList;
