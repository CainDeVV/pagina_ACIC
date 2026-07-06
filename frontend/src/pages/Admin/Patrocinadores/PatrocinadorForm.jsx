import { useParams } from 'react-router-dom';
import AdminFormLayout from '@/components/Admin/AdminFormLayout';
import ImageUploader from '@/components/Admin/ImageUploader';
import { patrocinadoresService } from '@/services/patrocinadoresService';
import { CONTENT_STATUS, STATUS_LABELS } from '@/constants/status';
import { useAdminForm } from '@/hooks/useAdminForm';

function PatrocinadorForm() {
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
    service: patrocinadoresService,
    redirectPath: '/admin/patrocinadores',
    initialData: {
      name: '',
      logoUrl: '',
      linkUrl: '',
      status: CONTENT_STATUS.PUBLISHED,
      sortOrder: 0
    }
  });

  const onSave = (e) => {
    handleSubmit(e, (data) => {
      if (!data.logoUrl) return 'A logomarca é obrigatória!';
      return null;
    });
  };

  return (
    <AdminFormLayout
      title="Patrocinador"
      backPath="/admin/patrocinadores"
      isEditing={!!id}
      fetching={fetching}
      loading={loading}
      error={error}
      onSubmit={onSave}
    >
      <div className="form-group">
        <label>Nome do Patrocinador *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Ex: Banco do Brasil"
        />
      </div>

      <div className="form-group">
        <label>Link do Patrocinador (Site / Instagram)</label>
        <input
          type="url"
          name="linkUrl"
          value={formData.linkUrl || ''}
          onChange={handleChange}
          placeholder="https://www.site.com.br"
        />
      </div>

      <div className="form-group">
        <label>Status *</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value={CONTENT_STATUS.DRAFT}>{STATUS_LABELS[CONTENT_STATUS.DRAFT]}</option>
          <option value={CONTENT_STATUS.PUBLISHED}>{STATUS_LABELS[CONTENT_STATUS.PUBLISHED]}</option>
        </select>
      </div>

      <div className="form-group">
        <label>Ordem (0 para primeiro)</label>
        <input
          type="number"
          name="sortOrder"
          value={formData.sortOrder}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Logomarca do Patrocinador *</label>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>
          Recomendado: Fundo transparente (PNG), proporção quadrada ou retangular horizontal.
        </p>
        <ImageUploader 
          folder="patrocinadores" 
          currentUrl={formData.logoUrl} 
          onUploadSuccess={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))} 
        />
        <input 
          type="text" 
          name="logoUrl" 
          value={formData.logoUrl} 
          onChange={handleChange} 
          placeholder="Ou cole uma URL direta da logomarca aqui..."
          style={{ marginTop: '10px' }}
        />
      </div>
    </AdminFormLayout>
  );
}

export default PatrocinadorForm;
