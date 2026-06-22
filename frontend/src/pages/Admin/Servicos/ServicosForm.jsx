import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { servicosService } from '../../../services/servicosService';
import RichEditor from '../../../components/RichEditor';
import './ServicosForm.css';

function ServicosForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    icon: '',
    imageUrl: '',
    destaque: false,
    status: 'DRAFT'
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchServico = async () => {
        try {
          const data = await servicosService.buscarPorId(id);
          setFormData({
            title: data.title || '',
            summary: data.summary || '',
            description: data.description || '',
            icon: data.icon || '',
            imageUrl: data.imageUrl || '',
            destaque: !!data.destaque,
            status: data.status || 'DRAFT'
          });
        } catch (err) {
          console.error(err);
          setError('Erro ao carregar dados do serviço.');
        } finally {
          setFetching(false);
        }
      };
      fetchServico();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await servicosService.atualizar(id, formData);
      } else {
        await servicosService.criar(formData);
      }
      navigate('/admin/servicos');
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar serviço.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-page-container">
      <Link to="/admin/servicos" className="back-link">← Voltar</Link>
      
      <div className="admin-form-content">
        <h1>{isEditing ? 'Editar Serviço' : 'Novo Serviço'}</h1>
        
        {fetching ? (
          <p>Carregando...</p>
        ) : (
          <form onSubmit={handleSubmit} className="crud-form">
            {error && <p className="error-msg">{error}</p>}
            
            <div className="form-group">
              <label>Título *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Resumo (Summary)</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Descrição (Conteúdo Principal) *</label>
              <RichEditor
                value={formData.description}
                onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
              />
            </div>

            <div className="form-group">
              <label>Ícone (Nome ou URL)</label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>URL da Imagem</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} required>
                <option value="DRAFT">Rascunho (DRAFT)</option>
                <option value="PUBLISHED">Publicado (PUBLISHED)</option>
                <option value="ARCHIVED">Arquivado (ARCHIVED)</option>
              </select>
            </div>

            <div className="form-group form-group-checkbox">
              <input
                type="checkbox"
                name="destaque"
                id="destaque"
                checked={formData.destaque}
                onChange={handleChange}
              />
              <label htmlFor="destaque">Destacar este serviço na página inicial?</label>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate('/admin/servicos')}>
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

export default ServicosForm;
