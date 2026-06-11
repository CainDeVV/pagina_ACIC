import { Link } from 'react-router-dom';
import './EventRow.css';

const EventRow = ({ event }) => {
  // LÓGICA COMPLEXA 1: Extração Segura de Data
  // Como os dados costumam vir em strings completas (ex: "14 Mai 2025"), 
  // quebramos a string por espaços vazios (.split) para isolar o Dia e o Mês.
  // Usamos fallback ("--") para evitar que o site quebre caso falte algum dado na API.
  const dateParts = event.data ? event.data.split(' ') : [];
  const day = dateParts[0] || '--';
  const month = dateParts[1] || 'Mês';

  // LÓGICA COMPLEXA 2: Fallback Seguro de Roteamento
  // Se o evento possuir um slug, o link leva para a página de detalhes dele.
  // Caso não possua, redireciona o usuário de forma segura para a grade geral de eventos.
  const linkDestino = event.slug ? `/eventos/${event.slug}` : '/eventos';

  return (
    <Link to={linkDestino} className="event-row">
      <div className="event-date-box">
        <span className="event-day">{day}</span>
        <span className="event-month">{month}</span>
      </div>
      
      <div className="event-info">
        <h3>{event.titulo}</h3>
        <div className="event-meta">
          {event.hora && <span>🕐 {event.hora}</span>}
          {event.local && <span>📍 {event.local}</span>}
        </div>
      </div>
    </Link>
  );
};

export default EventRow;