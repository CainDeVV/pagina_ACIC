import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { slidesService } from '../../../services/slidesService';
import AdminFormLayout from '../../../components/Admin/AdminFormLayout';
import ImageUploader from '../../../components/Admin/ImageUploader';
import { Helmet } from 'react-helmet-async';

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
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Limpeza para campos opcionais e tratamento do sortOrder como número
    const dataToSubmit = {
      ...formData,
      subtitle: formData.subtitle === '' ? undefined : formData.subtitle,
      linkUrl: formData.linkUrl === '' ? undefined : formData.linkUrl,
      sortOrder: formData.sortOrder === '' ? 0 : Number(formData.sortOrder)
    };

    try {
      if (isEditing) {
        await slidesService.atualizar(id, dataToSubmit);
      } else {
        await slidesService.criar(dataToSubmit);
      }
      navigate('/admin/slides');
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar slide. Verifique os dados e tente novamente.');
      setLoading(false);
    }
  };

  return (
    <AdminFormLayout
      title="Slide"
      backPath="/admin/slides"
      isEditing={isEditing}
      fetching={fetching}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
    >
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
        <label>Imagem do Slide *</label>
        <ImageUploader 
          folder="slides" 
          currentUrl={formData.imageUrl} 
          onUploadSuccess={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))} 
        />
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          required
          placeholder="Ou cole uma URL direta da imagem aqui..."
          style={{ marginTop: '10px' }}
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
        <label>Ordem de Exibição (sortOrder)</label>
        <input
          type="number"
          name="sortOrder"
          value={formData.sortOrder}
          onChange={handleChange}
        />
      </div>
    </AdminFormLayout>
  );
}

export default SlideForm;