import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { slidesService } from '../../../services/slidesService';
import './SlideForm.css';

function SlideForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    linkUrl: '',
    status: 'DRAFT',
    sortOrder: 0
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchSlide = async () => {
        try {
          const data = await slidesService.buscarPorId(id);
          setFormData({
            title: data.title || '',
            subtitle: data.subtitle || '',
            imageUrl: data.imageUrl || '',
            linkUrl: data.linkUrl || '',
            status: data.status || 'DRAFT',
            sortOrder: data.sortOrder || 0
          });
        } catch (err) {
          console.error(err);
          setError('Erro ao carregar dados do slide.');
        } finally {
          setFetching(false);
        }
      };
      fetchSlide();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await slidesService.atualizar(id, formData);
      } else {
        await slidesService.criar(formData);
      }
      navigate('/admin/slides');
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar slide.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-page-container">
      <Link to="/admin/slides" className="back-link">← Voltar</Link>
      
      <div className="admin-form-content">
        <h1>{isEditing ? 'Editar Slide' : 'Novo Slide'}</h1>
        
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
              <label>Subtítulo</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>URL da Imagem *</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Link (URL de destino)</label>
              <input
                type="text"
                name="linkUrl"
                value={formData.linkUrl}
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

            <div className="form-group">
              <label>Ordem</label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate('/admin/slides')}>
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

export default SlideForm;
