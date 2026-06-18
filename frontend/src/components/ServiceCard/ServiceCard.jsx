import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './ServiceCard.css';

const ServiceCard = ({ service, variant = 'premium' }) => {
  // LÓGICA DE COMPATIBILIDADE: Lê do banco (inglês) ou do mock da Home (português)
  const slug = service.slug;
  const titulo = service.title || service.titulo;
  const icone = service.icon || service.icone || '📌';
  const imagem = service.imageUrl || service.cardUrl;
  const descricao = service.summary || service.resumo || service.descricao;

  const linkTo = slug ? `/servicos/${slug}` : '/servicos';

  if (variant === 'simples') {
    return (
      <Link to={linkTo} className="simples-service-card">
        <div className="simples-card-icon">{icone}</div>
        <h3 className="simples-card-title">{titulo}</h3>
        <p className="simples-card-description">{descricao}</p>
      </Link>
    );
  }

  return (
    <Link to={linkTo} className="premium-service-card">
      <div className="card-image-wrapper">
        <img 
          src={imagem || 'https://placehold.co/400x300?text=Serviço'} 
          alt={titulo} 
          loading="lazy" 
          className="card-img"
        />
        <div className="card-overlay">
          <span className="view-more-label">Ver Detalhes <FaArrowRight /></span>
        </div>
      </div>
      
      <div className="card-info">
        <h3 className="card-title">{titulo}</h3>
        <p className="card-description">{descricao}</p>
        <div className="card-footer">
          <span className="card-tag">Oficial ACIC</span>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;