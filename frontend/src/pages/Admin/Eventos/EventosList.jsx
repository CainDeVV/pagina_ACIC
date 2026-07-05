import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventosService } from '../../../services/eventosService';
import AdminListLayout from '../../../components/Admin/AdminListLayout';
import { Helmet } from 'react-helmet-async';

function EventosList() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventos = async () => {
    setLoading(true);
    try {
      const data = await eventosService.buscarTodos();
      setEventos(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar eventos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await eventosService.deletar(id);
        fetchEventos();
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir evento.');
      }
    }
  };

  const columns = [
    { label: 'Título', key: 'title' },
    { label: 'Status', key: 'status' },
    { label: 'Início', render: (row) => new Date(row.startsAt).toLocaleString('pt-BR') },
    { label: 'Destaque', render: (row) => row.destaque ? 'Sim' : 'Não' }
  ];

  return (
    <AdminListLayout
      title="Eventos"
      createPath="/admin/eventos/novo"
      loading={loading}
      error={error}
      data={eventos}
      columns={columns}
      onEdit={(row) => navigate(`/admin/eventos/${row.id}/editar`)}
      onDelete={handleDelete}
    />
  );
}

export default EventosList;
