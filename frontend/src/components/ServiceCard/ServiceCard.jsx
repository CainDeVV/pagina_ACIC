import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './ServiceCard.css';

const ServiceCard = ({ service }) => {
  return (
    <Link to={`/servicos/${service.slug}`} className="premium-service-card">
      <div className="card-image-wrapper">
        <img 
          src={service.cardUrl} 
          alt={service.titulo} 
          loading="lazy" 
          className="card-img"
        />
        <div className="card-overlay">
          <span className="view-more-label">Ver Detalhes <FaArrowRight /></span>
        </div>
      </div>
      
      <div className="card-info">
        <h3 className="card-title">{service.titulo}</h3>
        <p className="card-description">{service.resumo}</p>
        <div className="card-footer">
          <span className="card-tag">Oficial ACIC</span>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;