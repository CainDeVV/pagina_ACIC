/**
 * Helper utilitário para otimizar os plugins do Editor.js
 * Centraliza a criação de botões de upload e inputs padronizados.
 */

export function createUploader({ 
  buttonText = '📁 Enviar do Computador',
  accept = 'image/*',
  multiple = false,
  folder = 'geral',
  onUploadSuccess // Callback chamado com { url, name } para cada arquivo que der sucesso
}) {
  const container = document.createElement('div');
  container.style.display = 'inline-flex';
  
  const uploadBtn = document.createElement('button');
  uploadBtn.type = 'button';
  uploadBtn.innerHTML = buttonText;
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
  fileInput.accept = accept;
  if (multiple) fileInput.multiple = true;
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

        const response = await fetch(`${apiUrl}/api/upload?folder=${folder}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const result = await response.json();
        if (result.success && result.file && result.file.url) {
          if (onUploadSuccess) onUploadSuccess({ url: result.file.url, name: file.name });
        } else {
          alert(`Erro ao fazer upload do arquivo ${file.name}.`);
        }
      }
    } catch (error) {
      console.error('Erro de upload:', error);
      alert('Falha na conexão de upload.');
    } finally {
      uploadBtn.innerHTML = buttonText;
      uploadBtn.disabled = false;
      fileInput.value = '';
    }
  });

  container.appendChild(uploadBtn);
  container.appendChild(fileInput);

  return container;
}

export function createInput(placeholder, value = '') {
  const input = document.createElement('input');
  input.classList.add('cdx-input');
  input.placeholder = placeholder;
  input.value = value || '';
  return input;
}
