class GalleryTool {
  static get toolbox() {
    return {
      title: 'Galeria',
      icon: '<svg viewBox="0 0 24 24" width="24" height="24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><polyline points="21 15 16 10 5 21" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
    };
  }

  constructor({ data, api, config }) {
    this.api = api;
    this.config = config || {};
    this.data = data || { images: [] };
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('gallery-tool-wrapper');
    this.wrapper.style.padding = '10px';
    this.wrapper.style.border = '1px dashed #ccc';
    this.wrapper.style.borderRadius = '5px';

    const header = document.createElement('div');
    header.style.marginBottom = '10px';
    header.style.fontWeight = 'bold';
    header.textContent = '🖼️ Galeria de Imagens';
    this.wrapper.appendChild(header);

    this.imagesContainer = document.createElement('div');
    this.imagesContainer.style.display = 'grid';
    this.imagesContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
    this.imagesContainer.style.gap = '10px';
    this.imagesContainer.style.marginBottom = '10px';

    this.wrapper.appendChild(this.imagesContainer);

    // Render existing images
    if (this.data.images && this.data.images.length > 0) {
      this.data.images.forEach(imgData => {
        this._addImageToDOM(imgData.url, imgData.alt);
      });
    }

    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.gap = '10px';
    inputContainer.style.flexWrap = 'wrap';
    inputContainer.style.alignItems = 'center';

    const urlInput = document.createElement('input');
    urlInput.placeholder = 'Ou cole URL da imagem...';
    urlInput.classList.add('cdx-input');
    urlInput.style.flex = '1';
    urlInput.style.minWidth = '200px';
    
    const altInput = document.createElement('input');
    altInput.placeholder = 'Texto Alternativo (opcional)...';
    altInput.classList.add('cdx-input');
    altInput.style.flex = '1';
    altInput.style.minWidth = '200px';

    const addButton = document.createElement('button');
    addButton.textContent = 'Adicionar Link';
    addButton.type = 'button';
    addButton.style.padding = '8px 12px';
    addButton.style.cursor = 'pointer';
    addButton.style.backgroundColor = '#0266b0';
    addButton.style.color = '#fff';
    addButton.style.border = 'none';
    addButton.style.borderRadius = '4px';

    addButton.addEventListener('click', () => {
      if (urlInput.value) {
        if (!this.data.images) this.data.images = [];
        this.data.images.push({ url: urlInput.value, alt: altInput.value });
        this._addImageToDOM(urlInput.value, altInput.value);
        urlInput.value = '';
        altInput.value = '';
      }
    });

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
    fileInput.multiple = true; // Permite várias imagens
    fileInput.style.display = 'none';

    uploadBtn.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', async (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      uploadBtn.innerHTML = '⏳ Enviando...';
      uploadBtn.disabled = true;

      try {
        const token = localStorage.getItem('acic_access_token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch(`${apiUrl}/api/upload?folder=geral`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });

          const result = await response.json();
          if (result.success && result.file && result.file.url) {
            if (!this.data.images) this.data.images = [];
            // Usa o nome original do arquivo como alt
            this.data.images.push({ url: result.file.url, alt: file.name });
            this._addImageToDOM(result.file.url, file.name);
          } else {
            console.error('Erro ao fazer upload da imagem', file.name);
          }
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

    inputContainer.appendChild(uploadBtn);
    inputContainer.appendChild(fileInput);
    inputContainer.appendChild(urlInput);
    inputContainer.appendChild(altInput);
    inputContainer.appendChild(addButton);

    this.wrapper.appendChild(inputContainer);

    return this.wrapper;
  }

  _addImageToDOM(url, alt) {
    const imgWrapper = document.createElement('div');
    imgWrapper.style.position = 'relative';

    const img = document.createElement('img');
    img.src = url;
    img.alt = alt || '';
    img.style.width = '100%';
    img.style.height = '100px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '4px';

    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = 'x';
    removeBtn.style.position = 'absolute';
    removeBtn.style.top = '2px';
    removeBtn.style.right = '2px';
    removeBtn.style.background = 'red';
    removeBtn.style.color = 'white';
    removeBtn.style.border = 'none';
    removeBtn.style.borderRadius = '50%';
    removeBtn.style.cursor = 'pointer';
    removeBtn.style.width = '20px';
    removeBtn.style.height = '20px';
    removeBtn.style.display = 'flex';
    removeBtn.style.alignItems = 'center';
    removeBtn.style.justifyContent = 'center';

    removeBtn.addEventListener('click', () => {
      this.data.images = this.data.images.filter(imgData => imgData.url !== url);
      imgWrapper.remove();
    });

    imgWrapper.appendChild(img);
    imgWrapper.appendChild(removeBtn);
    this.imagesContainer.appendChild(imgWrapper);
  }

  save(blockContent) {
    return {
      images: this.data.images || []
    };
  }

  validate(savedData) {
    if (!savedData.images || savedData.images.length === 0) {
      return false;
    }
    return true;
  }
}

export default GalleryTool;
