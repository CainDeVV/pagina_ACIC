import { Link } from 'react-router-dom';
import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { getDayAndMonthShort, formatTimeOnly } from '../../utils/dateUtils';
import './EventRow.css';

const EventRow = ({ event }) => {
  // Lendo a data oficial do banco de dados (startsAt em formato ISO)
  const { day, month } = getDayAndMonthShort(event.startsAt);
  const horaFormatada = formatTimeOnly(event.startsAt);

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