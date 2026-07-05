import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminTable from './AdminTable';
import './AdminGlobal.css'; // Importamos o CSS Global aqui

function AdminListLayout({ title, createButtonLabel, createPath, loading, error, data, columns, onEdit, onDelete, onReorder }) {
  const navigate = useNavigate();

  return (
    <div className="admin-page-container">
      <Helmet><title>{`Lista de ${title} | ACIC`}</title></Helmet>
      <Link to="/admin" className="back-link">← Voltar ao painel</Link>

      <div className="admin-page-header">
        <h1>{title}</h1>
        <button className="btn-primary" onClick={() => navigate(createPath)}>
          {createButtonLabel || `Novo(a) ${title}`}
        </button>
      </div>

      <div className="admin-page-content">
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="error-msg">{error}</p>
        ) : (
          <AdminTable 
            columns={columns} 
            data={data} 
            onEdit={onEdit} 
            onDelete={onDelete} 
            onReorder={onReorder}
          />
        )}
      </div>
    </div>
  );
}

export default AdminListLayout;