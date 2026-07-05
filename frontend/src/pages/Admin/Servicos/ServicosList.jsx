import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicosService } from '../../../services/servicosService';
import AdminListLayout from '../../../components/Admin/AdminListLayout';
import { Helmet } from 'react-helmet-async';

function ServicosList() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServicos = async () => {
    setLoading(true);
    try {
      const data = await servicosService.buscarTodos();
      setServicos(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar serviços.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await servicosService.deletar(id);
        fetchServicos();
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir serviço.');
      }
    }
  };

  const columns = [
    { label: 'Título', key: 'title' },
    { label: 'Status', key: 'status' },
    { label: 'Destaque', render: (row) => row.destaque ? 'Sim' : 'Não' }
  ];

  return (
    <AdminListLayout
      title="Serviços"
      createPath="/admin/servicos/novo"
      loading={loading}
      error={error}
      data={servicos}
      columns={columns}
      onEdit={(row) => navigate(`/admin/servicos/${row.id}/editar`)}
      onDelete={handleDelete}
    />
  );
}

export default ServicosList;