import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { noticiasService } from '../../../services/noticiasService';
import AdminListLayout from '../../../components/Admin/AdminListLayout';

function NoticiasList() {
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNoticias = async () => {
    setLoading(true);
    try {
      const data = await noticiasService.buscarTodos();
      setNoticias(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar notícias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta notícia?')) {
      try {
        await noticiasService.deletar(id);
        fetchNoticias();
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir notícia.');
      }
    }
  };

  const columns = [
    { label: 'Título', key: 'title' },
    { label: 'Status', key: 'status' },
    { 
      label: 'Publicado em', 
      render: (row) => row.publishedAt ? new Date(row.publishedAt).toLocaleString('pt-BR') : '—' 
    }
  ];

  return (
    <AdminListLayout
      title="Notícias"
      createPath="/admin/noticias/novo"
      loading={loading}
      error={error}
      data={noticias}
      columns={columns}
      onEdit={(row) => navigate(`/admin/noticias/${row.id}/editar`)}
      onDelete={handleDelete}
    />
  );
}

export default NoticiasList;