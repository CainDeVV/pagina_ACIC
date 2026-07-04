import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { institucionalService } from '../../../services/institucionalService';
import AdminFormLayout from '../../../components/Admin/AdminFormLayout';

function DiretoriaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    category: '',
    photoUrl: '',
    bio: '',
    sortOrder: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchDiretor = async () => {
        try {
          const data = await institucionalService.buscarDiretorPorId(id);
          setFormData({
            name: data.name || '',
            role: data.role || '',
            category: data.category || '',
            photoUrl: data.photoUrl || '',
            bio: data.bio || '',
            sortOrder: data.sortOrder ?? ''
          });
        } catch (err) {
          console.error(err);
          setError('Erro ao carregar dados do diretor.');
        } finally {
          setFetching(false);
        }
      };
      fetchDiretor();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSubmit = {
      ...formData,
      photoUrl: formData.photoUrl === '' ? undefined : formData.photoUrl,
      bio: formData.bio === '' ? undefined : formData.bio,
      sortOrder: formData.sortOrder === '' ? undefined : Number(formData.sortOrder)
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
      setError('Erro ao salvar diretor. Verifique os dados e tente novamente.');
      setLoading(false);
    }
  };

  return (
    <AdminFormLayout
      title="Membro da Diretoria"
      backPath="/admin/diretoria"
      isEditing={isEditing}
      fetching={fetching}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
    >
      <div className="form-group">
        <label>Nome *</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Cargo (ex: Diretor de Inovação) *</label>
        <input type="text" name="role" value={formData.role} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Categoria (ex: DIRETORIA_EXECUTIVA, CONSELHO_FISCAL) *</label>
        <input type="text" name="category" value={formData.category} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>URL da Foto</label>
        <input type="text" name="photoUrl" value={formData.photoUrl} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Biografia (bio)</label>
        <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" />
      </div>

      <div className="form-group">
        <label>Ordem de Exibição (sortOrder)</label>
        <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} />
      </div>
    </AdminFormLayout>
  );
}

export default DiretoriaForm;