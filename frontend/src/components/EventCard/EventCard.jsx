import { Link } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ event, variant = 'normal' }) => {
  const dataOficial = new Date(event.startsAt);
  
  const dataFormatada = dataOficial.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });

  const horaFormatada = dataOficial.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const getBadgeText = () => {
    if (event.status === 'CANCELLED') return 'Cancelado';
    if (event.status === 'FINISHED') return 'Realizado';
    return dataOficial > new Date() ? 'Em Breve' : 'Realizado';
  };

  const getBadgeClass = () => {
    if (event.status === 'CANCELLED') return 'badge-cancelled';
    if (event.status === 'FINISHED' || dataOficial <= new Date()) return 'badge-finished';
    return 'badge-upcoming';
  };

  const linkDestino = event.slug ? `/eventos/${event.slug}` : '#';

  return (
    <Link to={linkDestino} className={`event-card-container ${variant}`}>
      <div className="event-card-img-wrapper">
        <img 
          className="event-card-img" 
          src={event.coverImage || 'https://placehold.co/600x400?text=Evento+ACIC'} 
          alt={event.title} 
          loading="lazy" 
        />
        <span className={`event-card-badge ${getBadgeClass()}`}>
          {getBadgeText()}
        </span>
      </div>
      
      <div className="event-card-content">
        <div className="event-card-meta">
          <span>📅 {dataFormatada} - {horaFormatada}</span>
        </div>
        
        <h3 className="event-card-title">{event.title}</h3>
        
        {event.location && (
          <p className="event-card-location">📍 {event.location}</p>
        )}
        
        <span className="event-card-read-more">Ver detalhes →</span>
      </div>
    </Link>
  );
};

export default EventCard;
