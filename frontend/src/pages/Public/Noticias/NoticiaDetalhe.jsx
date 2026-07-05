import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import { noticiasService } from '../../../services/noticiasService';
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import NewsCard from '../../../components/NewsCard/NewsCard';
import CoverImage from '../../../components/CoverImage/CoverImage';
import { formatDateLong } from '../../../utils/dateUtils';
import { CONTENT_STATUS } from '../../../constants/status';
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
        const data = await noticiasService.buscarPorSlug(slug);
        setNoticia(data);

        const todasNoticias = await noticiasService.buscarTodos();
        const relacionadas = todasNoticias
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
        {noticia.showCoverImage !== false && (
          <CoverImage 
            src={noticia.coverImage} 
            fallbackSrc="https://placehold.co/1200x500?text=Capa+da+Noticia"
            title={noticia.title}
            rawCaption={noticia.coverImageCaption}
          />
        )}

        {/* Área de Leitura */}
        <div className="noticia-detalhe-conteudo-limpo">
          {noticia.summary && (
            <p className="noticia-resumo-destaque">{noticia.summary}</p>
          )}

          <div className="noticia-corpo-texto">
            <BlockRenderer blocks={parsedContent.blocks} />
          </div>
        </div>

        {/* Notícias Relacionadas */}
        {noticiasRelacionadas.length > 0 && (
          <div style={{ marginTop: '64px' }}>
            <h2 style={{ color: 'var(--color-primary-hover)', fontSize: '1.2rem', borderBottom: '2px solid var(--color-gray-border)', paddingBottom: '8px', marginBottom: '24px' }}>
              Últimas Notícias
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              {noticiasRelacionadas.map(noticiaRel => (
                <NewsCard key={noticiaRel.id} news={noticiaRel} variant="premium" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NoticiaDetalhe;
