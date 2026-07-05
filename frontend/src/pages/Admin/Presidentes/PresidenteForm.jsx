import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { institucionalService } from '../../../services/institucionalService';
import AdminFormLayout from '../../../components/Admin/AdminFormLayout';
import ImageUploader from '../../../components/Admin/ImageUploader';
import { Helmet } from 'react-helmet-async';

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
    sortOrder: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchPresidente = async () => {
        try {
          const data = await institucionalService.buscarPresidentePorId(id);
          setFormData({
            name: data.name || '',
            termStart: data.termStart || '',
            termEnd: data.termEnd || '',
            photoUrl: data.photoUrl || '',
            bio: data.bio || '',
            sortOrder: data.sortOrder ?? ''
          });
        } catch (err) {
          console.error(err);
          setError('Erro ao carregar dados do presidente.');
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
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSubmit = {
      ...formData,
      termEnd: formData.termEnd === '' ? null : Number(formData.termEnd),
      photoUrl: formData.photoUrl === '' ? null : formData.photoUrl,
      bio: formData.bio === '' ? null : formData.bio,
      sortOrder: formData.sortOrder === '' ? undefined : Number(formData.sortOrder)
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
      setError('Erro ao salvar presidente. Verifique os dados e tente novamente.');
      setLoading(false);
    }
  };

  return (
    <AdminFormLayout
      title="Presidente"
      backPath="/admin/presidentes"
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
        <label>Ano de Início (termStart) *</label>
        <input type="number" name="termStart" value={formData.termStart} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Ano de Término (Deixe em branco se for o atual)</label>
        <input type="number" name="termEnd" value={formData.termEnd} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Foto do Presidente</label>
        <ImageUploader 
          folder="presidentes" 
          currentUrl={formData.photoUrl} 
          onUploadSuccess={(url) => setFormData(prev => ({ ...prev, photoUrl: url }))} 
        />
        <input 
          type="text" 
          name="photoUrl" 
          value={formData.photoUrl} 
          onChange={handleChange} 
          placeholder="Ou cole uma URL direta da imagem aqui..."
          style={{ marginTop: '10px' }}
        />
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

export default PresidenteForm;