import { Link } from 'react-router-dom';
import './NewsCard.css';

const NewsCard = ({ news }) => {
  // LÓGICA COMPLEXA: Fallback Seguro de Roteamento
  // Prevemos que algumas notícias podem não ter um "slug" (URL amigável) cadastrado no Mock.
  // Essa lógica verifica se o slug existe; se não existir, direcionamos para um fallback '#'
  // para garantir que a aplicação nunca quebre ao tentar montar o Link dinâmico.
  const linkDestino = news.slug ? `/noticias/${news.slug}` : '#';

  return (
    <Link to={linkDestino} className="news-card">
      <img 
        className="news-img" 
        src={news.imagem_url} 
        alt={news.titulo} 
        loading="lazy" 
      />
      <div className="news-content">
        <span className="news-category">{news.categoria}</span>
        <h3>{news.titulo}</h3>
        <div className="news-date">{news.data}</div>
      </div>
    </Link>
  );
};

export default NewsCard;