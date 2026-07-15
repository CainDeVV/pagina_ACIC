import * as Card from './Card';
import { 
  formatDateLong, 
  formatDateCompact
} from '@/utils/dateUtils';

const NewsCard = ({ noticia, variant = 'compact' }) => {
  const linkTo = noticia.slug ? `/noticias/${noticia.slug}` : '#';
  const coverImage = noticia.coverImage || noticia.imageUrl || 'https://placehold.co/600x400?text=Noticia';
  const dataOficial = noticia.publishedAt ? new Date(noticia.publishedAt) : new Date(noticia.createdAt);
  
  if (variant === 'grid') {
    return (
      <Card.Root link={linkTo} variant="grid">
        <Card.ImageWrapper>
          <Card.Image src={coverImage} alt={noticia.title} className="card-img" /></Card.ImageWrapper>
        
        <Card.Content className="card-content">
          <Card.Meta className="card-meta-date">
            📅 {formatDateLong(dataOficial)}
          </Card.Meta>
          <Card.Title className="card-title">{noticia.title}</Card.Title>
          {noticia.summary && (
            <Card.Description className="card-description">{noticia.summary}</Card.Description>
          )}
          <Card.ActionText className="card-read-more">Ler matéria →</Card.ActionText>
        </Card.Content>
      </Card.Root>
    );
  }

  // variant === 'compact' (Home)
  return (
    <Card.Root link={linkTo} variant="compact">
      <Card.Image src={coverImage} alt={noticia.title} className="compact-img" />
      <Card.Content className="compact-info">
        <Card.CategoryList 
          destaque={noticia.destaque} 
          categorias={noticia.categorias} 
          fallbackType="news" 
        />
        <Card.Title className="compact-title">{noticia.title}</Card.Title>
        <Card.Meta className="compact-meta">
          <span>📅 {formatDateCompact(dataOficial)}</span>
        </Card.Meta>
      </Card.Content>
    </Card.Root>
  );
};

export default NewsCard;
