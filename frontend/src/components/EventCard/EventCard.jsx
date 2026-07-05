import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { formatDateLong, formatTimeOnly } from '../../utils/dateUtils';
import { getEventBadge, getEventBadgeClass } from '../../utils/eventUtils';
import './EventCard.css';

const EventCard = ({ event, variant = 'normal' }) => {
  const dataOficial = new Date(event.startsAt);
  
  const dataFormatada = formatDateLong(dataOficial);

  const horaFormatada = formatTimeOnly(dataOficial);

  const getBadgeText = () => getEventBadge(event);
  const getBadgeClass = () => getEventBadgeClass(event);

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
