import React from 'react';
import { useParams } from 'react-router-dom';
import { institucionalService } from '@/services/institucionalService';
import AdminFormLayout from '@/components/Admin/AdminFormLayout';
import ImageUploader from '@/components/Admin/ImageUploader';
import { useAdminForm } from '@/hooks/useAdminForm';

function DiretoriaForm() {
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
      buscarPorId: institucionalService.buscarDiretorPorId, 
      criar: institucionalService.criarDiretoria, 
      atualizar: institucionalService.atualizarDiretoria 
    },
    redirectPath: '/admin/diretoria',
    initialData: {
      name: '',
      role: '',
      category: '',
      photoUrl: '',
      bio: '',
      sortOrder: ''
    }
  });

  const onSave = (e) => {
    handleSubmit(e, null, (currentData) => ({
      ...currentData,
      photoUrl: currentData.photoUrl === '' ? null : currentData.photoUrl,
      bio: currentData.bio === '' ? null : currentData.bio,
      sortOrder: currentData.sortOrder === '' ? undefined : Number(currentData.sortOrder)
    }));
  };

  return (
    <AdminFormLayout
      title="Membro da Diretoria"
      backPath="/admin/diretoria"
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
        <label>Empresa Representada (Role) *</label>
        <input type="text" name="role" value={formData.role || ''} onChange={handleChange} placeholder="Ex: Gráfica Crateús" required />
      </div>

      <div className="form-group">
        <label>Cargo na ACIC (Categoria) *</label>
        <input 
          type="text" 
          name="category" 
          value={formData.category || ''} 
          onChange={handleChange} 
          list="category-suggestions"
          placeholder="Selecione ou digite o cargo..."
          required 
        />
        <datalist id="category-suggestions">
          <option value="PRESIDENTE" />
          <option value="I VICE-PRESIDENTE" />
          <option value="II VICE-PRESIDENTE" />
          <option value="I SECRETÁRIO" />
          <option value="II SECRETÁRIO" />
          <option value="I TESOUREIRO" />
          <option value="II TESOUREIRO" />
          <option value="DIRETOR SOCIAL" />
          <option value="RELAÇÕES PÚBLICAS" />
          <option value="CONSELHO FISCAL" />
          <option value="CONSELHO CONSULTIVO" />
        </datalist>
      </div>

      <div className="form-group">
        <label>Foto do Membro da Diretoria</label>
        <ImageUploader 
          folder="diretoria" 
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

export default DiretoriaForm;