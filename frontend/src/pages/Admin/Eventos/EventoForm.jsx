import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { eventosService } from '../../../services/eventosService';
import RichEditor from '../../../components/RichEditor';
import './EventoForm.css';

function EventoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
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

  // Converte string ISO para YYYY-MM-DDTHH:mm para o input datetime-local
  const toDatetimeLocal = (iso) => (iso ? iso.slice(0, 16) : '');

  useEffect(() => {
    if (isEditing) {
      const fetchEvento = async () => {
        try {
          const data = await eventosService.buscarPorId(id);
          setFormData({
            title: data.title || '',
            description: data.description || '',
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

    const dataToSubmit = {
      ...formData,
      endsAt: formData.endsAt === '' ? null : formData.endsAt,
      capacity: formData.capacity === '' ? null : Number(formData.capacity)
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
      setError('Erro ao salvar evento.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-page-container">
      <Link to="/admin/eventos" className="back-link">← Voltar</Link>
      
      <div className="admin-form-content">
        <h1>{isEditing ? 'Editar Evento' : 'Novo Evento'}</h1>
        
        {fetching ? (
          <p>Carregando...</p>
        ) : (
          <form onSubmit={handleSubmit} className="crud-form">
            {error && <p className="error-msg">{error}</p>}
            
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
                value={formData.description}
                onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
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

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate('/admin/eventos')}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default EventoForm;
