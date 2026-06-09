/**
 * Componente BlockRenderer
 * * Este componente recebe um array de objetos (blocks) e converte cada objeto
 * na sua respectiva tag HTML. Ele funciona como um "tradutor" entre o formato
 * JSON salvo no banco de dados/mock e o visual final na tela.
 */
function BlockRenderer({ blocks }) {
  // Trava de segurança: se a página não tiver blocos ou a variável vier vazia,
  // não renderiza nada (evita que o React quebre mostrando erro de "map of undefined").
  if (!blocks || blocks.length === 0) return null;

  return (
    // O Fragmento vazio <> </> é usado para retornar múltiplos elementos 
    // sem precisar criar uma <div> desnecessária em volta de tudo.
    <>
      {blocks.map((block, index) => {
        
        // O switch analisa a propriedade 'type' de cada bloco para decidir o que desenhar
        switch (block.type) {
          
          case 'heading':
            // Cria a tag de título dinamicamente. Se o mock não informar o 'level',
            // ele assume que é um <h2> por padrão. Ex: Tag = 'h1', 'h2', etc.
            const Tag = `h${block.level || 2}`;
            return (
              // A prop 'key' é obrigatória no React quando fazemos um map.
              <Tag key={index} className={block.className} id={block.id}>
                {block.content}
              </Tag>
            );

          case 'paragraph':
            return (
              <p 
                key={index} 
                style={block.style} 
                // O dangerouslySetInnerHTML diz ao React: "Confie em mim, tem HTML dentro desse texto".
                // Isso é necessário para que tags como <strong> ou <a> enviadas no texto 
                // do mock funcionem de verdade, em vez de serem impressas como texto puro na tela.
                dangerouslySetInnerHTML={{ __html: block.content }} 
              />
            );

          case 'section':
            return (
              <section key={index}>
                {/* RECURSIVIDADE: Se a seção tiver blocos dentro dela, 
                    o componente chama a si mesmo para desenhar os "filhos". */}
                <BlockRenderer blocks={block.blocks} />
              </section>
            );

          case 'image':
            return (
              // Renderiza uma imagem simples isolada
              <img 
                key={index} 
                src={block.url} 
                alt={block.alt} 
                className={block.className} 
              />
            );

          case 'figure':
            return (
              // Renderiza uma imagem com uma estrutura semântica avançada (<figure>),
              // permitindo acoplar uma legenda (<figcaption>) logo abaixo dela.
              <figure key={index} className="institutional-figure">
                <img src={block.url} alt={block.alt} />
                {/* Se existir uma legenda no mock, renderiza o figcaption. Se não, ignora. */}
                {block.caption && (
                  <figcaption className="institutional-caption">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case 'gallery':
            return (
              // Renderiza uma "caixa" (div) contendo várias imagens dentro.
              <div key={index} className={block.className}>
                {/* Faz um sub-map para percorrer o array de imagens exclusivo desta galeria */}
                {block.images.map((img, i) => (
                  <img key={i} src={img.url} alt={img.alt} />
                ))}
              </div>
            );

          case 'pdfLink':
            return (
              // Cria um link especial configurado para abrir documentos (como PDFs)
              <a 
                key={index} 
                href={block.url} 
                target="_blank" // Abre em uma nova aba para o usuário não sair do seu site
                rel="noopener noreferrer" // Trava de segurança essencial quando usamos target="_blank"
                className={block.className}
              >
                {block.text}
              </a>
            );

          case 'pdfEmbed':
            // Renderiza um visualizador de PDF (iframe) diretamente na página
            return (
              <iframe
                key={index}
                src={block.url}
                width="100%"
                height="800px" // Altura generosa para leitura do documento
                style={{ border: '1px solid #ddd', borderRadius: '8px', marginTop: '24px' }}
                title="Visualizador de PDF do Estatuto"
              />
            );
          
          case 'imageTextHighlight':
            return (
              <div key={index} className="image-text-highlight">
                <div className="ith-image-container">
                  <img src={block.imageUrl} alt={block.title} />
                </div>
                <div className="ith-text-container">
                  <h3>{block.title}</h3>
                  <p>{block.text}</p>
                </div>
              </div>
            );

          default:
            // Se alguém tentar enviar um tipo de bloco que não existe (ex: type: 'video'),
            // o componente não quebra. Ele apenas avisa no console do navegador e pula o bloco.
            console.warn(`Unknown block type: ${block.type}`);
            return null;
        }
      })}
    </>
  );
}

export default BlockRenderer;