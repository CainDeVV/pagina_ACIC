import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAdminForm } from '@/hooks/useAdminForm';
import AdminFormLayout from '@/components/Admin/AdminFormLayout';
import categoriasService from '@/services/categoriasService';
import { validateStandardFields, cleanEmptyStrings } from '@/utils/formUtils';

function CategoriaForm() {
  const { id } = useParams();

  const [fieldErrors, setFieldErrors] = useState({});

  const {
    formData,
    loading,
    fetching,
    error,
    handleChange,
    handleSubmit
  } = useAdminForm({
    id,
    service: categoriasService,
    redirectPath: '/admin/categorias',
    initialData: {
      name: '',
      color: '#3B82F6',
      active: true,
    }
  });

  const onSave = (e) => {
    setFieldErrors({});
    
    handleSubmit(e, 
      (currentData) => {
        const errors = validateStandardFields(currentData, ['name', 'color']);
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          return 'Foram encontrados erros nos campos do formulário. Corrija-os e tente novamente.';
        }
        return null;
      },
      async (currentData) => {
        const { ...validFormData } = currentData;
        const cleanedData = cleanEmptyStrings(validFormData);
        return cleanedData;
      }
    );
  };

  return (
    <AdminFormLayout
      title="Categoria"
      backPath="/admin/categorias"
      isEditing={!!id}
      fetching={fetching}
      loading={loading}
      error={error}
      onSubmit={onSave}
    >
      <div className="form-group">
        <label htmlFor="name">Nome da Categoria *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          placeholder="Ex: Saúde, Economia"
          className={fieldErrors.name ? 'input-error' : ''}
          required
        />
        {fieldErrors.name && <span className="admin-field-error">{fieldErrors.name}</span>}
      </div>

      <div className="form-group form-group-half">
        <label htmlFor="color">Cor da Tag *</label>
        <div className="admin-flex-row">
          <input
            type="color"
            id="color"
            name="color"
            value={formData.color || '#3B82F6'}
            onChange={handleChange}
            className="color-picker-input admin-color-picker"
          />
          <input
            type="text"
            name="color"
            value={formData.color || ''}
            onChange={handleChange}
            className={`admin-flex-1 ${fieldErrors.color ? 'input-error' : ''}`}
            placeholder="#3B82F6"
          />
        </div>
        <small className="admin-field-hint">Cor que será exibida no botão da categoria.</small>
        {fieldErrors.color && <span className="admin-field-error">{fieldErrors.color}</span>}
      </div>

      <div className="form-group form-group-checkbox">
        <input
          type="checkbox"
          id="active"
          name="active"
          checked={formData.active ?? true}
          onChange={handleChange}
        />
        <label htmlFor="active">Categoria Ativa (Exibir no site)</label>
      </div>
    </AdminFormLayout>
  );
}

export default CategoriaForm;
