import { createUploader, createInput } from './uploadHelper';

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
    
    const textInput = createInput('Ex: 📄 Baixar Apresentação CACB', this.data.text);

    // URL do botão
    const urlLabel = document.createElement('label');
    urlLabel.textContent = 'Link do PDF (cole a URL ou envie o arquivo):';
    urlLabel.style.fontSize = '13px';
    urlLabel.style.color = '#475569';
    
    const urlContainer = document.createElement('div');
    urlContainer.style.display = 'flex';
    urlContainer.style.gap = '10px';

    const urlInput = createInput('https://...', this.data.url);
    urlInput.style.flex = '1';

    // Botão de Upload
    const uploaderContainer = createUploader({
      buttonText: '📤 Enviar Computador',
      accept: 'application/pdf',
      multiple: false,
      onUploadSuccess: ({ url }) => {
        urlInput.value = url;
      }
    });

    urlContainer.appendChild(urlInput);
    urlContainer.appendChild(uploaderContainer);

    this.wrapper.appendChild(title);
    this.wrapper.appendChild(textLabel);
    this.wrapper.appendChild(textInput);
    this.wrapper.appendChild(urlLabel);
    this.wrapper.appendChild(urlContainer);

    this.textInput = textInput;
    this.urlInput = urlInput;

    return this.wrapper;
  }

  save() {
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
