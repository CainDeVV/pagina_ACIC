import ImageUploader from './ImageUploader';

/**
 * Componente que encapsula o grande bloco repetitivo de Imagem de Capa dos forms admin.
 * @param {Object} props
 * @param {string} props.folder - Nome da pasta no backend ('noticias' ou 'eventos')
 * @param {Object} props.formData - Objeto state com os valores do formulário
 * @param {Function} props.handleChange - Função onChange padrão
 * @param {Function} props.setFormData - Função setState para atualizar o objeto diretamente
 * @param {string} [props.checkboxLabel] - Label opcional (se não passar, usa padrão genérico)
 */
function CoverImageFields({ folder, formData, handleChange, setFormData, checkboxLabel }) {
  return (
    <>
      <div className="form-group">
        <label>Imagem de Capa</label>
        <ImageUploader 
          folder={folder} 
          currentUrl={formData.coverImage} 
          onUploadSuccess={(url) => setFormData(prev => ({ ...prev, coverImage: url }))} 
        />
        <input 
          type="text" 
          name="coverImage" 
          value={formData.coverImage} 
          onChange={handleChange} 
          placeholder="Ou cole uma URL direta da imagem aqui..."
          style={{ marginTop: '10px' }}
        />
      </div>

      <div className="form-group">
        <label>Legenda da Imagem de Capa</label>
        <input 
          type="text" 
          name="coverImageCaption" 
          value={formData.coverImageCaption} 
          onChange={handleChange} 
          placeholder="Ex: Foto: Autor / Agência" 
        />
      </div>

      <div className="form-group form-group-checkbox">
        <input 
          type="checkbox" 
          name="showCoverImage" 
          id={`showCoverImage_${folder}`} 
          checked={formData.showCoverImage} 
          onChange={handleChange} 
        />
        <label htmlFor={`showCoverImage_${folder}`}>
          {checkboxLabel || 'Exibir a imagem de capa dentro da página detalhada?'}
        </label>
      </div>
    </>
  );
}

export default CoverImageFields;
