import { Link } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';
import './Breadcrumb.css';

/**
 * @param {Array} items - [{ label: 'Home', path: '/' }, { label: 'Serviços' }]
 */
const Breadcrumb = ({ items }) => {
  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      <ol className="breadcrumb-list" itemScope itemType="https://schema.org/BreadcrumbList">
        
        {/* Link da Home sempre presente como ícone para modernidade */}
        <li className="breadcrumb-item" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link to="/" itemProp="item" className="breadcrumb-link home-icon">
            <FaHome itemProp="name" />
          </Link>
          <meta itemProp="position" content="1" />
          <FaChevronRight className="breadcrumb-separator" />
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const position = index + 2;

          return (
            <li 
              key={index} 
              className={`breadcrumb-item ${isLast ? 'active' : ''}`}
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              {!isLast ? (
                <>
                  <Link to={item.path} itemProp="item" className="breadcrumb-link">
                    <span itemProp="name">{item.label}</span>
                  </Link>
                  <FaChevronRight className="breadcrumb-separator" />
                </>
              ) : (
                <span itemProp="name" className="breadcrumb-current">{item.label}</span>
              )}
              <meta itemProp="position" content={position.toString()} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;