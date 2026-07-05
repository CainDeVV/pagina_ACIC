import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { servicosService } from '../../../services/servicosService';
import RichEditor from '../../../components/RichEditor';
import AdminFormLayout from '../../../components/Admin/AdminFormLayout';
import ImageUploader from '../../../components/Admin/ImageUploader';
import { CONTENT_STATUS, STATUS_LABELS } from '../../../constants/status';
import { Helmet } from 'react-helmet-async';

function ServicosForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const editorRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: null,
    icon: '',
    imageUrl: '',
    destaque: false,
    status: CONTENT_STATUS.DRAFT
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchServico = async () => {
        try {
          const data = await servicosService.buscarPorId(id);
          setFormData({
            title: data.title || '',
            summary: data.summary || '',
            description: data.description || null,
            icon: data.icon || '',
            imageUrl: data.imageUrl || '',
            destaque: !!data.destaque,
            status: data.status || CONTENT_STATUS.DRAFT
          });
        } catch (err) {
          console.error(err);
          setError('Erro ao carregar dados do serviço.');
        } finally {
          setFetching(false);
        }
      };
      fetchServico();
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

    // Limpeza rigorosa: converte strings vazias em undefined para os opcionais
    const dataToSubmit = {
      ...formData,
      description: finalDescription,
      summary: formData.summary === '' ? null : formData.summary,
      icon: formData.icon === '' ? null : formData.icon,
      imageUrl: formData.imageUrl === '' ? null : formData.imageUrl
    };

    try {
      if (isEditing) {
        await servicosService.atualizar(id, dataToSubmit);
      } else {
        await servicosService.criar(dataToSubmit);
      }
      navigate('/admin/servicos');
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar serviço. Verifique os dados e tente novamente.');
      setLoading(false);
    }
  };

  return (
    <AdminFormLayout
      title="Serviço"
      backPath="/admin/servicos"
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
        <label>Resumo (Summary)</label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Descrição (Conteúdo Principal) *</label>
        <RichEditor
          ref={editorRef}
          value={formData.description}
          uploadFolder="servicos"
        />
      </div>

      <div className="form-group">
        <label>Ícone (Nome ou URL)</label>
        <input
          type="text"
          name="icon"
          value={formData.icon}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Imagem do Serviço</label>
        <ImageUploader 
          folder="servicos" 
          currentUrl={formData.imageUrl} 
          onUploadSuccess={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))} 
        />
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Ou cole uma URL direta da imagem aqui..."
          style={{ marginTop: '10px' }}
        />
      </div>

      <div className="form-group">
        <label>Status *</label>
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value={CONTENT_STATUS.DRAFT}>{STATUS_LABELS[CONTENT_STATUS.DRAFT]}</option>
          <option value={CONTENT_STATUS.PUBLISHED}>{STATUS_LABELS[CONTENT_STATUS.PUBLISHED]}</option>
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
        <label htmlFor="destaque">Destacar este serviço na página inicial?</label>
      </div>
    </AdminFormLayout>
  );
}

export default ServicosForm;