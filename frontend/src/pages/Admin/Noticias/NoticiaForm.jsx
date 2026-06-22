import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { noticiasService } from '../../../services/noticiasService';
import RichEditor from '../../../components/RichEditor';
import './NoticiaForm.css';

function NoticiaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    coverImage: '',
    status: 'DRAFT',
    publishedAt: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState(null);

  // Converte string ISO para YYYY-MM-DDTHH:mm para o input datetime-local
  const toDatetimeLocal = (iso) => (iso ? iso.slice(0, 16) : '');

  useEffect(() => {
    if (isEditing) {
      const fetchNoticia = async () => {
        try {
          const data = await noticiasService.buscarPorId(id);
          setFormData({
            title: data.title || '',
            summary: data.summary || '',
            content: data.content || '',
            coverImage: data.coverImage || '',
            status: data.status || 'DRAFT',
            publishedAt: toDatetimeLocal(data.publishedAt)
          });
        } catch (err) {
          console.error(err);
          setError('Erro ao carregar dados da notícia.');
        } finally {
          setFetching(false);
        }
      };
      fetchNoticia();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSubmit = {
      ...formData,
      publishedAt: formData.publishedAt === '' ? null : formData.publishedAt
    };

    try {
      if (isEditing) {
        await noticiasService.atualizar(id, dataToSubmit);
      } else {
        await noticiasService.criar(dataToSubmit);
      }
      navigate('/admin/noticias');
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar notícia.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-page-container">
      <Link to="/admin/noticias" className="back-link">← Voltar</Link>
      
      <div className="admin-form-content">
        <h1>{isEditing ? 'Editar Notícia' : 'Nova Notícia'}</h1>
        
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
              <label>Conteúdo (Content) *</label>
              <RichEditor
                value={formData.content}
                onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
              />
            </div>

            <div className="form-group">
              <label>URL da Imagem de Capa</label>
              <input
                type="text"
                name="coverImage"
                value={formData.coverImage}
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
              <label>Data e Hora de Publicação</label>
              <input
                type="datetime-local"
                name="publishedAt"
                value={formData.publishedAt}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate('/admin/noticias')}>
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

export default NoticiaForm;
