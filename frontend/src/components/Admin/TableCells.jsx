import React from 'react';
import { CONTENT_STATUS, STATUS_LABELS } from '@/constants/status';

export function InlineOrderInput({ row, onUpdate }) {
  const [val, setVal] = React.useState(row.sortOrder || 0);

  // Sincroniza se a ordem mudar por fora (Drag & Drop)
  React.useEffect(() => {
    setVal(row.sortOrder || 0);
  }, [row.sortOrder]);

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
      style={{ 
        width: '64px', 
        padding: '6px 8px', 
        borderRadius: '8px', 
        border: '1px solid var(--color-gray-border, #e9ecef)',
        backgroundColor: 'var(--color-gray-light, #f8f9fa)',
        textAlign: 'center',
        fontWeight: '600',
        color: 'var(--color-gray-dark, #343a40)',
        outline: 'none',
        transition: 'all 0.2s ease',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
      }}
      onFocus={(e) => {
        e.target.style.borderColor = 'var(--color-primary)';
        e.target.style.backgroundColor = 'var(--color-white)';
      }}
      onBlurCapture={(e) => {
        e.target.style.borderColor = 'var(--color-gray-border, #e9ecef)';
        e.target.style.backgroundColor = 'var(--color-gray-light, #f8f9fa)';
      }}
      title="Altere o número e clique fora para salvar"
    />
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case CONTENT_STATUS.PUBLISHED: return 'var(--color-brand-green)';
    case CONTENT_STATUS.DRAFT: return 'var(--color-gray-medium)';
    case CONTENT_STATUS.FINISHED: return '#17a2b8'; // Azul/Teal
    case CONTENT_STATUS.CANCELLED: return '#dc3545'; // Vermelho
    default: return 'var(--color-gray-medium)';
  }
};

export function InlineStatusSelect({ row, onUpdate, options }) {
  const bg = getStatusColor(row.status);
  
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
      style={{
        padding: '6px 14px',
        borderRadius: '16px',
        fontSize: '0.80rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        backgroundColor: bg,
        color: 'white',
        border: '2px solid transparent',
        outline: 'none',
        cursor: 'pointer',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease'
      }}
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
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.4rem',
        color: isFeatured ? '#f39c12' : '#ccc',
        transition: 'color 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0'
      }}
      title={isFeatured ? "Remover destaque" : "Adicionar destaque"}
    >
      {isFeatured ? '★' : '☆'}
    </button>
  );
}

export function InlineCategorySelect({ row, field = 'category', onUpdate }) {
  const [val, setVal] = React.useState(row[field] || '');
  const listId = `categories-${row.id}`;

  React.useEffect(() => {
    setVal(row[field] || '');
  }, [row[field]]);

  const categories = [
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

  return (
    <>
      <input
        list={listId}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={() => {
          const newVal = val.trim().toUpperCase();
          if (newVal && newVal !== row[field]) {
            onUpdate(row, field, newVal);
          } else {
            setVal(row[field] || ''); // Reverte se deixar em branco
          }
        }}
        style={{
          padding: '6px 14px',
          borderRadius: '8px',
          fontSize: '0.85rem',
          backgroundColor: 'var(--color-gray-light, #f8f9fa)',
          color: 'var(--color-gray-dark, #343a40)',
          border: '1px solid var(--color-gray-border, #e9ecef)',
          outline: 'none',
          width: '180px',
          transition: 'all 0.2s ease',
          fontWeight: '500'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--color-primary)';
          e.target.style.backgroundColor = 'var(--color-white)';
        }}
        onBlurCapture={(e) => {
          e.target.style.borderColor = 'var(--color-gray-border, #e9ecef)';
          e.target.style.backgroundColor = 'var(--color-gray-light, #f8f9fa)';
        }}
        title="Selecione ou digite uma nova categoria"
        placeholder="Digite a categoria..."
      />
      <datalist id={listId}>
        {categories.map(c => <option key={c} value={c} />)}
      </datalist>
    </>
  );
}
