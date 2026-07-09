import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, FileDown } from 'lucide-react';
import { parseCaption } from '@/utils/captionUtils';
import DOMPurify from 'dompurify';
import './BlockRenderer.css';

// Proteção contra Reverse Tabnabbing
DOMPurify.addHook('afterSanitizeAttributes', function(node) {
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer');
  }

  // Proteção contra Clickjacking via CSS (impede position: fixed/absolute cobrindo a tela)
  if (node.hasAttribute('style')) {
    let style = node.getAttribute('style');
    if (style) {
      style = style.replace(/position\s*:\s*(fixed|absolute)/gi, 'position: static');
      style = style.replace(/z-index\s*:\s*[0-9]+/gi, 'z-index: auto');
      node.setAttribute('style', style);
    }
  }
});

const sanitizeConfig = {
  ADD_TAGS: ['mark', 'font', 'u'],
  ADD_ATTR: ['style', 'class', 'color', 'target']
};

// Firewall para URLs cruas (evita injeção de javascript:alert(1) no href/src)
const sanitizeUrl = (url) => {
  if (!url) return '';
  try {
    const parsed = new URL(url, window.location.origin);
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
      return parsed.href;
    }
    return 'about:blank';
  } catch (e) {
    if (url.startsWith('/')) return url;
    return 'about:blank';
  }
};

// Firewall de Domínios Confiáveis para Vídeos e Embeds (Evita injeção de páginas de Phishing)
const isAllowedEmbedDomain = (url) => {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    const allowed = ['youtube.com', 'youtu.be', 'vimeo.com', 'twitter.com', 'instagram.com', 'facebook.com', 'codepen.io'];
    return allowed.some(domain => hostname === domain || hostname.endsWith(`.${domain}`));
  } catch (e) {
    return false;
  }
};

const GalleryViewer = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (!images || images.length === 0) return null;

  const nextImage = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      <div className="institutional-gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
        {images.map((img, i) => (
          <figure key={i} style={{ margin: 0, cursor: 'pointer', position: 'relative', overflow: 'hidden', borderRadius: '8px' }} onClick={() => setSelectedIndex(i)} className="gallery-thumbnail">
            <img 
              src={sanitizeUrl(img.url)} 
              alt={img.alt || 'Imagem da galeria'} 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
              loading="lazy"
            />
            <div className="gallery-overlay">
              <ZoomIn color="white" size={32} />
            </div>
          </figure>
        ))}
      </div>

      {selectedIndex !== null && (
        <div 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setSelectedIndex(null)}
        >
          <button style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', zIndex: 10000 }} onClick={() => setSelectedIndex(null)}>
            <X size={36} />
          </button>
          
          {images.length > 1 && (
            <button className="gallery-lightbox-btn" style={{ left: '24px' }} onClick={prevImage}>
              <ChevronLeft size={36} />
            </button>
          )}

          <img 
            src={sanitizeUrl(images[selectedIndex].url)} 
            alt={images[selectedIndex].alt} 
            style={{ maxWidth: '85vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px' }} 
            onClick={(e) => e.stopPropagation()} 
            loading="lazy"
          />

          {images.length > 1 && (
            <button className="gallery-lightbox-btn" style={{ right: '24px' }} onClick={nextImage}>
              <ChevronRight size={36} />
            </button>
          )}
        </div>
      )}
    </>
  );
};

