import React from 'react';
import { useParams } from 'react-router-dom';
import { institucionalService } from '../../../services/institucionalService';
import AdminFormLayout from '../../../components/Admin/AdminFormLayout';
import ImageUploader from '../../../components/Admin/ImageUploader';
import { useAdminForm } from '../../../hooks/useAdminForm';

function PresidenteForm() {
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
    service: { 
      buscarPorId: institucionalService.buscarPresidentePorId, 
      criar: institucionalService.criarPresidente, 
      atualizar: institucionalService.atualizarPresidente 
    },
    redirectPath: '/admin/presidentes',
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
    handleSubmit(e, null, (currentData) => ({
      ...currentData,
      termStart: Number(currentData.termStart),
      termEnd: currentData.termEnd === '' ? null : Number(currentData.termEnd),
      photoUrl: currentData.photoUrl === '' ? null : currentData.photoUrl,
      bio: currentData.bio === '' ? null : currentData.bio,
      sortOrder: currentData.sortOrder === '' ? undefined : Number(currentData.sortOrder)
    }));
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
      </div>

      <div className="form-group">
        <label>Ano de Início (termStart) *</label>
        <input type="number" name="termStart" value={formData.termStart === undefined ? '' : formData.termStart} onChange={handleChange} required />
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
          style={{ marginTop: '10px' }}
        />
      </div>

      <div className="form-group">
        <label>Biografia (bio)</label>
        <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows="4" />
      </div>

      <div className="form-group">
        <label>Ordem de Exibição (sortOrder)</label>
        <input type="number" name="sortOrder" value={formData.sortOrder === undefined ? '' : formData.sortOrder} onChange={handleChange} />
      </div>
    </AdminFormLayout>
  );
}

export default PresidenteForm;