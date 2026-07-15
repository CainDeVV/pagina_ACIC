import { Link } from 'react-router-dom';
import './Card.css';

export const Root = ({ children, variant = 'compact', link, className = '' }) => {
  const baseClass = `content-card ${variant} ${className}`;
  
  if (link) {
    return (
      <Link to={link} className={baseClass}>
        {children}
      </Link>
    );
  }

  return (
    <div className={baseClass}>
      {children}
    </div>
  );
};

export const ImageWrapper = ({ children, className = 'card-img-wrapper' }) => (
  <div className={className}>
    {children}
  </div>
);

export const Image = ({ src, alt, className = '' }) => (
  <img 
    src={src} 
    alt={alt || 'Imagem do card'} 
    loading="lazy" 
    className={className} 
  />
);

export const Badge = ({ children, className = '' }) => {
  if (!children) return null;
  return (
    <span className={className}>
      {children}
    </span>
  );
};

export const Content = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const Meta = ({ children, className = '' }) => {
  if (!children) return null;
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const Title = ({ children, className = '' }) => (
  <h3 className={className}>{children}</h3>
);

export const Description = ({ children, className = '' }) => {
  if (!children) return null;
  return (
    <p className={className}>{children}</p>
  );
};

export const ActionText = ({ children, className = '' }) => (
  <span className={className}>{children}</span>
);

export const CategoryList = ({ destaque, categorias, fallbackType = 'event' }) => {
  return (
    <div className="card-category-list compact">
      {destaque && (
        <Badge className="card-category-pill card-category-destaque">
          ★ Destaque
        </Badge>
      )}
      {categorias && categorias.length > 0 ? (
        categorias.slice(0, 2).map(cat => (
          <Badge key={cat.id} className="card-category-pill" style={{ backgroundColor: cat.color }}>
            {cat.name}
          </Badge>
        ))
      ) : (
        !destaque && (
          <Badge className={`compact-category ${fallbackType}`}>
            {fallbackType === 'event' ? 'Evento' : 'Notícia'}
          </Badge>
        )
      )}
    </div>
  );
};
