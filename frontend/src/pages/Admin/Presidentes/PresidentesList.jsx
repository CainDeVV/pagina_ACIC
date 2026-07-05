import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { institucionalService } from '../../../services/institucionalService';
import AdminListLayout from '../../../components/Admin/AdminListLayout';
import { Helmet } from 'react-helmet-async';

function PresidentesList() {
  const navigate = useNavigate();
  const [presidentes, setPresidentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPresidentes = async () => {
    setLoading(true);
    try {
      const data = await institucionalService.buscarPresidentes();
      setPresidentes(data || []);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar presidentes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresidentes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este presidente?')) {
      try {
        await institucionalService.deletarPresidente(id);
        fetchPresidentes();
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir presidente.');
      }
    }
  };

  const columns = [
    { label: 'Nome', key: 'name' },
    { 
      label: 'Período', 
      render: (row) => `${row.termStart} - ${row.termEnd || 'Atual'}` 
    },
    { label: 'Ordem', key: 'sortOrder' }
  ];

  return (
    <AdminListLayout
      title="Presidentes"
      createPath="/admin/presidentes/novo"
      loading={loading}
      error={error}
      data={presidentes}
      columns={columns}
      onEdit={(row) => navigate(`/admin/presidentes/${row.id}/editar`)}
      onDelete={handleDelete}
    />
  );
}

export default PresidentesList;