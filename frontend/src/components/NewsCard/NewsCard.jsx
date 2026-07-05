import { Link } from 'react-router-dom';
import { formatDateCompact, formatDateLong } from '../../utils/dateUtils';
import './NewsCard.css';

const NewsCard = ({ news, variant = 'compact' }) => {
  // Lendo as chaves exatas geradas pelo NestJS/Prisma
  const dataOficial = news.publishedAt ? new Date(news.publishedAt) : new Date(news.createdAt);
  
  // A formatação de data muda ligeiramente dependendo do formato
  const dataFormatadaCompact = formatDateCompact(dataOficial);
  const dataFormatadaPremium = formatDateLong(dataOficial);

  const linkDestino = news.slug ? `/noticias/${news.slug}` : '#';

  if (variant === 'premium') {
    return (
      <Link to={linkDestino} className="news-card premium">
        <div className="premium-img-wrapper">
          <img 
            className="premium-img" 
            src={news.coverImage || 'https://placehold.co/600x400?text=Notícia+ACIC'} 
            alt={news.title} 
            loading="lazy" 
          />
        </div>
        <div className="premium-content">
          <span className="premium-date">{dataFormatadaPremium}</span>
          <h3 className="premium-title">{news.title}</h3>
          {news.summary && <p className="premium-summary">{news.summary}</p>}
          <span className="premium-read-more">Ler matéria →</span>
        </div>
      </Link>
    );
  }

  // Padrão: Compact (usado na Home)
  return (
    <Link to={linkDestino} className="news-card compact">
      <img
        className="compact-img"
        src={news.coverImage || 'https://placehold.co/96x72?text=Notícia'}
        alt={news.title}
        loading="lazy"
      />
      <div className="compact-content">
        <span className="compact-category">Notícia</span>
        <h3 className="compact-title">{news.title}</h3>
        <div className="compact-date">{dataFormatadaCompact}</div>
      </div>
    </Link>
  );
};

export default NewsCard;