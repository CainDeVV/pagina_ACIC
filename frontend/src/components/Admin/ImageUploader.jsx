import { useState, useRef, useId } from 'react';

function ImageUploader({ folder = 'geral', currentUrl, onUploadSuccess, maxSizeMB = 10 }) {
  const [uploading, setUploading] = useState(false);
  const [optimize, setOptimize] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const uploadId = useId();
  const serverLimitMB = 100;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!optimize && file.size > maxSizeMB * 1024 * 1024) {
      setError(`Sem otimização, o tamanho máximo permitido é ${maxSizeMB}MB.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    } else if (optimize && file.size > serverLimitMB * 1024 * 1024) {
      setError(`O limite absoluto do servidor para envio é de ${serverLimitMB}MB por arquivo.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('acic_access_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${apiUrl}/api/upload?folder=${folder}&optimize=${optimize}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success === 1 && data.file && data.file.url) {
        onUploadSuccess(data.file.url);
      } else {
        setError(data.message || 'Erro ao fazer upload da imagem.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro de conexão ao tentar fazer upload.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // reseta o input
      }
    }
  };

  return (
    <div className="image-uploader-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '10px' }}>
      {currentUrl && (
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--color-primary)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <img loading="lazy" src={currentUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input 
          type="file" 
          accept="image/*,application/pdf" 
          onChange={handleFileChange} 
          disabled={uploading}
          ref={fileInputRef}
          style={{ display: 'none' }}
          id={`upload-${folder}-${uploadId}`}
        />
        <label 
          htmlFor={`upload-${folder}-${uploadId}`}
          style={{ 
            padding: '8px 16px', 
            fontSize: '0.9rem', 
            cursor: uploading ? 'not-allowed' : 'pointer', 
            display: 'inline-block', 
            backgroundColor: uploading ? 'var(--color-gray-border)' : 'var(--color-primary)',
            color: 'white',
            borderRadius: '4px',
            fontWeight: 'bold',
            transition: 'background 0.3s'
          }}
        >
          {uploading ? 'Enviando arquivo...' : '📸 Enviar Arquivo'}
        </label>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-dark)' }}>
          <strong>Formatos aceitos:</strong> JPG, PNG, WEBP, PDF, DOCX, ZIP. <br/>
          <strong>Tamanho máximo permitido:</strong> {optimize ? `${serverLimitMB}MB (Otimizado)` : `${maxSizeMB}MB`}.
        </span>
        <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--color-gray-dark)' }}>
          <input 
            type="checkbox" 
            checked={optimize} 
            onChange={(e) => setOptimize(e.target.checked)} 
            disabled={uploading}
          />
          Otimizar imagem (Reduzir tamanho e converter para WebP)
        </label>
      </div>
      {error && <span style={{ color: 'red', fontSize: '0.9rem', fontWeight: '500' }}>{error}</span>}
    </div>
  );
}

export default ImageUploader;
