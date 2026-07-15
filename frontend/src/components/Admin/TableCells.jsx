import React from 'react';
import { CONTENT_STATUS, STATUS_LABELS } from '@/constants/status';

export function InlineOrderInput({ row, onUpdate }) {
  const [val, setVal] = React.useState(row.sortOrder || 0);
  const [prevSortOrder, setPrevSortOrder] = React.useState(row.sortOrder || 0);

  if (row.sortOrder !== prevSortOrder) {
    setPrevSortOrder(row.sortOrder || 0);
    setVal(row.sortOrder || 0);
  }

  return (
    <input 
      type="number" 
      value={val} 
      onChange={(e) => setVal(e.target.value)}
      onBlur={() => {
        const num = Number(val);
        if (num !== row.sortOrder) {
          onUpdate(row, 'sortOrder', num);
        }
      }}
      className="admin-order-input"
      title="Altere o número e clique fora para salvar"
    />
  );
}

export function InlineStatusSelect({ row, onUpdate, options }) {
  const statusOptions = options || [
    CONTENT_STATUS.PUBLISHED,
    CONTENT_STATUS.DRAFT,
    CONTENT_STATUS.FINISHED,
    CONTENT_STATUS.CANCELLED
  ];
  
  return (
    <select 
      value={row.status} 
      onChange={(e) => onUpdate(row, 'status', e.target.value)}
      className="admin-status-select"
      data-status={row.status}
      title="Clique para alterar o status instantaneamente"
    >
      {statusOptions.map(status => (
        <option key={status} value={status}>{STATUS_LABELS[status]}</option>
      ))}
    </select>
  );
}

export function InlineFeaturedToggle({ row, field = 'destaque', onUpdate }) {
  const isFeatured = !!row[field];
  return (
    <button
      onClick={() => onUpdate(row, field, !isFeatured)}
      className="admin-featured-toggle"
      data-featured={isFeatured.toString()}
      title={isFeatured ? "Remover destaque" : "Adicionar destaque"}
    >
      {isFeatured ? '★' : '☆'}
    </button>
  );
}

export function InlineBooleanToggle({ row, field = 'active', onUpdate }) {
  const isActive = !!row[field];
  return (
    <button
      onClick={() => onUpdate(row, field, !isActive)}
      className="admin-boolean-toggle"
      data-active={isActive.toString()}
      title={isActive ? "Desativar (bloquear acesso)" : "Ativar acesso"}
    >
      {isActive ? '✓' : '✕'}
    </button>
  );
}

export function InlineCategorySelect({ row, field = 'category', onUpdate }) {
  const presetCategories = [
    "PRESIDENTE",
    "I VICE-PRESIDENTE",
    "II VICE-PRESIDENTE",
    "I SECRETÁRIO",
    "II SECRETÁRIO",
    "I TESOUREIRO",
    "II TESOUREIRO",
    "DIRETOR SOCIAL",
    "RELAÇÕES PÚBLICAS",
    "CONSELHO FISCAL",
    "CONSELHO CONSULTIVO"
  ];

  const currentVal = row[field] || '';
  const optionsToShow = [...presetCategories];
  if (currentVal && !presetCategories.includes(currentVal)) {
    optionsToShow.push(currentVal);
  }

  return (
    <select
      value={currentVal}
      onChange={(e) => {
        const val = e.target.value;
        if (val !== currentVal) {
          onUpdate(row, field, val);
        }
      }}
      className="admin-category-select"
      title="Selecione uma categoria"
    >
      <option value="" disabled>Selecione...</option>
      {optionsToShow.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
  );
}

export function InlineCategoryList({ categorias }) {
  if (!categorias || categorias.length === 0) {
    return <span className="admin-field-hint">Nenhuma</span>;
  }
  return (
    <div className="admin-flex-list">
      {categorias.map(c => (
        <span key={c.id} className="admin-badge">
          <span className="admin-category-bullet" style={{ color: c.color }}>•</span>
          {c.name}
        </span>
      ))}
    </div>
  );
}
