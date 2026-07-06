import { useParams } from 'react-router-dom';
import { slidesService } from '@/services/slidesService';
import AdminFormLayout from '@/components/Admin/AdminFormLayout';
import ImageUploader from '@/components/Admin/ImageUploader';
import { CONTENT_STATUS, STATUS_LABELS } from '@/constants/status';
import { useAdminForm } from '@/hooks/useAdminForm';

function SlideForm() {
  const { id } = useParams();

  const {
    formData,
    setFormData,
    loading,
    fetching,
    error,
    handleChange,
    handleSubmit
  } = useAdminForm({
    id,
    service: slidesService,
    redirectPath: '/admin/slides',
    initialData: {
      title: '',
      subtitle: '',
      imageUrl: '',
      linkUrl: '',
      status: CONTENT_STATUS.DRAFT,
      sortOrder: 0
    }
  });

  const onSave = (e) => {
    handleSubmit(e, null, (currentData) => ({
      ...currentData,
      subtitle: currentData.subtitle === '' ? undefined : currentData.subtitle,
      linkUrl: currentData.linkUrl === '' ? undefined : currentData.linkUrl,
      sortOrder: currentData.sortOrder === '' ? 0 : Number(currentData.sortOrder)
    }));
  };

  return (
    <AdminFormLayout
      title="Slide"
      backPath="/admin/slides"
      isEditing={!!id}
      fetching={fetching}
      loading={loading}
      error={error}
      onSubmit={onSave}
    >
      <div className="form-group">
        <label>Título *</label>
        <input
          type="text"
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Subtítulo</label>
        <input
          type="text"
          name="subtitle"
          value={formData.subtitle || ''}
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
          value={formData.imageUrl || ''}
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
          value={formData.linkUrl || ''}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Status *</label>
        <select name="status" value={formData.status || ''} onChange={handleChange} required>
          <option value={CONTENT_STATUS.DRAFT}>{STATUS_LABELS[CONTENT_STATUS.DRAFT]}</option>
          <option value={CONTENT_STATUS.PUBLISHED}>{STATUS_LABELS[CONTENT_STATUS.PUBLISHED]}</option>
        </select>
      </div>

      <div className="form-group">
        <label>Ordem de Exibição (sortOrder)</label>
        <input
          type="number"
          name="sortOrder"
          value={formData.sortOrder === undefined ? '' : formData.sortOrder}
          onChange={handleChange}
        />
      </div>
    </AdminFormLayout>
  );
}

export default SlideForm;