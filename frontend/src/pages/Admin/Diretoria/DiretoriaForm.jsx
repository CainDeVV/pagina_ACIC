import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { institucionalService } from '../../../services/institucionalService';
import './DiretoriaForm.css';

function DiretoriaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    category: '',
    sortOrder: 0,
    bio: '',
    photoUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing && !location.state?.membro);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      if (location.state?.membro) {
        // Usa o estado passado via navegação do React Router (evita requisição)
        const m = location.state.membro;
        setFormData({
          name: m.name || '',
          role: m.role || '',
          category: m.category || '',
          sortOrder: m.sortOrder || 0,
          bio: m.bio || '',
          photoUrl: m.photoUrl || ''
        });
      } else {
        // Caso o usuário tenha atualizado a página (entrou direto pela URL),
        // precisamos buscar da API e achar o membro manualmente.
        const fetchMembro = async () => {
          try {
            const data = await institucionalService.buscarDiretoria();
            let flatMembers = [];
            data.forEach(grupo => {
              if (grupo.members) flatMembers = [...flatMembers, ...grupo.members];
            });
            
            const m = flatMembers.find(item => String(item.id) === String(id));
            if (m) {
              setFormData({
                name: m.name || '',
                role: m.role || '',
                category: m.category || '',
                sortOrder: m.sortOrder || 0,
                bio: m.bio || '',
                photoUrl: m.photoUrl || ''
              });
            } else {
              setError('Membro não encontrado.');
            }
          } catch (err) {
            console.error(err);
            setError('Erro ao buscar membro da diretoria.');
          } finally {
            setFetching(false);
          }
        };
        fetchMembro();
      }
    }
  }, [id, isEditing, location.state]);

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

    const dataToSubmit = {
      ...formData,
      sortOrder: Number(formData.sortOrder)
    };

    try {
      if (isEditing) {
        await institucionalService.atualizarDiretoria(id, dataToSubmit);
      } else {
        await institucionalService.criarDiretoria(dataToSubmit);
      }
      navigate('/admin/diretoria');
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar membro.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-page-container">
      <Link to="/admin/diretoria" className="back-link">← Voltar</Link>
      
      <div className="admin-form-content">
        <h1>{isEditing ? 'Editar Membro da Diretoria' : 'Novo Membro'}</h1>
        
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
              <label>Cargo Específico * (Ex: Presidente, 1º Tesoureiro)</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Categoria * (Ex: Diretoria Executiva, Conselho)</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
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
              <label>Ordem (sortOrder)</label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate('/admin/diretoria')}>
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

export default DiretoriaForm;
