import * as Card from './Card';
import { 
  formatDateLong, 
  formatTimeOnly, 
  getDayAndMonthShort 
} from '@/utils/dateUtils';
import { getEventBadge, getEventBadgeClass } from '@/utils/eventUtils';

const EventCard = ({ evento, variant = 'compact' }) => {
  const linkTo = evento.slug ? `/eventos/${evento.slug}` : '#';
  const coverImage = evento.coverImage || evento.imageUrl || 'https://placehold.co/600x400?text=Evento';
  
  if (variant === 'grid') {
    return (
      <Card.Root link={linkTo} variant="grid">
        <Card.ImageWrapper>
          <Card.Image src={coverImage} alt={evento.title} className="card-img" />
          <Card.Badge className={`card-badge-overlay ${getEventBadgeClass(evento)}`}>
            {getEventBadge(evento)}
          </Card.Badge>
        </Card.ImageWrapper>
        
        <Card.Content className="card-content">
          <Card.Meta className="card-meta-date">
            📅 {formatDateLong(new Date(evento.startsAt))} - {formatTimeOnly(evento.startsAt)}
          </Card.Meta>
          <Card.Title className="card-title">{evento.title}</Card.Title>
          {evento.location && (
            <Card.Description className="card-description">📍 {evento.location}</Card.Description>
          )}
          <Card.ActionText className="card-read-more">Ver detalhes →</Card.ActionText>
        </Card.Content>
      </Card.Root>
    );
  }

  // variant === 'compact' (Home)
  const { day, month } = getDayAndMonthShort(evento.startsAt);
  const time = formatTimeOnly(evento.startsAt);
  
  return (
    <Card.Root link={linkTo} variant="compact">
      <Card.Image src={coverImage} alt={evento.title} className="compact-img" />
      <Card.Content className="compact-info">
        <Card.CategoryList 
          destaque={evento.destaque} 
          categorias={evento.categorias} 
          fallbackType="event" 
        />
        <Card.Title className="compact-title">{evento.title}</Card.Title>
        <Card.Meta className="compact-meta">
          <span>📅 {day} {month}</span>
          <span>🕐 {time}</span>
          {evento.location && <span>📍 {evento.location}</span>}
        </Card.Meta>
      </Card.Content>
    </Card.Root>
  );
};

export default EventCard;
