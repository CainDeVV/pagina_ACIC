class PdfEmbedTool {
  static get toolbox() {
    return {
      title: 'Embutir PDF',
      icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/></svg>'
    };
  }

  constructor({ data, api }) {
    this.api = api;
    this.data = data || {};
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('pdf-embed-tool');
    this.wrapper.style.padding = '10px';
    this.wrapper.style.border = '1px solid #e2e8f0';
    this.wrapper.style.borderRadius = '8px';
    this.wrapper.style.backgroundColor = '#f8fafc';

    if (this.data && this.data.url) {
      this._createIframe(this.data.url);
      return this.wrapper;
    }

    const input = document.createElement('input');
    input.placeholder = 'Cole a URL do PDF aqui e pressione Enter...';
    input.classList.add('cdx-input');
    input.value = this.data && this.data.url ? this.data.url : '';

    input.addEventListener('paste', (event) => {
      setTimeout(() => {
        if (input.value) {
          this._createIframe(input.value);
        }
      }, 0);
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this._createIframe(input.value);
      }
    });

    this.wrapper.appendChild(input);

    return this.wrapper;
  }

  _createIframe(url) {
    this.data.url = url;
    this.wrapper.innerHTML = '';
    
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.marginBottom = '10px';
    
    const title = document.createElement('span');
    title.textContent = '📄 PDF Embutido';
    title.style.fontWeight = 'bold';
    
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar URL';
    editBtn.style.cursor = 'pointer';
    editBtn.style.padding = '4px 8px';
    editBtn.addEventListener('click', () => {
      this.data.url = '';
      this.wrapper.innerHTML = '';
      
      const input = document.createElement('input');
      input.placeholder = 'Cole a URL do PDF aqui e pressione Enter...';
      input.classList.add('cdx-input');
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          this._createIframe(input.value);
        }
      });
      this.wrapper.appendChild(input);
    });

    header.appendChild(title);
    header.appendChild(editBtn);

    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.width = '100%';
    iframe.height = '400px';
    iframe.style.border = '1px solid #cbd5e1';
    iframe.style.borderRadius = '4px';

    this.wrapper.appendChild(header);
    this.wrapper.appendChild(iframe);
  }

  save(blockContent) {
    return {
      url: this.data.url || ''
    };
  }
  
  validate(savedData) {
    if (!savedData.url || !savedData.url.trim()) {
      return false;
    }
    return true;
  }
}

export default PdfEmbedTool;
