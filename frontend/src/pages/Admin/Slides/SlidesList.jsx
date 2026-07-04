import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { slidesService } from '../../../services/slidesService';
import AdminListLayout from '../../../components/Admin/AdminListLayout';

function SlidesList() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const data = await slidesService.buscarTodos();
      setSlides(data || []);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar slides.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este slide?')) {
      try {
        await slidesService.deletar(id);
        fetchSlides();
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir slide.');
      }
    }
  };

  const columns = [
    { label: 'Título', key: 'title' },
    { label: 'Status', key: 'status' },
    { label: 'Ordem', key: 'sortOrder' }
  ];

  return (
    <AdminListLayout
      title="Slides"
      createPath="/admin/slides/novo"
      loading={loading}
      error={error}
      data={slides}
      columns={columns}
      onEdit={(row) => navigate(`/admin/slides/${row.id}/editar`)}
      onDelete={handleDelete}
    />
  );
}

export default SlidesList;