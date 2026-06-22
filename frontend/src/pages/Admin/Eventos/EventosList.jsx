import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventosService } from '../../../services/eventosService';
import './EventosList.css';

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

  return (
    <div className="admin-page-container">
      <Link to="/admin" className="back-link">← Voltar ao painel</Link>
      
      <div className="admin-page-header">
        <h1>Eventos</h1>
        <button className="btn-primary" onClick={() => navigate('/admin/eventos/novo')}>
          Novo Evento
        </button>
      </div>

      <div className="admin-page-content">
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="error-msg">{error}</p>
        ) : eventos.length === 0 ? (
          <p>Nenhum evento cadastrado.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Status</th>
                <th>Início</th>
                <th>Destaque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map(evento => (
                <tr key={evento.id}>
                  <td>{evento.title}</td>
                  <td>{evento.status}</td>
                  <td>{new Date(evento.startsAt).toLocaleString('pt-BR')}</td>
                  <td>{evento.destaque ? 'Sim' : 'Não'}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => navigate(`/admin/eventos/${evento.id}/editar`)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(evento.id)}>
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

export default EventosList;
