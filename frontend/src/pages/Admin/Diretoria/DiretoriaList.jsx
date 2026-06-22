import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { institucionalService } from '../../../services/institucionalService';
import './DiretoriaList.css';

function DiretoriaList() {
  const navigate = useNavigate();
  const [membros, setMembros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDiretoria = async () => {
    setLoading(true);
    try {
      const data = await institucionalService.buscarDiretoria();
      // Achatar a estrutura: data é [{roleLabel, members[]}]
      let flatMembers = [];
      data.forEach(grupo => {
        if (grupo.members && Array.isArray(grupo.members)) {
          flatMembers = [...flatMembers, ...grupo.members];
        }
      });
      setMembros(flatMembers);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar diretoria.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiretoria();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este membro?')) {
      try {
        await institucionalService.deletarDiretoria(id);
        fetchDiretoria(); // Recarrega após deletar
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir membro.');
      }
    }
  };

  return (
    <div className="admin-page-container">
      <Link to="/admin" className="back-link">← Voltar ao painel</Link>
      
      <div className="admin-page-header">
        <h1>Diretoria</h1>
        <button className="btn-primary" onClick={() => navigate('/admin/diretoria/novo')}>
          Novo Membro
        </button>
      </div>

      <div className="admin-page-content">
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="error-msg">{error}</p>
        ) : membros.length === 0 ? (
          <p>Nenhum membro da diretoria cadastrado.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cargo</th>
                <th>Categoria</th>
                <th>Ordem</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {membros.map(membro => (
                <tr key={membro.id}>
                  <td>{membro.name}</td>
                  <td>{membro.role}</td>
                  <td>{membro.category}</td>
                  <td>{membro.sortOrder}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn-edit" 
                      onClick={() => navigate(`/admin/diretoria/${membro.id}/editar`, { state: { membro } })}
                    >
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(membro.id)}>
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

export default DiretoriaList;
