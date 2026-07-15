import { useParams } from 'react-router-dom';
import AdminFormLayout from '@/components/Admin/AdminFormLayout';
import ImageUploader from '@/components/Admin/ImageUploader';
import { patrocinadoresService } from '@/services/patrocinadoresService';
import { CONTENT_STATUS, STATUS_LABELS } from '@/constants/status';
import { useAdminForm } from '@/hooks/useAdminForm';
import { validateStandardFields, cleanEmptyStrings } from '@/utils/formUtils';
import { useState } from 'react';

function PatrocinadorForm() {
  const { id } = useParams();
  const [fieldErrors, setFieldErrors] = useState({});

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
    fetchItemsFn: patrocinadoresService.buscarTodosAdmin,
    initialData: {
      name: '',
      logoUrl: '',
      linkUrl: '',
      status: CONTENT_STATUS.PUBLISHED,
      sortOrder: 0
    }
  });

  const onSave = (e) => {
    setFieldErrors({});
    handleSubmit(e, 
      (currentData) => {
        const errors = validateStandardFields(currentData, ['logoUrl']);
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          return 'Foram encontrados erros nos campos do formulário. Corrija-os e tente novamente.';
        }
        return null;
      },
      (currentData) => {
        const cleanedData = cleanEmptyStrings(currentData);
        return {
          ...cleanedData,
          sortOrder: currentData.sortOrder === '' ? 0 : Number(currentData.sortOrder)
        };
      }
    );
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
        <label>Nome *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Ex: Banco do Brasil"
        />
        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
      </div>

      <div className="form-group">
        <label>Link Externo (Site ou Redes Sociais)</label>
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
        <label>Logomarca do Patrocinador *</label>
        <p className="admin-field-hint">
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
          placeholder="Ou cole uma URL direta da imagem aqui..."
          className="admin-form-group-margin"
        />
        {fieldErrors.logoUrl && <span className="field-error">{fieldErrors.logoUrl}</span>}
      </div>

      <div className="form-group">
        <label>Ordem de Exibição</label>
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

export default PatrocinadorForm;
