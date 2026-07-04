import React, { useState, useRef } from 'react';

function ImageUploader({ folder = 'geral', currentUrl, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('acic_access_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${apiUrl}/api/upload?folder=${folder}`, {
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
          <img src={currentUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={uploading}
          ref={fileInputRef}
          style={{ display: 'none' }}
          id={`upload-${folder}-${Math.random()}`}
        />
        <label 
          htmlFor={fileInputRef.current ? fileInputRef.current.id : undefined} 
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{ 
            padding: '8px 16px', 
            fontSize: '0.9rem', 
            cursor: uploading ? 'not-allowed' : 'pointer', 
            display: 'inline-block', 
            backgroundColor: uploading ? '#ccc' : 'var(--color-primary)',
            color: 'white',
            borderRadius: '4px',
            fontWeight: 'bold',
            transition: 'background 0.3s'
          }}
        >
          {uploading ? 'Enviando imagem...' : '📸 Enviar Foto do Computador'}
        </label>
      </div>
      {error && <span style={{ color: 'red', fontSize: '0.9rem' }}>{error}</span>}
    </div>
  );
}

export default ImageUploader;
