import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { institucionalService } from '../../../services/institucionalService';
import './PresidentesList.css';

function PresidentesList() {
  const navigate = useNavigate();
  const [presidentes, setPresidentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPresidentes = async () => {
    setLoading(true);
    try {
      const data = await institucionalService.buscarPresidentes();
      setPresidentes(data);
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
        fetchPresidentes(); // Recarrega após deletar
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir presidente.');
      }
    }
  };

  return (
    <div className="admin-page-container">
      <Link to="/admin" className="back-link">← Voltar ao painel</Link>
      
      <div className="admin-page-header">
        <h1>Presidentes</h1>
        <button className="btn-primary" onClick={() => navigate('/admin/presidentes/novo')}>
          Novo Presidente
        </button>
      </div>

      <div className="admin-page-content">
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="error-msg">{error}</p>
        ) : presidentes.length === 0 ? (
          <p>Nenhum presidente cadastrado.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Mandato</th>
                <th>Ordem</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {presidentes.map(pres => (
                <tr key={pres.id}>
                  <td>{pres.name}</td>
                  <td>{pres.termStart} – {pres.termEnd ? pres.termEnd : 'atual'}</td>
                  <td>{pres.sortOrder}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => navigate(`/admin/presidentes/${pres.id}/editar`)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(pres.id)}>
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

export default PresidentesList;
