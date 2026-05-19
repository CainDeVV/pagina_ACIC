import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './ServiceCard.css';

const ServiceCard = ({ service, variant = 'premium' }) => {
  // LÓGICA COMPLEXA 1: Fallback de Link e Dados
  // A Home e a página de Serviços usam propriedades diferentes nos mocks temporários.
  // Aqui nós unificamos isso de forma transparente para não quebrar a aplicação.
  const linkTo = service.slug ? `/servicos/${service.slug}` : '/servicos';
  const descricao = service.resumo || service.descricao;

  // LÓGICA COMPLEXA 2: Renderização Condicional por Variante
  // Se a variante passada for 'simples' (usada na Home), renderizamos um layout mais limpo e focado no ícone,
  // exatamente como no design original.
  if (variant === 'simples') {
    return (
      <Link to={linkTo} className="simples-service-card">
        <div className="simples-card-icon">{service.icone}</div>
        <h3 className="simples-card-title">{service.titulo}</h3>
        <p className="simples-card-description">{descricao}</p>
      </Link>
    );
  }

  // Variante Premium (Padrão para a página de Serviços)
  // Utiliza a imagem de fundo, overlay com opacidade e a tag Oficial.
  return (
    <Link to={linkTo} className="premium-service-card">
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
        <p className="card-description">{descricao}</p>
        <div className="card-footer">
          <span className="card-tag">Oficial ACIC</span>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;