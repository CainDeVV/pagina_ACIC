import { Link } from 'react-router-dom';
import { 
  formatDateLong, 
  formatDateCompact, 
  formatTimeOnly, 
  getDayAndMonthShort 
} from '../../utils/dateUtils';
import { getEventBadge, getEventBadgeClass } from '../../utils/eventUtils';
import './ContentCard.css';

const ContentCard = ({ data, type = 'news', variant = 'compact' }) => {
  const isEvent = type === 'event';
  
  // Base Variables
  const title = data.title;
  const slug = data.slug;
  const linkDestino = slug ? `/${isEvent ? 'eventos' : 'noticias'}/${slug}` : '#';
  const coverImage = data.coverImage || data.imageUrl || `https://placehold.co/600x400?text=${isEvent ? 'Evento' : 'Noticia'}`;
  
  // Compact Date Logic
  let compactDateText;
  if (isEvent) {
    const { day, month } = getDayAndMonthShort(data.startsAt);
    const time = formatTimeOnly(data.startsAt);
    compactDateText = (
      <>
        <span>📅 {day} {month}</span>
        <span>🕐 {time}</span>
        {data.location && <span>📍 {data.location}</span>}
      </>
    );
  } else {
    const dataOficial = data.publishedAt ? new Date(data.publishedAt) : new Date(data.createdAt);
    compactDateText = <span>📅 {formatDateCompact(dataOficial)}</span>;
  }

  // Grid Logic
  const gridDateText = isEvent
    ? `📅 ${formatDateLong(new Date(data.startsAt))} - ${formatTimeOnly(data.startsAt)}`
    : `📅 ${formatDateLong(data.publishedAt ? new Date(data.publishedAt) : new Date(data.createdAt))}`;

  if (variant === 'grid') {
    return (
      <Link to={linkDestino} className="content-card grid">
        <div className="card-img-wrapper">
          <img 
            className="card-img" 
            src={coverImage} 
            alt={title} 
            loading="lazy" 
          />
          {isEvent && (
            <span className={`card-badge-overlay ${getEventBadgeClass(data)}`}>
              {getEventBadge(data)}
            </span>
          )}
        </div>
        
        <div className="card-content">
          <span className="card-meta-date">{gridDateText}</span>
          <h3 className="card-title">{title}</h3>
          
          {isEvent ? (
            data.location && <p className="card-description">📍 {data.location}</p>
          ) : (
            data.summary && <p className="card-description">{data.summary}</p>
          )}
          
          <span className="card-read-more">
            {isEvent ? 'Ver detalhes →' : 'Ler matéria →'}
          </span>
        </div>
      </Link>
    );
  }

  // Padrão: variant === 'compact' (Home Page)
  return (
    <Link to={linkDestino} className="content-card compact">
      <img
        className="compact-img"
        src={coverImage}
        alt={title}
        loading="lazy"
      />
      <div className="compact-info">
        <span className={`compact-category ${type}`}>
          {isEvent ? 'Evento' : 'Notícia'}
        </span>
        <h3 className="compact-title">{title}</h3>
        <div className="compact-meta">
          {compactDateText}
        </div>
      </div>
    </Link>
  );
};

export default ContentCard;
