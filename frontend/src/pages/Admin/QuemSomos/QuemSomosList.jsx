import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { institucionalService } from '../../../services/institucionalService';
import AdminListLayout from '../../../components/Admin/AdminListLayout';
import { Helmet } from 'react-helmet-async';

function QuemSomosList() {
  const navigate = useNavigate();
  const [paginas, setPaginas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPaginas = async () => {
    setLoading(true);
    try {
      const data = await institucionalService.buscarTodasPaginas();
      setPaginas(data || []);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar páginas institucionais.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaginas();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta página institucional?')) {
      try {
        await institucionalService.deletarPagina(id);
        fetchPaginas();
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir página.');
      }
    }
  };

  const columns = [
    { label: 'Chave (URL)', key: 'key' },
    { label: 'Título', key: 'title' },
    { label: 'Status', key: 'status' },
    { label: 'Ordem', key: 'sortOrder' }
  ];

  return (
    <AdminListLayout
      title="Páginas Institucionais"
      createPath="/admin/quemsomos/novo"
      loading={loading}
      error={error}
      data={paginas}
      columns={columns}
      onEdit={(row) => navigate(`/admin/quemsomos/${row.id}/editar`)}
      onDelete={handleDelete}
    />
  );
}

export default QuemSomosList;