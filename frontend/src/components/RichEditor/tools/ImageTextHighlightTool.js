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

    this.urlInput = document.createElement('input');
    this.urlInput.placeholder = 'URL da Imagem...';
    this.urlInput.value = this.data.imageUrl;
    this.urlInput.classList.add('cdx-input');

    const uploadContainer = document.createElement('div');
    uploadContainer.style.display = 'flex';
    uploadContainer.style.gap = '10px';
    uploadContainer.style.alignItems = 'center';

    const uploadBtn = document.createElement('button');
    uploadBtn.type = 'button';
    uploadBtn.innerHTML = '📁 Enviar do Computador';
    uploadBtn.style.padding = '8px 12px';
    uploadBtn.style.border = '1px solid #0266b0';
    uploadBtn.style.backgroundColor = 'white';
    uploadBtn.style.color = '#0266b0';
    uploadBtn.style.borderRadius = '4px';
    uploadBtn.style.cursor = 'pointer';
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    uploadBtn.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      uploadBtn.innerHTML = '⏳ Enviando...';
      uploadBtn.disabled = true;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const token = localStorage.getItem('acic_access_token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        
        const response = await fetch(`${apiUrl}/api/upload?folder=geral`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const result = await response.json();
        if (result.success && result.file && result.file.url) {
          this.urlInput.value = result.file.url;
        } else {
          alert('Erro ao fazer upload da imagem.');
        }
      } catch (error) {
        console.error('Erro de upload:', error);
        alert('Falha na conexão de upload.');
      } finally {
        uploadBtn.innerHTML = '📁 Enviar do Computador';
        uploadBtn.disabled = false;
        fileInput.value = '';
      }
    });

    uploadContainer.appendChild(this.urlInput);
    uploadContainer.appendChild(uploadBtn);
    uploadContainer.appendChild(fileInput);
    
    // Para que o input de url ocupe o espaço restante
    this.urlInput.style.flex = '1';

    this.titleInput = document.createElement('input');
    this.titleInput.placeholder = 'Título do Destaque (ex: Marca conhecida é marca registrada)...';
    this.titleInput.value = this.data.title;
    this.titleInput.classList.add('cdx-input');

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
