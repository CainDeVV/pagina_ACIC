import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminGlobal.css';

function AdminFormLayout({ title, backPath, isEditing, loading, fetching, error, onSubmit, children }) {
  const navigate = useNavigate();

  return (
    <div className="admin-page-container">
      <Link to={backPath} className="back-link">← Voltar</Link>

      <div className="admin-form-content">
        <h1>{isEditing ? `Editar ${title}` : `Novo ${title}`}</h1>

        {fetching ? (
          <p>Carregando...</p>
        ) : (
          <form onSubmit={onSubmit} className="crud-form">
            {error && <p className="error-msg">{error}</p>}

            {/* Aqui dentro vão os campos de input de cada tela específica */}
            {children}

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate(backPath)}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminFormLayout;