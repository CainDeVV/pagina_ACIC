function CategoryCheckboxGroup({ categoriasAtivas, selectedIds = [], onChange, loading = false }) {
  if (loading) {
    return <span className="admin-field-hint">Carregando categorias...</span>;
  }
  if (!categoriasAtivas || categoriasAtivas.length === 0) {
    return <span className="admin-field-hint">Nenhuma categoria ativa encontrada.</span>;
  }

  return (
    <div className="admin-flex-wrap">
      {categoriasAtivas.map(cat => (
        <label key={cat.id} className="admin-category-checkbox">
          <input 
            type="checkbox" 
            checked={selectedIds.includes(cat.id)}
            onChange={() => onChange(cat.id)}
          />
          <span className="admin-category-bullet" style={{ color: cat.color }}>•</span>
          {cat.name}
        </label>
      ))}
    </div>
  );
}

export default CategoryCheckboxGroup;
