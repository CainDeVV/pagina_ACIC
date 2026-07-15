import { useParams } from 'react-router-dom';
import { institucionalService } from '@/services/institucionalService';
import AdminFormLayout from '@/components/Admin/AdminFormLayout';
import ImageUploader from '@/components/Admin/ImageUploader';
import { useAdminForm } from '@/hooks/useAdminForm';
import { validateStandardFields, cleanEmptyStrings } from '@/utils/formUtils';
import { useState } from 'react';

const presidenteServiceAdapter = { 
  buscarPorId: institucionalService.buscarPresidentePorId, 
  criar: institucionalService.criarPresidente, 
  atualizar: institucionalService.atualizarPresidente 
};

function PresidenteForm() {
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
    service: presidenteServiceAdapter,
    redirectPath: '/admin/presidentes',
    fetchItemsFn: institucionalService.buscarPresidentesAdmin,
    initialData: {
      name: '',
      termStart: '',
      termEnd: '',
      photoUrl: '',
      bio: '',
      sortOrder: ''
    }
  });

  const onSave = (e) => {
    setFieldErrors({});
    handleSubmit(e, 
      (currentData) => {
        const errors = validateStandardFields(currentData, ['termStart']);
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
          termStart: Number(currentData.termStart),
          termEnd: currentData.termEnd === '' ? null : Number(currentData.termEnd),
          sortOrder: currentData.sortOrder === '' ? undefined : Number(currentData.sortOrder)
        };
      }
    );
  };

  return (
    <AdminFormLayout
      title="Presidente"
      backPath="/admin/presidentes"
      isEditing={!!id}
      fetching={fetching}
      loading={loading}
      error={error}
      onSubmit={onSave}
    >
      <div className="form-group">
        <label>Nome *</label>
        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
      </div>

      <div className="form-group">
        <label>Ano de Início *</label>
        <input type="number" name="termStart" value={formData.termStart === undefined ? '' : formData.termStart} onChange={handleChange} required />
        {fieldErrors.termStart && <span className="field-error">{fieldErrors.termStart}</span>}
      </div>

      <div className="form-group">
        <label>Ano de Término (Deixe em branco se for o atual)</label>
        <input type="number" name="termEnd" value={formData.termEnd === undefined || formData.termEnd === null ? '' : formData.termEnd} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Foto do Presidente</label>
        <ImageUploader 
          folder="presidentes" 
          currentUrl={formData.photoUrl} 
          onUploadSuccess={(url) => setFormData(prev => ({ ...prev, photoUrl: url }))} 
        />
        <input 
          type="text" 
          name="photoUrl" 
          value={formData.photoUrl || ''} 
          onChange={handleChange} 
          placeholder="Ou cole uma URL direta da imagem aqui..."
          className="admin-form-group-margin"
        />
      </div>

      <div className="form-group">
        <label>Biografia</label>
        <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows="4" />
      </div>

      <div className="form-group">
        <label>Ordem de Exibição</label>
        <input type="number" name="sortOrder" value={formData.sortOrder === undefined ? '' : formData.sortOrder} onChange={handleChange} />
      </div>
    </AdminFormLayout>
  );
}

export default PresidenteForm;