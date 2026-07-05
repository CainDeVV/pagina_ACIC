import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './AdminGlobal.css';

function AdminFormLayout({ title, backPath, isEditing, loading, fetching, error, onSubmit, children }) {
  const navigate = useNavigate();

  return (
    <div className="admin-page-container">
      <Helmet><title>{`${isEditing ? 'Editar' : 'Novo'} ${title} | ACIC`}</title></Helmet>
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