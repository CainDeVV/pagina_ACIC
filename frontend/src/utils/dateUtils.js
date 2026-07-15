/**
 * Utilitários para formatação padronizada de datas em todo o site.
 * Utiliza o fuso e idioma pt-BR por padrão.
 */

// Formato Longo (Ex: "12 de Outubro de 2026")
export function formatDateLong(dateInput) {
  if (!dateInput) return '';
  return new Date(dateInput).toLocaleDateString('pt-BR', { dateStyle: 'long' });
}

// Formato Compacto (Ex: "12 out 2026") - Usado em Cards
export function formatDateCompact(dateInput) {
  if (!dateInput) return '';
  const dateObj = new Date(dateInput);
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace(/de /g, '').replace('.', '');
}

// Retorna apenas o Dia ("12") e o Mês curto ("out") separados - Usado no EventRow
export function getDayAndMonthShort(dateInput) {
  if (!dateInput) return { day: '', month: '' };
  const dateObj = new Date(dateInput);
  const day = dateObj.toLocaleDateString('pt-BR', { day: '2-digit' });
  const month = dateObj.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  return { day, month };
}

// Formato Completo de Data e Hora (Ex: "12 de Outubro de 2026 às 15:30" ou padrão)
export function formatDateTime(dateInput) {
  if (!dateInput) return '';
  return new Date(dateInput).toLocaleString('pt-BR', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

// Apenas Hora (Ex: "15:30")
export function formatTimeOnly(dateInput) {
  if (!dateInput) return '';
  return new Date(dateInput).toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

// Formato padrão numérico (Ex: "12/10/2026 15:30:00") - Muito usado nas tabelas Admin
export function formatNumericDateTime(dateInput) {
  if (!dateInput) return '—';
  return new Date(dateInput).toLocaleString('pt-BR');
}

// Tratamento limpo de fuso horário para inputs datetime-local de formulários
export function toDatetimeLocal(isoString) {
  if (!isoString) return '';
  if (isoString.length <= 16) return isoString; // já está no formato YYYY-MM-DDThh:mm
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return ''; // Proteção contra Invalid Date
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
