import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { slidesService } from '../../../services/slidesService';
import './SlidesList.css';

function SlidesList() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const data = await slidesService.buscarTodos();
      setSlides(data);
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
        fetchSlides(); // Recarrega a lista após deletar
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir slide.');
      }
    }
  };

  return (
    <div className="admin-page-container">
      <Link to="/admin" className="back-link">← Voltar ao painel</Link>
      
      <div className="admin-page-header">
        <h1>Slides</h1>
        <button className="btn-primary" onClick={() => navigate('/admin/slides/novo')}>
          Novo Slide
        </button>
      </div>

      <div className="admin-page-content">
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="error-msg">{error}</p>
        ) : slides.length === 0 ? (
          <p>Nenhum slide cadastrado.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Status</th>
                <th>Ordem</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {slides.map(slide => (
                <tr key={slide.id}>
                  <td>{slide.title}</td>
                  <td>{slide.status}</td>
                  <td>{slide.sortOrder}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => navigate(`/admin/slides/${slide.id}/editar`)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(slide.id)}>
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

export default SlidesList;
