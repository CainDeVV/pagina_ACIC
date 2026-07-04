import React from 'react';
import './AdminTable.css';

/**
 * Componente genérico para padronizar as tabelas do painel administrativo.
 * * @param {Array} columns - Definição das colunas: [{ label: 'Nome', key: 'name', render: (row) => ... }]
 * @param {Array} data - Lista de objetos vindos da API
 * @param {Function} onEdit - Função disparada ao clicar em Editar
 * @param {Function} onDelete - Função disparada ao clicar em Excluir
 */
function AdminTable({ columns, data, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return <p className="admin-table-empty">Nenhum registro cadastrado no momento.</p>;
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.label}</th>
            ))}
            {(onEdit || onDelete) && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {/* Se a coluna tiver uma função 'render', usamos ela para formatar.
                      Caso contrário, apenas imprimimos o valor puro (row[col.key]) */}
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              
              {(onEdit || onDelete) && (
                <td className="actions-cell">
                  {onEdit && (
                    <button className="btn-edit" onClick={() => onEdit(row)}>
                      Editar
                    </button>
                  )}
                  {onDelete && (
                    <button className="btn-delete" onClick={() => onDelete(row.id)}>
                      Excluir
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;