const PublicSearchFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  categoriasAtivas, 
  selectedCategoria, 
  setSelectedCategoria, 
  placeholder 
}) => {
  return (
    <div className="public-search-wrapper">
      <div className="public-search-container">
        <input
          type="text"
          placeholder={placeholder || "Buscar..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="public-search-input"
        />
        {categoriasAtivas && categoriasAtivas.length > 0 && (
          <div className="public-category-filters">
            <button
              onClick={() => setSelectedCategoria('')}
              className={`public-filter-btn ${selectedCategoria === '' ? 'active' : ''}`}
            >
              Todas
            </button>
            {categoriasAtivas.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoria(cat.id)}
                className={`public-filter-btn ${selectedCategoria === cat.id ? 'active' : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicSearchFilter;
