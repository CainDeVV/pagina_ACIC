import { useState, useMemo } from 'react';
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './AdminTable.css';

function SortableRow({ row, columns, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
    backgroundColor: isDragging ? 'var(--color-gray-light, #f8f9fa)' : undefined,
    boxShadow: isDragging ? '0 5px 15px rgba(0,0,0,0.1)' : undefined,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td style={{ width: '40px', textAlign: 'center', cursor: 'grab' }} {...attributes} {...listeners}>
        <GripVertical size={16} color="var(--color-gray-medium)" />
      </td>
      {columns.map((col, colIndex) => (
        <td key={colIndex}>
          {col.render ? col.render(row) : row[col.key]}
        </td>
      ))}
      {(onEdit || onDelete) && (
        <td className="actions-cell">
          {onEdit && (
            <button className="btn-edit-icon" onClick={() => onEdit(row)} title="Editar">
              <Edit size={16} />
            </button>
          )}
          {onDelete && (
            <button className="btn-delete-icon" onClick={() => onDelete(row.id)} title="Excluir">
              <Trash2 size={16} />
            </button>
          )}
        </td>
      )}
    </tr>
  );
}

function AdminTable({ columns, data, onEdit, onDelete, onReorder }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredData = useMemo(() => {
    if (!searchTerm) return data || [];
    const lowerSearch = searchTerm.toLowerCase();
    
    return (data || []).filter(row => {
      return columns.some(col => {
        const val = row[col.key];
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(lowerSearch);
        }
        return false;
      });
    });
  }, [data, searchTerm, columns]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = data.findIndex(item => item.id === active.id);
      const newIndex = data.findIndex(item => item.id === over.id);
      
      const newArray = arrayMove(data, oldIndex, newIndex);
      if (onReorder) {
        onReorder(newArray);
      }
    }
  };

  if (!data || data.length === 0) {
    return <p className="admin-table-empty">Nenhum registro cadastrado no momento.</p>;
  }

  return (
    <div className="admin-table-container">
      <div className="admin-table-toolbar">
        <div className="admin-search-wrapper">
          <Search className="admin-search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar registros..." 
            value={searchTerm}
            onChange={handleSearchChange}
            className="admin-search-input"
          />
        </div>
        <span className="admin-table-count">
          <strong>{filteredData.length}</strong> registro(s) encontrado(s)
        </span>
      </div>

      <div className="admin-table-wrapper">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                {columns.map((col, index) => (
                  <th key={index}>{col.label}</th>
                ))}
                {(onEdit || onDelete) && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              <SortableContext items={paginatedData.map(r => r.id)} strategy={verticalListSortingStrategy}>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row) => (
                    <SortableRow 
                      key={row.id} 
                      row={row} 
                      columns={columns} 
                      onEdit={onEdit} 
                      onDelete={onDelete} 
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + (onEdit || onDelete ? 2 : 1)} className="admin-table-no-results">
                      Nenhum registro encontrado para a busca "{searchTerm}".
                    </td>
                  </tr>
                )}
              </SortableContext>
            </tbody>
          </table>
        </DndContext>
      </div>

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)}
            className="btn-page"
          >
            <ChevronLeft size={18} />
            Anterior
          </button>
          <span className="page-info">Página {currentPage} de {totalPages}</span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => p + 1)}
            className="btn-page"
          >
            Próxima
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminTable;