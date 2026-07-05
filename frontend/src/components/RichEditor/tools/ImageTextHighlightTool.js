import { createUploader, createInput } from './uploadHelper';

class ImageTextHighlightTool {
  static get toolbox() {
    return {
      title: 'Destaque (Imagem + Texto)',
      icon: '<svg viewBox="0 0 24 24" width="24" height="24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" stroke-width="2"/><circle cx="6" cy="12" r="1.5" fill="currentColor"/><line x1="12" y1="10" x2="19" y2="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="14" x2="19" y2="14" stroke="currentColor" stroke-width="2"/></svg>'
    };
  }

  constructor({ data, api, config }) {
    this.api = api;
    this.config = config || {};
    this.data = {
      imageUrl: data.imageUrl || '',
      title: data.title || '',
      text: data.text || ''
    };
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('image-text-tool-wrapper');
    this.wrapper.style.padding = '15px';
    this.wrapper.style.border = '2px solid #0266b0';
    this.wrapper.style.borderRadius = '5px';
    this.wrapper.style.backgroundColor = '#f4f9fd';
    this.wrapper.style.display = 'flex';
    this.wrapper.style.flexDirection = 'column';
    this.wrapper.style.gap = '10px';

    const header = document.createElement('div');
    header.style.fontWeight = 'bold';
    header.style.color = '#0266b0';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.gap = '8px';
    header.innerHTML = '<span>🌟</span> <span>Bloco de Destaque (Imagem Lado a Lado com Texto)</span>';
    this.wrapper.appendChild(header);

    this.urlInput = createInput('URL da Imagem...', this.data.imageUrl);

    const uploadContainer = document.createElement('div');
    uploadContainer.style.display = 'flex';
    uploadContainer.style.gap = '10px';
    uploadContainer.style.alignItems = 'center';

    const uploaderContainer = createUploader({
      multiple: false,
      onUploadSuccess: ({ url }) => {
        this.urlInput.value = url;
      }
    });

    uploadContainer.appendChild(this.urlInput);
    uploadContainer.appendChild(uploaderContainer);
    
    // Para que o input de url ocupe o espaço restante
    this.urlInput.style.flex = '1';

    this.titleInput = createInput('Título do Destaque (ex: Marca conhecida é marca registrada)...', this.data.title);

    this.textInput = document.createElement('textarea');
    this.textInput.placeholder = 'Texto descritivo...';
    this.textInput.value = this.data.text;
    this.textInput.classList.add('cdx-input');
    this.textInput.style.minHeight = '100px';
    this.textInput.style.resize = 'vertical';
    this.textInput.style.fontFamily = 'inherit';

    this.wrapper.appendChild(uploadContainer);
    this.wrapper.appendChild(this.titleInput);
    this.wrapper.appendChild(this.textInput);

    return this.wrapper;
  }

  save(blockContent) {
    return {
      imageUrl: this.urlInput.value,
      title: this.titleInput.value,
      text: this.textInput.value
    };
  }

  validate(savedData) {
    if (!savedData.imageUrl || !savedData.title || !savedData.text) {
      return false;
    }
    return true;
  }
}

export default ImageTextHighlightTool;
