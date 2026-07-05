import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { noticiasService } from '../../../services/noticiasService';
import { CONTENT_STATUS } from '../../../constants/status';
import HeroSlider from '../../../components/HeroSlider/HeroSlider';
import NewsCard from '../../../components/NewsCard/NewsCard';
import './Noticias.css';

function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const data = await noticiasService.buscarTodos();
        const noticiasPublicas = data.filter(n => n.status === CONTENT_STATUS.PUBLISHED);
        setNoticias(noticiasPublicas);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar notícias.');
      } finally {
        setLoading(false);
      }
    };
    fetchNoticias();
  }, []);

  const sliderData = noticias.slice(0, 4).map((noticia) => ({
    id: noticia.id,
    image: noticia.coverImage || 'https://placehold.co/1200x400?text=Notícia+ACIC',
    badge: "Notícias",
    badgeStyle: "white",
    title: noticia.title,
    description: noticia.summary || 'Leia as principais informações do nosso portal',
    link: `/noticias/${noticia.slug}`
  }));

  return (
    <div className="noticias-page">
      <Helmet>
        <title>Notícias | ACIC</title>
        <meta name="description" content="Fique por dentro das últimas notícias da ACIC." />
      </Helmet>

      {sliderData.length > 0 && <HeroSlider slides={sliderData} autoPlayTime={5000} />}

      <div className="noticias-content">
        {loading ? (
          <div className="noticias-vazio"><p>Carregando notícias...</p></div>
        ) : error ? (
          <div className="noticias-vazio"><p className="error">{error}</p></div>
        ) : noticias.length === 0 ? (
          <div className="noticias-vazio"><p>Nenhuma notícia publicada no momento.</p></div>
        ) : (
          <div className="noticias-grid">
            {noticias.map(noticia => (
              <NewsCard key={noticia.id} news={noticia} variant="premium" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Noticias;
