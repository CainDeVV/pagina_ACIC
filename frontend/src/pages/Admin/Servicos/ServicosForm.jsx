import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { servicosService } from '@/services/servicosService';
import RichEditor from '@/components/RichEditor';
import AdminFormLayout from '@/components/Admin/AdminFormLayout';
import ImageUploader from '@/components/Admin/ImageUploader';
import { CONTENT_STATUS, STATUS_LABELS } from '@/constants/status';
import { useAdminForm } from '@/hooks/useAdminForm';

function ServicosForm() {
  const { id } = useParams();
  const editorRef = useRef(null);

  const {
    formData,
    setFormData,
    loading,
    fetching,
    error,
    handleChange,
    handleSubmit
  } = useAdminForm({
    id,
    service: servicosService,
    redirectPath: '/admin/servicos',
    initialData: {
      title: '',
      summary: '',
      description: null,
      icon: '',
      imageUrl: '',
      destaque: false,
      status: CONTENT_STATUS.DRAFT
    }
  });

  const onSave = (e) => {
    handleSubmit(e, null, async (currentData) => {
      let finalDescription = currentData.description;
      if (editorRef.current) {
        const editorData = await editorRef.current.save();
        if (editorData) {
          finalDescription = editorData;
        }
      }

      // Limpeza rigorosa: converte strings vazias em null para os opcionais
      return {
        ...currentData,
        description: finalDescription,
        summary: currentData.summary === '' ? null : currentData.summary,
        icon: currentData.icon === '' ? null : currentData.icon,
        imageUrl: currentData.imageUrl === '' ? null : currentData.imageUrl
      };
    });
  };

  return (
    <AdminFormLayout
      title="Serviço"
      backPath="/admin/servicos"
      isEditing={!!id}
      fetching={fetching}
      loading={loading}
      error={error}
      onSubmit={onSave}
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
          value={formData.summary || ''}
          onChange={handleChange}
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Descrição (Conteúdo Principal) *</label>
        {/* Usamos a chave unida ao fetching para que o editor só renderize após receber os dados */}
        {!fetching && (
          <RichEditor
            ref={editorRef}
            value={formData.description}
            uploadFolder="servicos"
          />
        )}
      </div>

      <div className="form-group">
        <label>Ícone (Nome ou URL)</label>
        <input
          type="text"
          name="icon"
          value={formData.icon || ''}
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
          value={formData.imageUrl || ''}
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