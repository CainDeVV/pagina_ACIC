import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventosService } from '../../../services/eventosService';
import RichEditor from '../../../components/RichEditor';
import AdminFormLayout from '../../../components/Admin/AdminFormLayout';
import CoverImageFields from '../../../components/Admin/CoverImageFields';
import { CONTENT_STATUS, STATUS_LABELS } from '../../../constants/status';
import { toDatetimeLocal } from '../../../utils/dateUtils';
import { Helmet } from 'react-helmet-async';

function EventoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const editorRef = useRef(null);

  const [formData, setFormData] = useState({
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
    status: CONTENT_STATUS.DRAFT
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});



  useEffect(() => {
    if (isEditing) {
      const fetchEvento = async () => {
        try {
          const data = await eventosService.buscarPorId(id);
          setFormData({
            title: data.title || '',
            description: data.description || null,
            location: data.location || '',
            startsAt: toDatetimeLocal(data.startsAt),
            endsAt: toDatetimeLocal(data.endsAt),
            capacity: data.capacity || '',
            coverImage: data.coverImage || '',
            coverImageCaption: data.coverImageCaption || '',
            showCoverImage: data.showCoverImage !== false,
            destaque: !!data.destaque,
            status: data.status || CONTENT_STATUS.DRAFT
          });
        } catch (err) {
          console.error(err);
          setError('Erro ao carregar dados do evento.');
        } finally {
          setFetching(false);
        }
      };
      fetchEvento();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let finalDescription = formData.description;
    if (editorRef.current) {
      const editorData = await editorRef.current.save();
      if (editorData) {
        finalDescription = editorData;
      }
    }

    const errors = {};
    if (!formData.title?.trim()) errors.title = 'O título é obrigatório.';
    if (!finalDescription) errors.description = 'A descrição é obrigatória.';

    let parsedStartsAt = '';
    if (!formData.startsAt) {
      errors.startsAt = 'A data de início é obrigatória.';
    } else {
      const d = new Date(formData.startsAt);
      if (isNaN(d.getTime())) {
        errors.startsAt = 'Data de início inválida. Verifique o formato.';
      } else {
        parsedStartsAt = d.toISOString();
      }
    }

    let parsedEndsAt = undefined;
    if (formData.endsAt) {
      const d = new Date(formData.endsAt);
      if (isNaN(d.getTime())) {
        errors.endsAt = 'Data de término inválida. Verifique o formato.';
      } else {
        parsedEndsAt = d.toISOString();
        if (parsedStartsAt && new Date(parsedStartsAt) >= d) {
          errors.endsAt = 'A data de término deve ser posterior à data de início.';
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Foram encontrados erros nos campos do formulário. Corrija-os e tente novamente.');
      setLoading(false);
      return;
    }

    // Limpeza rigorosa: Opcionais vazios viram 'undefined', obrigatórios repassam o erro
    const dataToSubmit = {
      ...formData,
      description: finalDescription,
      startsAt: parsedStartsAt,
      endsAt: parsedEndsAt,
      capacity: formData.capacity === '' ? null : Number(formData.capacity),
      coverImage: formData.coverImage === '' ? null : formData.coverImage,
      coverImageCaption: formData.coverImageCaption === '' ? null : formData.coverImageCaption,
      showCoverImage: formData.showCoverImage,
      location: formData.location === '' ? null : formData.location,
    };

    try {
      if (isEditing) {
        await eventosService.atualizar(id, dataToSubmit);
      } else {
        await eventosService.criar(dataToSubmit);
      }
      navigate('/admin/eventos');
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar evento. Verifique os dados e tente novamente.');
      setLoading(false);
    }
  };

  return (
    <AdminFormLayout
      title="Evento"
      backPath="/admin/eventos"
      isEditing={isEditing}
      fetching={fetching}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
    >
      <div className="form-group">
        <label>Título *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        {fieldErrors.title && <span style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{fieldErrors.title}</span>}
      </div>

      <div className="form-group">
        <label>Descrição *</label>
        <RichEditor
          ref={editorRef}
          value={formData.description}
          uploadFolder="eventos"
        />
        {fieldErrors.description && <span style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{fieldErrors.description}</span>}
      </div>

      <div className="form-group">
        <label>Localização</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Data e Hora de Início *</label>
        <input
          type="datetime-local"
          name="startsAt"
          value={formData.startsAt}
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
          value={formData.endsAt}
          onChange={handleChange}
        />
        {fieldErrors.endsAt && <span style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{fieldErrors.endsAt}</span>}
      </div>

      <div className="form-group">
        <label>Capacidade (nº de vagas)</label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
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
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value={CONTENT_STATUS.DRAFT}>{STATUS_LABELS[CONTENT_STATUS.DRAFT]}</option>
          <option value={CONTENT_STATUS.PUBLISHED}>{STATUS_LABELS[CONTENT_STATUS.PUBLISHED]}</option>
          <option value={CONTENT_STATUS.CANCELLED}>{STATUS_LABELS[CONTENT_STATUS.CANCELLED]}</option>
          <option value={CONTENT_STATUS.FINISHED}>{STATUS_LABELS[CONTENT_STATUS.FINISHED]}</option>
        </select>
      </div>

      <div className="form-group form-group-checkbox">
        <input
          type="checkbox"
          name="destaque"
          id="destaque"
          checked={formData.destaque}
          onChange={handleChange}
        />
        <label htmlFor="destaque">Destacar este evento na página inicial?</label>
      </div>
    </AdminFormLayout>
  );
}

export default EventoForm;