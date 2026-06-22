import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { institucionalService } from '../../../services/institucionalService';
import './PresidenteForm.css';

function PresidenteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    termStart: '',
    termEnd: '',
    photoUrl: '',
    bio: '',
    sortOrder: 0
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchPresidente = async () => {
        try {
          // Busca todos e filtra pelo ID, já que não temos endpoint de buscar por ID
          const list = await institucionalService.buscarPresidentes();
          const p = list.find(item => String(item.id) === String(id));
          if (p) {
            setFormData({
              name: p.name || '',
              termStart: p.termStart || '',
              termEnd: p.termEnd || '',
              photoUrl: p.photoUrl || '',
              bio: p.bio || '',
              sortOrder: p.sortOrder || 0
            });
          } else {
            setError('Presidente não encontrado.');
          }
        } catch (err) {
          console.error(err);
          setError('Erro ao buscar dados do presidente.');
        } finally {
          setFetching(false);
        }
      };
      fetchPresidente();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? Number(value) : '') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Trata null para o ano fim quando vazio (mandato atual)
    const dataToSubmit = {
      ...formData,
      termStart: Number(formData.termStart),
      termEnd: formData.termEnd === '' ? null : Number(formData.termEnd)
    };

    try {
      if (isEditing) {
        await institucionalService.atualizarPresidente(id, dataToSubmit);
      } else {
        await institucionalService.criarPresidente(dataToSubmit);
      }
      navigate('/admin/presidentes');
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar presidente.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-page-container">
      <Link to="/admin/presidentes" className="back-link">← Voltar</Link>
      
      <div className="admin-form-content">
        <h1>{isEditing ? 'Editar Presidente' : 'Novo Presidente'}</h1>
        
        {fetching ? (
          <p>Carregando...</p>
        ) : (
          <form onSubmit={handleSubmit} className="crud-form">
            {error && <p className="error-msg">{error}</p>}
            
            <div className="form-group">
              <label>Nome *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Ano de Início do Mandato *</label>
              <input
                type="number"
                name="termStart"
                value={formData.termStart}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Ano de Fim do Mandato (vazio = atual)</label>
              <input
                type="number"
                name="termEnd"
                value={formData.termEnd}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>URL da Foto</label>
              <input
                type="text"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Biografia</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Ordem</label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate('/admin/presidentes')}>
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

export default PresidenteForm;
