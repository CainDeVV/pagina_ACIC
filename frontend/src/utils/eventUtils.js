import { CONTENT_STATUS } from '@/constants/status';

/**
 * Utilitários exclusivos para as regras de negócio de Eventos.
 */

export function getEventBadge(event) {
  if (!event) return '';
  
  if (event.status === CONTENT_STATUS.CANCELLED) return 'Cancelado';
  if (event.status === CONTENT_STATUS.FINISHED) return 'Realizado';
  
  const now = new Date();
  const start = new Date(event.startsAt);
  const end = event.endsAt ? new Date(event.endsAt) : null;

  if (now >= start) {
    if (end && now <= end) return 'Acontecendo';
    if (!end && now.toDateString() === start.toDateString()) return 'Acontecendo';
    return 'Realizado';
  }

  return 'Em Breve';
}

export function getEventBadgeClass(event) {
  if (!event) return '';

  if (event.status === CONTENT_STATUS.CANCELLED) return 'badge-cancelled';
  if (event.status === CONTENT_STATUS.FINISHED) return 'badge-finished';
  
  const now = new Date();
  const start = new Date(event.startsAt);
  const end = event.endsAt ? new Date(event.endsAt) : null;

  if (now >= start) {
    if (end && now <= end) return 'badge-happening';
    if (!end && now.toDateString() === start.toDateString()) return 'badge-happening';
    return 'badge-finished';
  }

  return 'badge-upcoming';
}

export function isEventUpcoming(event) {
  const badge = getEventBadge(event);
  return badge === 'Em Breve' || badge === 'Acontecendo';
}
