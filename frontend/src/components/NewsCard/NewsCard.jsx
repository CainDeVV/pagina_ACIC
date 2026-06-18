import { Link } from 'react-router-dom';
import './NewsCard.css';

const NewsCard = ({ news }) => {
  // Lendo as chaves exatas geradas pelo NestJS/Prisma
  const dataOficial = news.publishedAt ? new Date(news.publishedAt) : new Date(news.createdAt);
  const dataFormatada = dataOficial.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  }).replace(/de /g, '');

  const linkDestino = news.slug ? `/noticias/${news.slug}` : '#';

  return (
    <Link to={linkDestino} className="news-card">
      <img 
        className="news-img" 
        src={news.coverImage || 'https://placehold.co/96x72?text=Notícia'} 
        alt={news.title} 
        loading="lazy" 
      />
      <div className="news-content">
        <span className="news-category">Notícia</span>
        <h3>{news.title}</h3>
        <div className="news-date">{dataFormatada}</div>
      </div>
    </Link>
  );
};

export default NewsCard;