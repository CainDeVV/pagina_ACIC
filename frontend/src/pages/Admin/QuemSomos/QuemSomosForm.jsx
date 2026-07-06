import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { institucionalService } from '@/services/institucionalService';
import RichEditor from '@/components/RichEditor';
import AdminFormLayout from '@/components/Admin/AdminFormLayout';
import { CONTENT_STATUS, STATUS_LABELS } from '@/constants/status';
import { useAdminForm } from '@/hooks/useAdminForm';

const quemSomosServiceAdapter = { 
  buscarPorId: institucionalService.buscarPaginaPorIdAdmin, 
  criar: institucionalService.criarPagina, 
  atualizar: institucionalService.atualizarPagina 
};

function QuemSomosForm() {
  const { id } = useParams();
  const editorRef = useRef(null);

  const {
    formData,
    loading,
    fetching,
    error,
    handleChange,
    handleSubmit
  } = useAdminForm({
    id,
    service: quemSomosServiceAdapter,
    redirectPath: '/admin/quemsomos',
    initialData: {
      key: '',
      title: '',
      content: null,
      status: CONTENT_STATUS.PUBLISHED,
      sortOrder: ''
    }
  });

  const onSave = (e) => {
    handleSubmit(e, null, async (currentData) => {
      let finalContent = currentData.content;
      if (editorRef.current) {
        const editorData = await editorRef.current.save();
        if (editorData) {
          finalContent = editorData;
        }
      }

      return {
        ...currentData,
        content: finalContent,
        sortOrder: currentData.sortOrder === '' ? undefined : Number(currentData.sortOrder)
      };
    });
  };

  return (
    <AdminFormLayout
      title="Página Institucional"
      backPath="/admin/quemsomos"
      isEditing={!!id}
      fetching={fetching}
      loading={loading}
      error={error}
      onSubmit={onSave}
    >
      <div className="form-group">
        <label>Selecione a Página (Chave Única) *</label>
        <select name="key" value={formData.key || ''} onChange={handleChange} required>
          <option value="" disabled>Escolha a página que deseja editar...</option>
          <option value="quem-somos">Quem Somos (Histórico)</option>
          <option value="cmec">CMEC</option>
          <option value="estatuto">Estatuto da CACB</option>
          <option value="estrutura-organizacional">Estrutura Organizacional</option>
          <option value="diretoria">Diretoria (Introdução)</option>
          <option value="presidentes">Presidentes (Introdução)</option>
          <option value="contatos">Contatos</option>
        </select>
      </div>

      <div className="form-group">
        <label>Título da Página *</label>
        <input type="text" name="title" value={formData.title || ''} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Conteúdo (Editor) *</label>
        {!fetching && (
          <RichEditor
            ref={editorRef}
            value={formData.content}
            uploadFolder="institucional"
          />
        )}
      </div>

      <div className="form-group">
        <label>Status *</label>
        <select name="status" value={formData.status || ''} onChange={handleChange} required>
          <option value={CONTENT_STATUS.DRAFT}>{STATUS_LABELS[CONTENT_STATUS.DRAFT]}</option>
          <option value={CONTENT_STATUS.PUBLISHED}>{STATUS_LABELS[CONTENT_STATUS.PUBLISHED]}</option>
        </select>
      </div>

      <div className="form-group">
        <label>Ordem de Exibição (sortOrder)</label>
        <input type="number" name="sortOrder" value={formData.sortOrder === undefined ? '' : formData.sortOrder} onChange={handleChange} />
      </div>
    </AdminFormLayout>
  );
}

export default QuemSomosForm;