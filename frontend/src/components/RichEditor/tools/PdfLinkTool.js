class PdfLinkTool {
  static get toolbox() {
    return {
      title: 'Link de PDF (Botão)',
      icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 8.5L8 13H7v-2h2.5c.28 0 .5-.22.5-.5v-1c0-.28-.22-.5-.5-.5H7V7h2.5c.83 0 1.5.67 1.5 1.5v3z" fill="currentColor"/></svg>'
    };
  }

  constructor({ data, api, config }) {
    this.api = api;
    this.config = config || {};
    this.data = data || { text: '📄 Abrir Documento', url: '' };
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.style.padding = '15px';
    this.wrapper.style.border = '1px solid #e2e8f0';
    this.wrapper.style.borderRadius = '8px';
    this.wrapper.style.backgroundColor = '#f8fafc';
    this.wrapper.style.display = 'flex';
    this.wrapper.style.flexDirection = 'column';
    this.wrapper.style.gap = '12px';

    const title = document.createElement('div');
    title.innerHTML = '<strong>🔗 Link de PDF (Botão Azul)</strong>';
    title.style.color = '#0f172a';
    title.style.marginBottom = '4px';
    
    // Texto do botão
    const textLabel = document.createElement('label');
    textLabel.textContent = 'Texto que vai aparecer no botão:';
    textLabel.style.fontSize = '13px';
    textLabel.style.color = '#475569';
    
    const textInput = document.createElement('input');
    textInput.classList.add('cdx-input');
    textInput.value = this.data.text || '';
    textInput.placeholder = 'Ex: 📄 Baixar Apresentação CACB';

    // URL do botão
    const urlLabel = document.createElement('label');
    urlLabel.textContent = 'Link do PDF (cole a URL ou envie o arquivo):';
    urlLabel.style.fontSize = '13px';
    urlLabel.style.color = '#475569';
    
    const urlContainer = document.createElement('div');
    urlContainer.style.display = 'flex';
    urlContainer.style.gap = '10px';

    const urlInput = document.createElement('input');
    urlInput.classList.add('cdx-input');
    urlInput.value = this.data.url || '';
    urlInput.placeholder = 'https://...';
    urlInput.style.flex = '1';

    // Botão de Upload
    const uploadBtn = document.createElement('button');
    uploadBtn.type = 'button';
    uploadBtn.innerHTML = '📤 Enviar Computador';
    uploadBtn.style.padding = '8px 12px';
    uploadBtn.style.border = '1px solid #0266b0';
    uploadBtn.style.backgroundColor = 'white';
    uploadBtn.style.color = '#0266b0';
    uploadBtn.style.borderRadius = '4px';
    uploadBtn.style.cursor = 'pointer';
    uploadBtn.style.fontWeight = 'bold';
    uploadBtn.style.whiteSpace = 'nowrap';
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/pdf';
    fileInput.style.display = 'none';

    uploadBtn.addEventListener('click', () => fileInput.click());

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
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        const result = await response.json();
        if (result.success && result.file && result.file.url) {
          urlInput.value = result.file.url;
        } else {
          alert('Erro ao fazer upload.');
        }
      } catch (error) {
        console.error('Erro de upload:', error);
        alert('Falha na conexão de upload.');
      } finally {
        uploadBtn.innerHTML = '📤 Enviar Computador';
        uploadBtn.disabled = false;
        fileInput.value = '';
      }
    });

    urlContainer.appendChild(urlInput);
    urlContainer.appendChild(uploadBtn);
    urlContainer.appendChild(fileInput);

    this.wrapper.appendChild(title);
    this.wrapper.appendChild(textLabel);
    this.wrapper.appendChild(textInput);
    this.wrapper.appendChild(urlLabel);
    this.wrapper.appendChild(urlContainer);

    this.textInput = textInput;
    this.urlInput = urlInput;

    return this.wrapper;
  }

  save(blockContent) {
    return {
      text: this.textInput.value || '📄 Documento PDF',
      url: this.urlInput.value || ''
    };
  }
  
  validate(savedData) {
    if (!savedData.url || !savedData.url.trim()) {
      return false;
    }
    return true;
  }
}

export default PdfLinkTool;
