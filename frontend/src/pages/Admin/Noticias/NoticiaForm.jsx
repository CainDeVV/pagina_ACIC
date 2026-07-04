import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { noticiasService } from '../../../services/noticiasService';
import RichEditor from '../../../components/RichEditor';
import AdminFormLayout from '../../../components/Admin/AdminFormLayout';

function NoticiaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const editorRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: null,
    coverImage: '',
    destaque: false, // <-- ADICIONADO AQUI
    status: 'DRAFT',
    publishedAt: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState(null);

  const toDatetimeLocal = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (isEditing) {
      const fetchNoticia = async () => {
        try {
          const data = await noticiasService.buscarPorId(id);
          setFormData({
            title: data.title || '',
            summary: data.summary || '',
            content: data.content || null,
            coverImage: data.coverImage || '',
            destaque: !!data.destaque, // <-- ADICIONADO AQUI
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

    let finalContent = formData.content;
    if (editorRef.current) {
      const editorData = await editorRef.current.save();
      if (editorData) {
        finalContent = editorData;
      }
    }

    const dataToSubmit = {
      ...formData,
      content: finalContent,
      summary: formData.summary === '' ? undefined : formData.summary,
      coverImage: formData.coverImage === '' ? undefined : formData.coverImage,
      publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : undefined
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
      setError('Erro ao salvar notícia. Verifique os dados e tente novamente.');
      setLoading(false);
    }
  };

  return (
    <AdminFormLayout
      title="Notícia"
      backPath="/admin/noticias"
      isEditing={isEditing}
      fetching={fetching}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
    >
      <div className="form-group">
        <label>Título *</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Resumo (Summary)</label>
        <textarea name="summary" value={formData.summary} onChange={handleChange} rows="3" />
      </div>

      <div className="form-group">
        <label>Conteúdo (Content) *</label>
        <RichEditor ref={editorRef} value={formData.content} />
      </div>

      <div className="form-group">
        <label>URL da Imagem de Capa</label>
        <input type="text" name="coverImage" value={formData.coverImage} onChange={handleChange} />
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
        <input type="datetime-local" name="publishedAt" value={formData.publishedAt} onChange={handleChange} />
      </div>

      {/* ADICIONADO AQUI */}
      <div className="form-group form-group-checkbox">
        <input type="checkbox" name="destaque" id="destaque" checked={formData.destaque} onChange={handleChange} />
        <label htmlFor="destaque">Destacar esta notícia na página inicial?</label>
      </div>
    </AdminFormLayout>
  );
}

export default NoticiaForm;