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
      <div className="event-date-box">
        <span className="event-day">{day}</span>
        <span className="event-month">{month}</span>
      </div>
      
      <div className="event-info">
        <h3>{event.title}</h3>
        <div className="event-meta">
          <span>🕐 {horaFormatada}</span>
          {event.location && <span>📍 {event.location}</span>}
        </div>
      </div>
    </Link>
  );
};

export default EventRow;