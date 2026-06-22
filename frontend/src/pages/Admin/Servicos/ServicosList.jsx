import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { servicosService } from '../../../services/servicosService';
import './ServicosList.css';

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

  return (
    <div className="admin-page-container">
      <Link to="/admin" className="back-link">← Voltar ao painel</Link>
      
      <div className="admin-page-header">
        <h1>Serviços</h1>
        <button className="btn-primary" onClick={() => navigate('/admin/servicos/novo')}>
          Novo Serviço
        </button>
      </div>

      <div className="admin-page-content">
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="error-msg">{error}</p>
        ) : servicos.length === 0 ? (
          <p>Nenhum serviço cadastrado.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Status</th>
                <th>Destaque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {servicos.map(serv => (
                <tr key={serv.id}>
                  <td>{serv.title}</td>
                  <td>{serv.status}</td>
                  <td>{serv.destaque ? 'Sim' : 'Não'}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => navigate(`/admin/servicos/${serv.id}/editar`)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(serv.id)}>
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

export default ServicosList;
