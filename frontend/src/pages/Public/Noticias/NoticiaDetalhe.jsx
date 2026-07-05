import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import { noticiasService } from '../../../services/noticiasService';
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
      <div className="noticia-detalhe-page">
        <div className="noticia-vazia"><p>Carregando notícia...</p></div>
      </div>
    );
  }

  if (error || !noticia) {
    return (
      <div className="noticia-detalhe-page">
        <Helmet><title>Notícia Não Encontrada | ACIC</title></Helmet>
        <div className="noticia-vazia">
          <p>Notícia não encontrada.</p>
          <Link to="/noticias" className="btn-voltar">← Voltar para Notícias</Link>
        </div>
      </div>
    );
  }

  const parsedContent = noticia.content || { blocks: [] };
  const formattedDate = noticia.publishedAt 
    ? new Date(noticia.publishedAt).toLocaleDateString('pt-BR', { dateStyle: 'long' })
    : new Date(noticia.createdAt).toLocaleDateString('pt-BR', { dateStyle: 'long' });

  return (
    <div className="noticia-detalhe-page">
      <Helmet>
        <title>{noticia.title} | ACIC</title>
        <meta name="description" content={noticia.summary || "Leia esta notícia no portal da ACIC."} />
      </Helmet>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px 40px' }}>
        
        <Breadcrumb items={[{ label: 'Notícias', path: '/noticias' }, { label: noticia.title }]} />

        {/* Cabeçalho Limpo (Novo Design) */}
        <div className="noticia-detalhe-header-limpo">
          <div className="noticia-detalhe-badges">
            <div className="noticia-detalhe-meta">
              <span className="noticia-detalhe-data-novo">📅 {formattedDate}</span>
            </div>
          </div>
          <h1 className="noticia-detalhe-titulo-novo">{noticia.title}</h1>
        </div>

        {/* Imagem de Capa Arredondada */}
        <div className="noticia-detalhe-cover-novo">
          <img 
            src={noticia.coverImage || 'https://placehold.co/1200x500?text=Capa+da+Noticia'} 
            alt={noticia.title} 
          />
        </div>

        {/* Área de Leitura */}
        <div className="noticia-detalhe-conteudo-limpo">
          {noticia.summary && (
            <p className="noticia-resumo-destaque">{noticia.summary}</p>
          )}

          <div className="noticia-corpo-texto">
            <BlockRenderer blocks={parsedContent.blocks} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoticiaDetalhe;
