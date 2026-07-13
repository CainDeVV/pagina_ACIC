/**
 * Utilitário para parse de legendas de imagem.
 * Se a legenda vier entre colchetes [Texto], ela não será exibida na tela,
 * servindo apenas como texto alternativo (alt text) para SEO e Acessibilidade.
 *
 * @param {string} rawCaption - A legenda original vinda do banco ou do editor (pode conter HTML)
 * @param {string} fallbackAlt - O texto padrão de Alt caso a legenda esteja vazia
 * @returns {{ cleanAlt: string, showCaption: boolean, cleanCaption: string }}
 */
export function parseCaption(rawCaption, fallbackAlt = 'Imagem') {
  if (!rawCaption) {
    return {
      cleanAlt: fallbackAlt,
      showCaption: false,
      cleanCaption: ''
    };
  }

  // Se vier do EditorJS, pode conter tags HTML, então limpamos para verificação de chaves
  let cleanAlt = rawCaption.replace(/<[^>]*>?/gm, '').trim();
  let showCaption = true;
  let cleanCaption = rawCaption.trim();

  if (cleanAlt.startsWith('[') && cleanAlt.endsWith(']')) {
    cleanAlt = cleanAlt.slice(1, -1).trim();
    showCaption = false;
  }

  return {
    cleanAlt: cleanAlt || fallbackAlt,
    showCaption,
    cleanCaption
  };
}