function BlockRenderer({ blocks }) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <div className="rich-text-content">
      {blocks.map((block, index) => {
        const { type, data } = block;
        if (!data && type !== 'delimiter') return null;

        let blockContent = null;

        switch (type) {
          case 'header': {
            const Tag = `h${data.level || 2}`;
            blockContent = <Tag dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.text, sanitizeConfig) }} />;
            break;
          }

          case 'paragraph':
            blockContent = <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.text, sanitizeConfig) }} />;
            break;

          case 'list': {
            if (data.style === 'checklist') {
              blockContent = (
                <div className="institutional-checklist">
                  {data.items?.map((item, i) => {
                    const isChecked = item.meta?.checked === true || item.checked === true;
                    const content = typeof item === 'string' ? item : (item.content || item.text || '');
                    return (
                      <div key={i} className="checklist-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                        <input type="checkbox" checked={isChecked} readOnly className="checklist-checkbox" style={{ marginTop: '4px', accentColor: 'var(--color-primary, #0266b0)', width: '18px', height: '18px' }} />
                        <span className="checklist-text" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content, sanitizeConfig) }} />
                      </div>
                    );
                  })}
                </div>
              );
            } else {
              const ListTag = data.style === 'ordered' ? 'ol' : 'ul';
              const renderListItems = (items) => {
                if (!items || !Array.isArray(items)) return null;
                return items.map((item, i) => {
                  if (typeof item === 'string') {
                    return <li key={i} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item, sanitizeConfig) }} />;
                  }
                  return (
                    <li key={i}>
                      <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content || item.text, sanitizeConfig) }} />
                      {item.items && item.items.length > 0 && (
                        <ListTag style={{ marginTop: '8px' }}>
                          {renderListItems(item.items)}
                        </ListTag>
                      )}
                    </li>
                  );
                });
              };
              blockContent = (
                <ListTag>
                  {renderListItems(data.items)}
                </ListTag>
              );
            }
            break;
          }

          case 'checklist': {
            blockContent = (
              <div className="institutional-checklist">
                {data.items?.map((item, i) => {
                  const isChecked = item.checked === true || item.meta?.checked === true;
                  const content = item.text || item.content || '';
                  return (
                    <div key={i} className="checklist-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                      <input type="checkbox" checked={isChecked} readOnly className="checklist-checkbox" style={{ marginTop: '4px', accentColor: 'var(--color-primary, #0266b0)', width: '18px', height: '18px' }} />
                      <span className="checklist-text" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content, sanitizeConfig) }} />
                    </div>
                  );
                })}
              </div>
            );
            break;
          }

          case 'image': {
            const { cleanAlt, showCaption, cleanCaption } = parseCaption(data.caption, 'Imagem do conteúdo');
            blockContent = (
              <figure className="institutional-figure">
                <img 
                  src={sanitizeUrl(data.file?.url)} 
                  alt={cleanAlt} 
                  style={{ maxWidth: '100%', borderRadius: '8px' }} 
                  loading="lazy"
                />
                {(showCaption && cleanCaption) && (
                  <figcaption 
                    className="institutional-caption" 
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cleanCaption, sanitizeConfig) }} 
                  />
                )}
              </figure>
            );
            break;
          }

          case 'table':
            blockContent = (
              <div className="institutional-table-container">
                <table className="institutional-table">
                  <tbody>
                    {data.content?.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => {
                          const Tag = (data.withHeadings && rowIndex === 0) ? 'th' : 'td';
                          return (
                            <Tag 
                              key={cellIndex} 
                              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cell, sanitizeConfig) }} 
                            />
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
            break;

          case 'quote':
            blockContent = (
              <blockquote className="institutional-quote">
                <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.text, sanitizeConfig) }} />
                {data.caption && (
                  <cite dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.caption, sanitizeConfig) }} />
                )}
              </blockquote>
            );
            break;

          case 'delimiter':
            blockContent = <hr className="institutional-divider" />;
            break;

          case 'warning':
            blockContent = (
              <div className="institutional-warning">
                <div className="warning-icon">⚠️</div>
                <div className="warning-content">
                  {data.title && <h4 dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.title, sanitizeConfig) }} />}
                  <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.message, sanitizeConfig) }} />
                </div>
              </div>
            );
            break;

          case 'embed': {
            const embedUrl = sanitizeUrl(data.embed);
            if (!isAllowedEmbedDomain(embedUrl)) {
              console.warn('Embed bloqueado por segurança: domínio não autorizado.', embedUrl);
              return null;
            }
            
            blockContent = (
              <div className="institutional-embed">
                <iframe 
                  src={embedUrl}
                  width="100%"
                  height="450"
                  frameBorder="0"
                  allowFullScreen
                  title={data.service}
                />
                {data.caption && (
                  <div className="embed-caption" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.caption, sanitizeConfig) }} />
                )}
              </div>
            );
            break;
          }

          case 'pdfLink':
            blockContent = (
              <a href={sanitizeUrl(data.url)} target="_blank" rel="noopener noreferrer" className={data.className || 'institutional-pdf-link'}>
                {data.text}
              </a>
            );
            break;

          case 'pdfEmbed':
            blockContent = (
              <iframe 
                src={sanitizeUrl(data.url)} 
                width="100%" 
                height="800px" 
                style={{ border: '1px solid var(--color-gray-border)', borderRadius: '8px', margin: '24px 0' }} 
                title="Visualizador de PDF" 
              />
            );
            break;

          case 'imageTextHighlight':
            blockContent = (
              <div className="image-text-highlight">
                <div className="ith-image-container">
                  <img src={sanitizeUrl(data.imageUrl)} alt={data.title} loading="lazy" />
                </div>
                <div className="ith-text-container">
                  <h3>{data.title}</h3>
                  <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.text, sanitizeConfig) }} />
                </div>
              </div>
            );
            break;

          case 'gallery':
            blockContent = <GalleryViewer images={data.images} />;
            break;

          case 'attaches':
            blockContent = (
              <a 
                href={sanitizeUrl(data.file?.url)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="institutional-attach-link"
              >
                <div className="attach-icon">
                  <FileDown size={28} />
                </div>
                <div className="attach-content">
                  <div className="attach-title">
                    {data.title || data.file?.name || 'Baixar Anexo'}
                  </div>
                  {(data.file?.size || data.file?.extension) && (
                    <div className="attach-meta">
                      {data.file?.extension?.toUpperCase()} {data.file?.size ? `• ${(data.file.size / 1024).toFixed(2)} KB` : ''}
                    </div>
                  )}
                </div>
              </a>
            );
            break;

          default:
            console.warn(`Tipo de bloco desconhecido ignorado: ${type}`);
            return null;
        }

        if (!blockContent) return null;

        const align = block.tunes?.alignment?.alignment || 'left';
        
        return (
          <div key={index} style={{ textAlign: align, width: '100%' }}>
            {blockContent}
          </div>
        );
      })}
    </div>
  );
}

export default BlockRenderer;