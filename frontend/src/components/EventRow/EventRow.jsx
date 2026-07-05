import { Link } from 'react-router-dom';
import './EventRow.css';

const EventRow = ({ event }) => {
  // Lendo a data oficial do banco de dados (startsAt em formato ISO)
  const dateObj = new Date(event.startsAt);
  const day = dateObj.toLocaleDateString('pt-BR', { day: '2-digit' });
  const month = dateObj.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  const horaFormatada = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const linkDestino = event.slug ? `/eventos/${event.slug}` : '/eventos';

  return (
    <Link to={linkDestino} className="event-row">
      <img
        className="event-img"
        src={event.coverImage || 'https://placehold.co/96x72?text=Evento'}
        alt={event.title}
        loading="lazy"
      />
      
      <div className="event-info">
        <h3>{event.title}</h3>
        <div className="event-meta">
          <span>📅 {day} {month}</span>
          <span>🕐 {horaFormatada}</span>
          {event.location && <span>📍 {event.location}</span>}
        </div>
      </div>
    </Link>
  );
};

export default EventRow;