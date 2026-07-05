import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminFormLayout from '../../../components/Admin/AdminFormLayout';
import ImageUploader from '../../../components/Admin/ImageUploader';
import { patrocinadoresService } from '../../../services/patrocinadoresService';
import { CONTENT_STATUS, STATUS_LABELS } from '../../../constants/status';

function PatrocinadorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    linkUrl: '',
    status: CONTENT_STATUS.PUBLISHED,
    sortOrder: 0
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchPatrocinador = async () => {
        try {
          const data = await patrocinadoresService.buscarPorId(id);
          setFormData({
            name: data.name || '',
            logoUrl: data.logoUrl || '',
            linkUrl: data.linkUrl || '',
            status: data.status || CONTENT_STATUS.PUBLISHED,
            sortOrder: data.sortOrder ?? 0
          });
        } catch (err) {
          console.error(err);
          setError('Erro ao carregar dados do patrocinador.');
        } finally {
          setFetching(false);
        }
      };
      fetchPatrocinador();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.logoUrl) {
      setError('A logomarca é obrigatória!');
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        await patrocinadoresService.atualizar(id, formData);
      } else {
        await patrocinadoresService.criar(formData);
      }
      navigate('/admin/patrocinadores');
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar patrocinador. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminFormLayout
      title="Patrocinador"
      backPath="/admin/patrocinadores"
      isEditing={isEditing}
      fetching={fetching}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
    >
      <div className="form-group">
        <label>Nome do Patrocinador *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Ex: Banco do Brasil"
        />
      </div>

      <div className="form-group">
        <label>Link do Patrocinador (Site / Instagram)</label>
        <input
          type="url"
          name="linkUrl"
          value={formData.linkUrl || ''}
          onChange={handleChange}
          placeholder="https://www.site.com.br"
        />
      </div>

      <div className="form-group">
        <label>Status *</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value={CONTENT_STATUS.DRAFT}>{STATUS_LABELS[CONTENT_STATUS.DRAFT]}</option>
          <option value={CONTENT_STATUS.PUBLISHED}>{STATUS_LABELS[CONTENT_STATUS.PUBLISHED]}</option>
        </select>
      </div>

      <div className="form-group">
        <label>Ordem (0 para primeiro)</label>
        <input
          type="number"
          name="sortOrder"
          value={formData.sortOrder}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Logomarca do Patrocinador *</label>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>
          Recomendado: Fundo transparente (PNG), proporção quadrada ou retangular horizontal.
        </p>
        <ImageUploader 
          folder="patrocinadores" 
          currentUrl={formData.logoUrl} 
          onUploadSuccess={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))} 
        />
        <input 
          type="text" 
          name="logoUrl" 
          value={formData.logoUrl} 
          onChange={handleChange} 
          placeholder="Ou cole uma URL direta da logomarca aqui..."
          style={{ marginTop: '10px' }}
        />
      </div>
    </AdminFormLayout>
  );
}

export default PatrocinadorForm;
