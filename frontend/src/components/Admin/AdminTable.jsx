import React, { useState, useMemo } from 'react';
import './AdminTable.css';

/**
 * Componente genérico para padronizar as tabelas do painel administrativo.
 * @param {Array} columns - Definição das colunas: [{ label: 'Nome', key: 'name', render: (row) => ... }]
 * @param {Array} data - Lista de objetos vindos da API
 * @param {Function} onEdit - Função disparada ao clicar em Editar
 * @param {Function} onDelete - Função disparada ao clicar em Excluir
 */
function AdminTable({ columns, data, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtragem local baseada na barra de busca
  const filteredData = useMemo(() => {
    if (!searchTerm) return data || [];
    const lowerSearch = searchTerm.toLowerCase();
    
    return (data || []).filter(row => {
      // Verifica se algum valor em qualquer coluna corresponde à busca
      return columns.some(col => {
        // Se a coluna tiver um custom render, a busca local por string pode ser complexa.
        // Focamos em buscar pelos valores puros da chave (col.key)
        const val = row[col.key];
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(lowerSearch);
        }
        return false;
      });
    });
  }, [data, searchTerm, columns]);

  // Paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  // Resetar a página ao buscar algo novo
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (!data || data.length === 0) {
    return <p className="admin-table-empty">Nenhum registro cadastrado no momento.</p>;
  }

  return (
    <div className="admin-table-container">
      {/* BARRA DE FERRAMENTAS (Busca e Contagem) */}
      <div className="admin-table-toolbar">
        <input 
          type="text" 
          placeholder="Pesquisar registros..." 
          value={searchTerm}
          onChange={handleSearchChange}
          className="admin-search-input"
        />
        <span className="admin-table-count">
          {filteredData.length} registro(s) encontrado(s)
        </span>
      </div>

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
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr key={row.id || rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
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
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="admin-table-no-results">
                  Nenhum registro encontrado para a busca "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CONTROLES DE PAGINAÇÃO */}
      {totalPages > 1 && (
        <div className="admin-pagination">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)}
            className="btn-page"
          >
            Anterior
          </button>
          <span className="page-info">Página {currentPage} de {totalPages}</span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => p + 1)}
            className="btn-page"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminTable;