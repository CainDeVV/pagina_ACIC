import { CONTENT_STATUS } from '../constants/status';

/**
 * Utilitários exclusivos para as regras de negócio de Eventos.
 */

export function getEventBadge(event) {
  if (!event) return '';
  
  if (event.status === CONTENT_STATUS.CANCELLED) return 'Cancelado';
  if (event.status === CONTENT_STATUS.FINISHED) return 'Realizado';
  
  const isPast = new Date(event.startsAt) <= new Date();
  if (isPast) return 'Realizado';

  return 'Em Breve';
}

export function getEventBadgeClass(event) {
  if (!event) return '';

  if (event.status === CONTENT_STATUS.CANCELLED) return 'badge-cancelled';
  if (event.status === CONTENT_STATUS.FINISHED) return 'badge-finished';
  
  const isPast = new Date(event.startsAt) <= new Date();
  if (isPast) return 'badge-finished';

  return 'badge-upcoming';
}

export function isEventUpcoming(event) {
  const isCancelledOrFinished = event.status === CONTENT_STATUS.CANCELLED || event.status === CONTENT_STATUS.FINISHED;
  const isFuture = new Date(event.startsAt) > new Date();
  
  return !isCancelledOrFinished && isFuture;
}
