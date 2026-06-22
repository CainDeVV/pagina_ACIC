import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { noticiasService } from '../../../services/noticiasService';
import NewsCard from '../../../components/NewsCard/NewsCard';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import './Noticias.css';

function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const data = await noticiasService.buscarTodos();
        setNoticias(data);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar notícias.');
      } finally {
        setLoading(false);
      }
    };
    fetchNoticias();
  }, []);

  return (
    <div className="public-noticias-container">
      <Helmet>
        <title>Notícias | ACIC</title>
        <meta name="description" content="Fique por dentro das últimas notícias da ACIC." />
      </Helmet>

      <div className="public-noticias-content">
        <Breadcrumb items={[{ label: 'Início', href: '/' }, { label: 'Notícias' }]} />
        
        <h1 className="public-noticias-title">Notícias</h1>

        {loading ? (
          <p className="public-noticias-msg">Carregando notícias...</p>
        ) : error ? (
          <p className="public-noticias-msg error">{error}</p>
        ) : noticias.length === 0 ? (
          <p className="public-noticias-msg">Nenhuma notícia publicada no momento.</p>
        ) : (
          <div className="public-noticias-grid">
            {noticias.map(noticia => (
              <NewsCard key={noticia.id} noticia={noticia} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Noticias;
