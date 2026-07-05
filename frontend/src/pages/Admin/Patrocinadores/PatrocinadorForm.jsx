import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminFormLayout from '../../../components/Admin/AdminFormLayout';
import CoverImageFields from '../../../components/Admin/CoverImageFields';
import { patrocinadoresService } from '../../../services/patrocinadoresService';
import { CONTENT_STATUS } from '../../../constants/status';
import { toast } from 'react-toastify';

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

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchPatrocinador();
    }
  }, [id]);

  const fetchPatrocinador = async () => {
    try {
      const data = await patrocinadoresService.buscarPorId(id);
      setFormData(data);
    } catch (err) {
      toast.error('Erro ao carregar patrocinador');
      navigate('/admin/patrocinadores');
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleImageChange = (url) => {
    setFormData(prev => ({ ...prev, logoUrl: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.logoUrl) {
      toast.error('A logomarca é obrigatória!');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await patrocinadoresService.atualizar(id, formData);
        toast.success('Patrocinador atualizado com sucesso');
      } else {
        await patrocinadoresService.criar(formData);
        toast.success('Patrocinador criado com sucesso');
      }
      navigate('/admin/patrocinadores');
    } catch (err) {
      toast.error('Erro ao salvar patrocinador');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminFormLayout
      title={isEditing ? 'Editar Patrocinador' : 'Novo Patrocinador'}
      onBack={() => navigate('/admin/patrocinadores')}
      onSubmit={handleSubmit}
      saving={saving}
    >
      <div className="admin-form-row">
        <div className="admin-form-group flex-2">
          <label>Nome do Patrocinador *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="admin-form-input"
            placeholder="Ex: Banco do Brasil"
          />
        </div>
        <div className="admin-form-group flex-1">
          <label>Ordem (0 para primeiro)</label>
          <input
            type="number"
            name="sortOrder"
            value={formData.sortOrder}
            onChange={handleChange}
            className="admin-form-input"
          />
        </div>
      </div>

      <div className="admin-form-group">
        <label>Link do Patrocinador (Site / Instagram)</label>
        <input
          type="url"
          name="linkUrl"
          value={formData.linkUrl || ''}
          onChange={handleChange}
          className="admin-form-input"
          placeholder="https://www.site.com.br"
        />
      </div>

      <div className="admin-form-group">
        <label>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="admin-form-input"
        >
          <option value={CONTENT_STATUS.PUBLISHED}>Público</option>
          <option value={CONTENT_STATUS.DRAFT}>Rascunho (Oculto)</option>
        </select>
      </div>

      <CoverImageFields 
        formData={{ coverImage: formData.logoUrl }} 
        onChange={handleImageChange}
        folder="patrocinadores"
        label="Logomarca do Patrocinador *"
        helpText="Recomendado: Fundo transparente (PNG), proporção quadrada ou retangular horizontal."
      />
    </AdminFormLayout>
  );
}

export default PatrocinadorForm;
