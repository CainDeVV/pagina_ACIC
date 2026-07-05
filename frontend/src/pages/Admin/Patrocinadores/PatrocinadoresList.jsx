import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminListLayout from '../../../components/Admin/AdminListLayout';
import { patrocinadoresService } from '../../../services/patrocinadoresService';
import { CONTENT_STATUS } from '../../../constants/status';

function PatrocinadoresList() {
  const [patrocinadores, setPatrocinadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatrocinadores();
  }, []);

  const fetchPatrocinadores = async () => {
    setLoading(true);
    try {
      const data = await patrocinadoresService.buscarTodosAdmin();
      setPatrocinadores(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar patrocinadores.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este patrocinador?')) {
      try {
        await patrocinadoresService.excluir(id);
        fetchPatrocinadores();
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir patrocinador.');
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'linkUrl', label: 'Link' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`status-badge ${row.status === CONTENT_STATUS.PUBLISHED ? 'published' : 'draft'}`}>
          {row.status === CONTENT_STATUS.PUBLISHED ? 'Público' : 'Rascunho'}
        </span>
      )
    },
    { key: 'sortOrder', label: 'Ordem' }
  ];

  return (
    <AdminListLayout
      title="Patrocinadores"
      createPath="/admin/patrocinadores/novo"
      loading={loading}
      error={error}
      data={patrocinadores}
      columns={columns}
      onEdit={(row) => navigate(`/admin/patrocinadores/editar/${row.id}`)}
      onDelete={(id) => handleDelete(id)}
    />
  );
}

export default PatrocinadoresList;
