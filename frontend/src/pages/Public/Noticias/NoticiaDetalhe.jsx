import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { noticiasService } from '../../../services/noticiasService';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import './NoticiaDetalhe.css';

function NoticiaDetalhe() {
  const { slug } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const data = await noticiasService.buscarPorSlug(slug);
        setNoticia(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchNoticia();
  }, [slug]);

  if (loading) {
    return (
      <div className="noticia-detalhe-container">
        <div className="noticia-detalhe-content">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !noticia) {
    return (
      <div className="noticia-detalhe-container">
        <div className="noticia-detalhe-content">
          <p>Notícia não encontrada.</p>
        </div>
      </div>
    );
  }

  const parsedContent = noticia.content ? JSON.parse(noticia.content) : { blocks: [] };
  const formattedDate = noticia.publishedAt 
    ? new Date(noticia.publishedAt).toLocaleDateString('pt-BR', { dateStyle: 'long' })
    : null;

  return (
    <div className="noticia-detalhe-container">
      <Helmet>
        <title>{noticia.title} | ACIC</title>
        <meta name="description" content={noticia.summary || "Leia esta notícia no portal da ACIC."} />
      </Helmet>

      <div className="noticia-detalhe-content">
        <Breadcrumb 
          items={[
            { label: 'Início', href: '/' }, 
            { label: 'Notícias', href: '/noticias' }, 
            { label: noticia.title }
          ]} 
        />
        
        {noticia.coverImage && (
          <img 
            src={noticia.coverImage} 
            alt={noticia.title} 
            className="noticia-detalhe-cover"
          />
        )}

        <h1 className="noticia-detalhe-title">{noticia.title}</h1>
        
        {formattedDate && (
          <p className="noticia-detalhe-date">Publicado em: {formattedDate}</p>
        )}

        {noticia.summary && (
          <p className="noticia-detalhe-summary">{noticia.summary}</p>
        )}

        <div className="noticia-detalhe-body">
          <BlockRenderer content={parsedContent} />
        </div>
      </div>
    </div>
  );
}

export default NoticiaDetalhe;
