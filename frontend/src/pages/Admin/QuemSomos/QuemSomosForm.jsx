import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { institucionalService } from '../../../services/institucionalService';
import RichEditor from '../../../components/RichEditor';
import AdminFormLayout from '../../../components/Admin/AdminFormLayout';
import { CONTENT_STATUS, STATUS_LABELS } from '../../../constants/status';
import { Helmet } from 'react-helmet-async';

function QuemSomosForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const editorRef = useRef(null);

  const [formData, setFormData] = useState({
    key: '',
    title: '',
    content: null,
    status: CONTENT_STATUS.PUBLISHED,
    sortOrder: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchPagina = async () => {
        try {
          const data = await institucionalService.buscarPaginaPorId(id);
          setFormData({
            key: data.key || '',
            title: data.title || '',
            content: data.content || null,
            status: data.status || CONTENT_STATUS.PUBLISHED,
            sortOrder: data.sortOrder ?? ''
          });
        } catch (err) {
          console.error(err);
          setError('Erro ao carregar dados da página.');
        } finally {
          setFetching(false);
        }
      };
      fetchPagina();
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

    let finalContent = formData.content;
    if (editorRef.current) {
      const editorData = await editorRef.current.save();
      if (editorData) {
        finalContent = editorData;
      }
    }

    const dataToSubmit = {
      ...formData,
      content: finalContent,
      sortOrder: formData.sortOrder === '' ? undefined : Number(formData.sortOrder)
    };

    try {
      if (isEditing) {
        await institucionalService.atualizarPagina(id, dataToSubmit);
      } else {
        await institucionalService.criarPagina(dataToSubmit);
      }
      navigate('/admin/quemsomos');
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar página institucional. Verifique os dados e tente novamente.');
      setLoading(false);
    }
  };

  return (
    <AdminFormLayout
      title="Página Institucional"
      backPath="/admin/quemsomos"
      isEditing={isEditing}
      fetching={fetching}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
    >
      <div className="form-group">
        <label>Selecione a Página (Chave Única) *</label>
        <select name="key" value={formData.key} onChange={handleChange} required>
          <option value="" disabled>Escolha a página que deseja editar...</option>
          <option value="quem-somos">Quem Somos (Histórico)</option>
          <option value="cmec">CMEC</option>
          <option value="estatuto">Estatuto da CACB</option>
          <option value="diretoria">Diretoria (Introdução)</option>
          <option value="presidentes">Presidentes (Introdução)</option>
          <option value="contatos">Contatos</option>
        </select>
      </div>

      <div className="form-group">
        <label>Título da Página *</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Conteúdo (Editor) *</label>
        <RichEditor
          ref={editorRef}
          value={formData.content}
          uploadFolder="institucional"
        />
      </div>

      <div className="form-group">
        <label>Status *</label>
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value={CONTENT_STATUS.DRAFT}>{STATUS_LABELS[CONTENT_STATUS.DRAFT]}</option>
          <option value={CONTENT_STATUS.PUBLISHED}>{STATUS_LABELS[CONTENT_STATUS.PUBLISHED]}</option>
        </select>
      </div>

      <div className="form-group">
        <label>Ordem de Exibição (sortOrder)</label>
        <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} />
      </div>
    </AdminFormLayout>
  );
}

export default QuemSomosForm;