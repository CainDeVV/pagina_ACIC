/**
 * Status padrão para conteúdos da aplicação (Notícias e Eventos).
 */
export const CONTENT_STATUS = {
  PUBLISHED: 'PUBLISHED',
  DRAFT: 'DRAFT',
  FINISHED: 'FINISHED',
  CANCELLED: 'CANCELLED'
};

/**
 * Tradução amigável dos status para exibição em Menus e Formulários.
 */
export const STATUS_LABELS = {
  [CONTENT_STATUS.PUBLISHED]: 'Publicado',
  [CONTENT_STATUS.DRAFT]: 'Rascunho',
  [CONTENT_STATUS.FINISHED]: 'Realizado / Finalizado',
  [CONTENT_STATUS.CANCELLED]: 'Cancelado'
};
