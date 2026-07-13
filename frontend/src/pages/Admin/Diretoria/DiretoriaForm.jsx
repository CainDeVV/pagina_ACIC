import { useParams } from 'react-router-dom';
import { institucionalService } from '@/services/institucionalService';
import AdminFormLayout from '@/components/Admin/AdminFormLayout';
import ImageUploader from '@/components/Admin/ImageUploader';
import { useAdminForm } from '@/hooks/useAdminForm';
import { validateStandardFields, cleanEmptyStrings } from '@/utils/formUtils';
import { useState } from 'react';

const PRESET_CATEGORIES = [
  "PRESIDENTE",
  "I VICE-PRESIDENTE",
  "II VICE-PRESIDENTE",
  "I SECRETÁRIO",
  "II SECRETÁRIO",
  "I TESOUREIRO",
  "II TESOUREIRO",
  "DIRETOR SOCIAL",
  "RELAÇÕES PÚBLICAS",
  "CONSELHO FISCAL",
  "CONSELHO CONSULTIVO"
];
const diretoriaServiceAdapter = { 
  buscarPorId: institucionalService.buscarDiretorPorId, 
  criar: institucionalService.criarDiretoria, 
  atualizar: institucionalService.atualizarDiretoria 
};

const fetchDiretoriaFlat = async () => {
  const result = await institucionalService.buscarDiretoriaAdmin();
  const flatList = [];
  if (result && Array.isArray(result.data)) {
    result.data.forEach(group => {
      if (group.members && Array.isArray(group.members)) {
        flatList.push(...group.members);
      }
    });
  }
  return { data: flatList };
};

function DiretoriaForm() {
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
    service: diretoriaServiceAdapter,
    redirectPath: '/admin/diretoria',
    fetchItemsFn: fetchDiretoriaFlat,
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
    setFieldErrors({});
    handleSubmit(e, 
      (currentData) => {
        const errors = validateStandardFields(currentData, ['role', 'category']);
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
          sortOrder: currentData.sortOrder === '' ? undefined : Number(currentData.sortOrder)
        };
      }
    );
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
        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
      </div>

      <div className="form-group">
        <label>Empresa Representada *</label>
        <input type="text" name="role" value={formData.role || ''} onChange={handleChange} placeholder="Ex: Gráfica Crateús" required />
        {fieldErrors.role && <span className="field-error">{fieldErrors.role}</span>}
      </div>

      <div className="form-group">
        <label>Cargo na ACIC *</label>
        <select 
          name="category"
          value={formData.category || ''} 
          onChange={handleChange} 
          required
        >
          <option value="" disabled>Selecione um cargo...</option>
          {PRESET_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
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

export default DiretoriaForm;