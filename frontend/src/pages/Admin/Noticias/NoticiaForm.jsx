import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { noticiasService } from '@/services/noticiasService';
import categoriasService from '@/services/categoriasService';
import RichEditor from '@/components/RichEditor';
import AdminFormLayout from '@/components/Admin/AdminFormLayout';
import CoverImageFields from '@/components/Admin/CoverImageFields';
import CategoryCheckboxGroup from '@/components/Admin/CategoryCheckboxGroup';
import { CONTENT_STATUS, STATUS_LABELS } from '@/constants/status';
import { toDatetimeLocal } from '@/utils/dateUtils';
import { useAdminForm } from '@/hooks/useAdminForm';
import { validateStandardFields, cleanEmptyStrings } from '@/utils/formUtils';

function NoticiaForm() {
  const { id } = useParams();
  const editorRef = useRef(null);

  const [fieldErrors, setFieldErrors] = useState({});
  const [categoriasAtivas, setCategoriasAtivas] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  const {
    formData,
    setFormData,
    loading,
    fetching,
    error,
    setError,
    handleChange,
    handleSubmit
  } = useAdminForm({
    id,
    service: noticiasService,
    redirectPath: '/admin/noticias',
    initialData: {
      title: '',
      summary: '',
      content: null,
      coverImage: '',
      coverImageCaption: '',
      showCoverImage: true,
      destaque: false,
      status: CONTENT_STATUS.DRAFT,
      publishedAt: '',
      categoriasIds: []
    },
    onDataLoad: (apiData, mappedData) => {
      if (apiData.publishedAt) mappedData.publishedAt = toDatetimeLocal(apiData.publishedAt);
      if (apiData.categorias) {
        mappedData.categoriasIds = apiData.categorias.map(c => c.id);
      }
      return mappedData;
    }
  });

  React.useEffect(() => {
    categoriasService.buscarAtivas()
      .then(setCategoriasAtivas)
      .catch(console.error)
      .finally(() => setLoadingCategorias(false));
  }, []);


  const onSave = (e) => {
    setFieldErrors({});
    
    handleSubmit(e, 
      // validationFn
      (currentData) => {
        const errors = validateStandardFields(currentData);
        
        if (currentData.publishedAt) {
          const d = new Date(currentData.publishedAt);
          if (isNaN(d.getTime())) {
            errors.publishedAt = 'Data e hora inválidas. Verifique o formato.';
          }
        }
        
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          return 'Foram encontrados erros nos campos do formulário. Corrija-os e tente novamente.';
        }
        return null; // Sem erros
      }, 
      // mapDataFn
      async (currentData) => {
        let finalContent = currentData.content;
        if (editorRef.current) {
          const editorData = await editorRef.current.save();
          if (editorData) {
            finalContent = editorData;
          }
        }

        if (!finalContent) {
          setFieldErrors(prev => ({ ...prev, content: 'O conteúdo da notícia é obrigatório.' }));
          setError('Foram encontrados erros nos campos do formulário. Corrija-os e tente novamente.');
          throw new Error('Validação falhou'); // Cancela o envio
        }

        let parsedPublishedAt = undefined;
        if (currentData.publishedAt) {
          parsedPublishedAt = new Date(currentData.publishedAt).toISOString();
        }

        const validFormData = { ...currentData };
        delete validFormData.categorias;

        const cleanedData = cleanEmptyStrings(validFormData);
        
        return {
          ...cleanedData,
          content: finalContent,
          publishedAt: parsedPublishedAt,
          categoriasIds: cleanedData.categoriasIds || []
        };
      }
    );
  };

  const handleCategoriaToggle = (catId) => {
    setFormData(prev => {
      const currentIds = prev.categoriasIds || [];
      const isSelected = currentIds.includes(catId);
      let newIds;
      if (isSelected) {
        newIds = currentIds.filter(id => id !== catId);
      } else {
        newIds = [...currentIds, catId];
      }
      return { ...prev, categoriasIds: newIds };
    });
  };

  return (
    <AdminFormLayout
      title="Notícia"
      backPath="/admin/noticias"
      isEditing={!!id}
      fetching={fetching}
      loading={loading}
      error={error}
      onSubmit={onSave}
    >
      <div className="form-group">
        <label>Título *</label>
        <input type="text" name="title" value={formData.title || ''} onChange={handleChange} required />
        {fieldErrors.title && <span className="admin-field-error">{fieldErrors.title}</span>}
      </div>

      <div className="form-group">
        <label>Resumo</label>
        <textarea name="summary" value={formData.summary || ''} onChange={handleChange} rows="3" />
      </div>

      <div className="form-group">
        <label>Conteúdo Principal *</label>
        {!fetching && (
          <RichEditor 
            ref={editorRef} 
            value={formData.content} 
            uploadFolder="noticias"
          />
        )}
        {fieldErrors.content && <span className="admin-field-error">{fieldErrors.content}</span>}
      </div>

      <CoverImageFields 
        folder="noticias" 
        formData={formData} 
        setFormData={setFormData} 
        handleChange={handleChange} 
        checkboxLabel="Exibir a imagem de capa dentro do artigo?" 
      />

      <div className="form-group">
        <label>Status *</label>
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value={CONTENT_STATUS.DRAFT}>{STATUS_LABELS[CONTENT_STATUS.DRAFT]}</option>
          <option value={CONTENT_STATUS.PUBLISHED}>{STATUS_LABELS[CONTENT_STATUS.PUBLISHED]}</option>
        </select>
      </div>

      <div className="form-group">
        <label>Data e Hora de Publicação</label>
        <input type="datetime-local" name="publishedAt" value={formData.publishedAt || ''} onChange={handleChange} />
        {fieldErrors.publishedAt && <span className="admin-field-error">{fieldErrors.publishedAt}</span>}
      </div>

      <div className="form-group form-group-checkbox">
        <input type="checkbox" name="destaque" id="destaque" checked={formData.destaque || false} onChange={handleChange} />
        <label htmlFor="destaque">Destacar esta notícia na página inicial?</label>
      </div>

      <div className="form-group">
        <label>Categorias</label>
        <CategoryCheckboxGroup 
          categoriasAtivas={categoriasAtivas} 
          selectedIds={formData.categoriasIds || []} 
          onChange={handleCategoriaToggle} 
          loading={loadingCategorias}
        />
      </div>
    </AdminFormLayout>
  );
}

export default NoticiaForm;