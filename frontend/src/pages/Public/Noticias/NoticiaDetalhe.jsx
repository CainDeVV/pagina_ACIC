import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { noticiasService } from '@/services/noticiasService';
import BlockRenderer from '@/components/BlockRenderer/BlockRenderer';
import { NewsCard } from '@/components/Card';
import CoverImage from '@/components/CoverImage/CoverImage';
import { formatDateLong } from '@/utils/dateUtils';
import { CONTENT_STATUS } from '@/constants/status';
import { FaCalendarAlt } from 'react-icons/fa';
import '@/components/Layout/PublicDetailLayout.css';
import './NoticiaDetalhe.css';

function NoticiaDetalhe() {
  const { slug } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [noticiasRelacionadas, setNoticiasRelacionadas] = useState([]);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const data = await noticiasService.buscarPorSlugPublico(slug);
        setNoticia(data);

        const todasNoticias = await noticiasService.buscarTodosPublico({ limit: 5 });
        const relacionadas = (todasNoticias?.data || [])
          .filter(n => n.status === CONTENT_STATUS.PUBLISHED)
          .filter(n => n.id !== data.id)
          .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt))
          .slice(0, 3);

        setNoticiasRelacionadas(relacionadas);
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
        <Helmet><title>Carregando Notícia... | ACIC</title></Helmet>
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
  const dataPublicacao = noticia.publishedAt || noticia.createdAt;
  const formattedDate = formatDateLong(dataPublicacao);

  return (
    <div className="noticia-detalhe-page">
      <Helmet>
        <title>{`${noticia.title} | ACIC`}</title>
        <meta name="description" content={noticia.summary || "Leia esta notícia no portal da ACIC."} />
      </Helmet>

      <div className="public-detail-wrapper">
        <Breadcrumb items={[{ label: 'Notícias', path: '/noticias' }, { label: noticia.title }]} />

        <div className="public-detail-header-limpo">
          <div className="public-detail-badges">
            <div className="public-detail-meta">
              <div className="public-meta-item">
                <FaCalendarAlt />
                <span className="noticia-data">{formattedDate}</span>
              </div>
            </div>
          </div>
          {noticia.categorias && noticia.categorias.length > 0 && (
            <div className="public-detail-categorias">
              {noticia.categorias.map(cat => (
                <span key={cat.id} className="public-detail-categoria-pill" style={{ backgroundColor: cat.color }}>
                  {cat.name}
                </span>
              ))}
            </div>
          )}
          <h1 className="public-detail-titulo">{noticia.title}</h1>
        </div>

        {noticia.showCoverImage !== false && (
          <CoverImage 
            src={noticia.coverImage} 
            fallbackSrc="https://placehold.co/1200x500?text=Capa+da+Noticia"
            title={noticia.title}
            rawCaption={noticia.coverImageCaption}
          />
        )}

        <div className="public-detail-conteudo-limpo">
          {noticia.summary && (
            <p className="noticia-resumo-destaque">{noticia.summary}</p>
          )}

          <div className="noticia-corpo-texto">
            <BlockRenderer blocks={parsedContent.blocks} />
          </div>
        </div>

        {noticiasRelacionadas.length > 0 && (
          <div className="public-detail-relacionados-wrapper">
            <h2 className="public-detail-relacionados-titulo">Últimas Notícias</h2>
            <div className="public-detail-relacionados-grid">
              {noticiasRelacionadas.map(relacionada => (
                <NewsCard variant="grid" key={relacionada.id} noticia={relacionada} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NoticiaDetalhe;
