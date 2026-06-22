import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { noticiasService } from '../../../services/noticiasService';
import './NoticiasList.css';

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

  return (
    <div className="admin-page-container">
      <Link to="/admin" className="back-link">← Voltar ao painel</Link>
      
      <div className="admin-page-header">
        <h1>Notícias</h1>
        <button className="btn-primary" onClick={() => navigate('/admin/noticias/novo')}>
          Nova Notícia
        </button>
      </div>

      <div className="admin-page-content">
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="error-msg">{error}</p>
        ) : noticias.length === 0 ? (
          <p>Nenhuma notícia cadastrada.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Status</th>
                <th>Publicado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {noticias.map(noticia => (
                <tr key={noticia.id}>
                  <td>{noticia.title}</td>
                  <td>{noticia.status}</td>
                  <td>{noticia.publishedAt ? new Date(noticia.publishedAt).toLocaleString('pt-BR') : '—'}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => navigate(`/admin/noticias/${noticia.id}/editar`)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(noticia.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default NoticiasList;
