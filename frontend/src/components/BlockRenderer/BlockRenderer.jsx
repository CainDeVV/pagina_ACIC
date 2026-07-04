function BlockRenderer({ blocks }) {
  // Trava de segurança
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, index) => {
        // No Editor.js, todo o payload (texto, url, nível) fica dentro de 'data'
        const { type, data } = block;

        // Se o bloco não tiver a propriedade data por algum erro de salvamento, ignoramos
        if (!data) return null;

        switch (type) {
          case 'header':
            const Tag = `h${data.level || 2}`;
            return (
              <Tag 
                key={index} 
                dangerouslySetInnerHTML={{ __html: data.text }} 
              />
            );

          case 'paragraph':
            return (
              <p 
                key={index} 
                dangerouslySetInnerHTML={{ __html: data.text }} 
              />
            );

          case 'list':
            // O Editor.js suporta listas ordenadas (ol) e não ordenadas (ul)
            const ListTag = data.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={index} style={{ marginBottom: '24px', paddingLeft: '20px', color: 'var(--color-gray-dark)', lineHeight: '1.6' }}>
                {data.items?.map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ListTag>
            );

          case 'image':
            // Padrão do plugin oficial @editorjs/image
            return (
              <figure key={index} className="institutional-figure">
                <img 
                  src={data.file?.url} 
                  alt={data.caption || 'Imagem do conteúdo'} 
                  style={{ maxWidth: '100%', borderRadius: '8px' }} 
                />
                {data.caption && (
                  <figcaption 
                    className="institutional-caption" 
                    dangerouslySetInnerHTML={{ __html: data.caption }} 
                  />
                )}
              </figure>
            );

          /* * BLOCOS CUSTOMIZADOS
           * Mantidos aqui caso você crie plugins customizados para o Editor.js
           * no futuro. Eles também seguirão a regra de ler de "block.data".
           */
          case 'pdfLink':
            return (
              <a key={index} href={data.url} target="_blank" rel="noopener noreferrer" className={data.className || 'institutional-pdf-link'}>
                {data.text}
              </a>
            );

          case 'pdfEmbed':
            return (
              <iframe 
                key={index} 
                src={data.url} 
                width="100%" 
                height="800px" 
                style={{ border: '1px solid #ddd', borderRadius: '8px', marginTop: '24px' }} 
                title="Visualizador de PDF" 
              />
            );

          case 'imageTextHighlight':
            return (
              <div key={index} className="image-text-highlight">
                <div className="ith-image-container">
                  <img src={data.imageUrl} alt={data.title} />
                </div>
                <div className="ith-text-container">
                  <h3>{data.title}</h3>
                  <p dangerouslySetInnerHTML={{ __html: data.text }} />
                </div>
              </div>
            );

          default:
            console.warn(`Tipo de bloco desconhecido ignorado: ${type}`);
            return null;
        }
      })}
    </>
  );
}

export default BlockRenderer;