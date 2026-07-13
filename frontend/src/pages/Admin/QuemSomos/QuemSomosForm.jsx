import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { institucionalService } from '@/services/institucionalService';
import RichEditor from '@/components/RichEditor';
import AdminFormLayout from '@/components/Admin/AdminFormLayout';
import { CONTENT_STATUS, STATUS_LABELS } from '@/constants/status';
import { useAdminForm } from '@/hooks/useAdminForm';
import { validateStandardFields, cleanEmptyStrings } from '@/utils/formUtils';
import { useState } from 'react';

const quemSomosServiceAdapter = { 
  buscarPorId: institucionalService.buscarPaginaPorIdAdmin, 
  criar: institucionalService.criarPagina, 
  atualizar: institucionalService.atualizarPagina 
};

function QuemSomosForm() {
  const { id } = useParams();
  const editorRef = useRef(null);
  const [fieldErrors, setFieldErrors] = useState({});

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
    fetchItemsFn: institucionalService.buscarTodasPaginasAdmin,
    initialData: {
      key: '',
      title: '',
      content: null,
      status: CONTENT_STATUS.PUBLISHED,
      sortOrder: ''
    }
  });

  const onSave = (e) => {
    setFieldErrors({});
    handleSubmit(e, 
      (currentData) => {
        const errors = validateStandardFields(currentData, ['key']);
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          return 'Foram encontrados erros nos campos do formulário. Corrija-os e tente novamente.';
        }
        return null;
      },
      async (currentData) => {
        let finalContent = currentData.content;
        if (editorRef.current) {
          const editorData = await editorRef.current.save();
          if (editorData) {
            finalContent = editorData;
          }
        }

        if (!finalContent) {
          setFieldErrors(prev => ({ ...prev, content: 'O conteúdo da página é obrigatório.' }));
          throw new Error('Validação falhou');
        }

        const cleanedData = cleanEmptyStrings(currentData);

        return {
          ...cleanedData,
          content: finalContent,
          sortOrder: currentData.sortOrder === '' ? undefined : Number(currentData.sortOrder)
        };
      }
    );
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
        <label>Título *</label>
        <input type="text" name="title" value={formData.title || ''} onChange={handleChange} required />
        {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
      </div>

      <div className="form-group">
        <label>Conteúdo Principal *</label>
        {!fetching && (
          <RichEditor
            ref={editorRef}
            value={formData.content}
            uploadFolder="institucional"
          />
        )}
        {fieldErrors.content && <span className="field-error">{fieldErrors.content}</span>}
      </div>

      <div className="form-group">
        <label>Status *</label>
        <select name="status" value={formData.status || ''} onChange={handleChange} required>
          <option value={CONTENT_STATUS.DRAFT}>{STATUS_LABELS[CONTENT_STATUS.DRAFT]}</option>
          <option value={CONTENT_STATUS.PUBLISHED}>{STATUS_LABELS[CONTENT_STATUS.PUBLISHED]}</option>
        </select>
      </div>

      <div className="form-group">
        <label>Ordem de Exibição</label>
        <input type="number" name="sortOrder" value={formData.sortOrder === undefined ? '' : formData.sortOrder} onChange={handleChange} />
      </div>
    </AdminFormLayout>
  );
}

export default QuemSomosForm;