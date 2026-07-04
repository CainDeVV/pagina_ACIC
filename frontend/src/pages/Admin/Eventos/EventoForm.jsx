import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventosService } from '../../../services/eventosService';
import RichEditor from '../../../components/RichEditor';
import AdminFormLayout from '../../../components/Admin/AdminFormLayout';

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
    destaque: false,
    status: 'DRAFT'
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState(null);

  // Tratamento limpo de fuso horário para exibição no input datetime-local
  const toDatetimeLocal = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

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
            destaque: !!data.destaque,
            status: data.status || 'DRAFT'
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

    // Limpeza rigorosa: Opcionais vazios viram 'undefined', obrigatórios repassam o erro
    const dataToSubmit = {
      ...formData,
      description: finalDescription,
      startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : '',
      endsAt: formData.endsAt ? new Date(formData.endsAt).toISOString() : undefined,
      capacity: formData.capacity === '' ? undefined : Number(formData.capacity),
      coverImage: formData.coverImage === '' ? undefined : formData.coverImage,
      location: formData.location === '' ? undefined : formData.location,
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
      </div>

      <div className="form-group">
        <label>Descrição *</label>
        <RichEditor
          ref={editorRef}
          value={formData.description}
        />
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
      </div>

      <div className="form-group">
        <label>Data e Hora de Término</label>
        <input
          type="datetime-local"
          name="endsAt"
          value={formData.endsAt}
          onChange={handleChange}
        />
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

      <div className="form-group">
        <label>URL da Imagem de Capa</label>
        <input
          type="text"
          name="coverImage"
          value={formData.coverImage}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Status *</label>
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="DRAFT">Rascunho (DRAFT)</option>
          <option value="PUBLISHED">Publicado (PUBLISHED)</option>
          <option value="CANCELLED">Cancelado (CANCELLED)</option>
          <option value="FINISHED">Finalizado (FINISHED)</option>
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