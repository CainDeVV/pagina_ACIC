import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { noticiasService } from '../../../services/noticiasService';
import RichEditor from '../../../components/RichEditor';
import AdminFormLayout from '../../../components/Admin/AdminFormLayout';
import CoverImageFields from '../../../components/Admin/CoverImageFields';
import { CONTENT_STATUS, STATUS_LABELS } from '../../../constants/status';
import { toDatetimeLocal } from '../../../utils/dateUtils';
import { useAdminForm } from '../../../hooks/useAdminForm';

function NoticiaForm() {
  const { id } = useParams();
  const editorRef = useRef(null);

  const [fieldErrors, setFieldErrors] = useState({});

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
      publishedAt: ''
    }
  });

  // Gambiarra necessária pois publishedAt vem do banco em ISO
  // O ideal era formatar no useAdminForm, mas para preservar a genericidade,
  // fazemos um parse local se a string tiver formato ISO longo
  React.useEffect(() => {
    if (formData.publishedAt && formData.publishedAt.includes('T') && formData.publishedAt.endsWith('Z')) {
      setFormData(prev => ({ ...prev, publishedAt: toDatetimeLocal(prev.publishedAt) }));
    }
  }, [formData.publishedAt, setFormData]);


  const onSave = (e) => {
    setFieldErrors({});
    
    handleSubmit(e, 
      // validationFn
      (currentData) => {
        const errors = {};
        if (!currentData.title?.trim()) errors.title = 'O título é obrigatório.';
        
        let parsedPublishedAt = undefined;
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

        const { destaque, ...validFormData } = currentData;
        
        return {
          ...validFormData,
          content: finalContent,
          summary: currentData.summary === '' ? null : currentData.summary,
          coverImage: currentData.coverImage === '' ? null : currentData.coverImage,
          coverImageCaption: currentData.coverImageCaption === '' ? null : currentData.coverImageCaption,
          showCoverImage: currentData.showCoverImage,
          publishedAt: parsedPublishedAt
        };
      }
    );
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
        {fieldErrors.title && <span style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{fieldErrors.title}</span>}
      </div>

      <div className="form-group">
        <label>Resumo (Summary)</label>
        <textarea name="summary" value={formData.summary || ''} onChange={handleChange} rows="3" />
      </div>

      <div className="form-group">
        <label>Conteúdo (Content) *</label>
        {!fetching && (
          <RichEditor 
            ref={editorRef} 
            value={formData.content} 
            uploadFolder="noticias"
          />
        )}
        {fieldErrors.content && <span style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{fieldErrors.content}</span>}
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
        {fieldErrors.publishedAt && <span style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{fieldErrors.publishedAt}</span>}
      </div>

      <div className="form-group form-group-checkbox">
        <input type="checkbox" name="destaque" id="destaque" checked={formData.destaque || false} onChange={handleChange} />
        <label htmlFor="destaque">Destacar esta notícia na página inicial?</label>
      </div>
    </AdminFormLayout>
  );
}

export default NoticiaForm;