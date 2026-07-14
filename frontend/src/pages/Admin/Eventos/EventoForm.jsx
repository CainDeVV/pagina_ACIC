import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { eventosService } from '@/services/eventosService';
import RichEditor from '@/components/RichEditor';
import AdminFormLayout from '@/components/Admin/AdminFormLayout';
import CoverImageFields from '@/components/Admin/CoverImageFields';
import { CONTENT_STATUS, STATUS_LABELS } from '@/constants/status';
import { toDatetimeLocal } from '@/utils/dateUtils';
import { useAdminForm } from '@/hooks/useAdminForm';
import { validateStandardFields, cleanEmptyStrings } from '@/utils/formUtils';

function EventoForm() {
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
    service: eventosService,
    redirectPath: '/admin/eventos',
    initialData: {
      title: '',
      description: null,
      location: '',
      startsAt: '',
      endsAt: '',
      capacity: '',
      coverImage: '',
      coverImageCaption: '',
      showCoverImage: true,
      destaque: false,
      status: CONTENT_STATUS.DRAFT,
      publishedAt: ''
    }
  });

  // Corrige formato da data quando vem da API
  React.useEffect(() => {
    if (formData.startsAt && formData.startsAt.includes('T') && formData.startsAt.endsWith('Z')) {
      setFormData(prev => ({ 
        ...prev, 
        startsAt: toDatetimeLocal(prev.startsAt),
        endsAt: prev.endsAt ? toDatetimeLocal(prev.endsAt) : '',
        publishedAt: prev.publishedAt ? toDatetimeLocal(prev.publishedAt) : ''
      }));
    }
  }, [formData.startsAt, setFormData]);

  const onSave = (e) => {
    setFieldErrors({});

    handleSubmit(e, 
      // validationFn
      (currentData) => {
        const errors = validateStandardFields(currentData);

        if (!currentData.startsAt) {
          errors.startsAt = 'A data de início é obrigatória.';
        } else {
          const d = new Date(currentData.startsAt);
          if (isNaN(d.getTime())) {
            errors.startsAt = 'Data de início inválida. Verifique o formato.';
          }
        }

        if (currentData.endsAt) {
          const d = new Date(currentData.endsAt);
          if (isNaN(d.getTime())) {
            errors.endsAt = 'Data de término inválida. Verifique o formato.';
          } else {
            const startsAtDate = new Date(currentData.startsAt);
            if (!isNaN(startsAtDate.getTime()) && startsAtDate >= d) {
              errors.endsAt = 'A data de término deve ser posterior à data de início.';
            }
          }
        }

        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          return 'Foram encontrados erros nos campos do formulário. Corrija-os e tente novamente.';
        }
        return null;
      },
      // mapDataFn
      async (currentData) => {
        let finalDescription = currentData.description;
        if (editorRef.current) {
          const editorData = await editorRef.current.save();
          if (editorData) {
            finalDescription = editorData;
          }
        }

        if (!finalDescription) {
          setFieldErrors(prev => ({ ...prev, description: 'A descrição é obrigatória.' }));
          setError('Foram encontrados erros nos campos do formulário. Corrija-os e tente novamente.');
          throw new Error('Validação falhou');
        }

        let parsedStartsAt = new Date(currentData.startsAt).toISOString();
        let parsedEndsAt = currentData.endsAt ? new Date(currentData.endsAt).toISOString() : undefined;
        let parsedPublishedAt = currentData.publishedAt ? new Date(currentData.publishedAt).toISOString() : undefined;

        const cleanedData = cleanEmptyStrings(currentData);

        return {
          ...cleanedData,
          description: finalDescription,
          startsAt: parsedStartsAt,
          endsAt: parsedEndsAt,
          publishedAt: parsedPublishedAt,
          capacity: currentData.capacity === '' ? null : Number(currentData.capacity)
        };
      }
    );
  };

  return (
    <AdminFormLayout
      title="Evento"
      backPath="/admin/eventos"
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
        {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
      </div>

      <div className="form-group">
        <label>Conteúdo Principal *</label>
        {!fetching && (
          <RichEditor
            ref={editorRef}
            value={formData.description}
            uploadFolder="eventos"
          />
        )}
        {fieldErrors.description && <span style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{fieldErrors.description}</span>}
      </div>

      <div className="form-group">
        <label>Localização</label>
        <input
          type="text"
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Data e Hora de Início *</label>
        <input
          type="datetime-local"
          name="startsAt"
          value={formData.startsAt || ''}
          onChange={handleChange}
          required
        />
        {fieldErrors.startsAt && <span style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{fieldErrors.startsAt}</span>}
      </div>

      <div className="form-group">
        <label>Data e Hora de Término</label>
        <input
          type="datetime-local"
          name="endsAt"
          value={formData.endsAt || ''}
          onChange={handleChange}
        />
        {fieldErrors.endsAt && <span style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{fieldErrors.endsAt}</span>}
      </div>

      <div className="form-group">
        <label>Capacidade (nº de vagas)</label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity || ''}
          onChange={handleChange}
        />
      </div>

      <CoverImageFields 
        folder="eventos" 
        formData={formData} 
        setFormData={setFormData} 
        handleChange={handleChange} 
        checkboxLabel="Exibir a imagem de capa dentro do evento?" 
      />

      <div className="form-group">
        <label>Status *</label>
        <select name="status" value={formData.status || ''} onChange={handleChange} required>
          <option value={CONTENT_STATUS.DRAFT}>{STATUS_LABELS[CONTENT_STATUS.DRAFT]}</option>
          <option value={CONTENT_STATUS.PUBLISHED}>{STATUS_LABELS[CONTENT_STATUS.PUBLISHED]}</option>
          <option value={CONTENT_STATUS.CANCELLED}>{STATUS_LABELS[CONTENT_STATUS.CANCELLED]}</option>
          <option value={CONTENT_STATUS.FINISHED}>{STATUS_LABELS[CONTENT_STATUS.FINISHED]}</option>
        </select>
      </div>

      <div className="form-group">
        <label>Agendar Publicação Automática (Opcional)</label>
        <input
          type="datetime-local"
          name="publishedAt"
          value={formData.publishedAt || ''}
          onChange={handleChange}
        />
        <span style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px', display: 'block' }}>
          Deixe em branco para controle manual. Se preenchido e o status for Rascunho, o evento será publicado automaticamente nesta data.
        </span>
      </div>

      <div className="form-group form-group-checkbox">
        <input
          type="checkbox"
          name="destaque"
          id="destaque"
          checked={formData.destaque || false}
          onChange={handleChange}
        />
        <label htmlFor="destaque">Destacar este evento na página inicial?</label>
      </div>
    </AdminFormLayout>
  );
}

export default EventoForm;