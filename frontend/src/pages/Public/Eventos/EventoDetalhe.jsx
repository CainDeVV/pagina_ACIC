import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import BlockRenderer from '@/components/BlockRenderer/BlockRenderer';
import { EventCard } from '@/components/Card';
import CoverImage from '@/components/CoverImage/CoverImage';
import { eventosService } from '@/services/eventosService';
import { formatDateTime } from '@/utils/dateUtils';
import { getEventBadge } from '@/utils/eventUtils';
import { FaCalendarAlt } from 'react-icons/fa';
import '@/components/Layout/PublicDetailLayout.css';
import './Eventos.css';

function EventoDetalhe() {
  const { slug } = useParams();
  const [evento, setEvento] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [eventosRelacionados, setEventosRelacionados] = useState([]);

  useEffect(() => {
    async function carregarEvento() {
      try {
        const dados = await eventosService.buscarPorSlugPublico(slug);
        setEvento(dados);

        const todosEventos = await eventosService.buscarTodosPublico({ limit: 5, upcomingOnly: true });
        const relacionados = (todosEventos?.data || [])
          .filter(e => e.id !== dados.id)
          .slice(0, 3);

        setEventosRelacionados(relacionados);
      } catch (error) {
        console.error("Erro ao carregar o evento detalhado:", error);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }
    carregarEvento();
  }, [slug]);

  if (carregando) {
    return (
      <div className="eventos-page">
        <Helmet><title>Carregando Evento... | ACIC</title></Helmet>
        <div className="eventos-vazio">
          <p>Carregando informações do evento...</p>
        </div>
      </div>
    );
  }

  if (erro || !evento) {
    return (
      <>
        <Helmet><title>Evento Não Encontrado | ACIC</title></Helmet>
        <div className="eventos-page">
          <div className="eventos-vazio">
            <p>Evento não encontrado.</p>
            <Link to="/eventos" className="btn-voltar">← Voltar para Eventos</Link>
          </div>
        </div>
      </>
    );
  }

  // Prepara os blocos do Editor.js vindos do backend (campo description do NestJS)
  const contentBlocks = evento.description?.blocks || [];


  return (
    <>
      <Helmet><title>{`${evento.title} | ACIC`}</title></Helmet>
      <div className="eventos-page">
        <div className="public-detail-wrapper">
          <Breadcrumb items={[{ label: 'Eventos', path: '/eventos' }, { label: evento.title }]} />

          {/* Cabeçalho Limpo (Novo Design) */}
          <div className="public-detail-header-limpo">
            <div className="public-detail-badges">
              <span className="evento-badge">{getEventBadge(evento)}</span>
              <div className="public-detail-meta">
                <div className="public-meta-item">
                  <FaCalendarAlt />
                  <span className="evento-data">{formatDateTime(evento.startsAt)}</span>
                </div>
                {evento.location && <span className="public-meta-item">📍 {evento.location}</span>}
              </div>
            </div>
            {evento.categorias && evento.categorias.length > 0 && (
              <div className="public-detail-categorias">
                {evento.categorias.map(cat => (
                  <span key={cat.id} className="public-detail-categoria-pill" style={{ backgroundColor: cat.color }}>
                    {cat.name}
                  </span>
                ))}
              </div>
            )}
            <h1 className="public-detail-titulo">{evento.title}</h1>
          </div>

          {/* Imagem de Capa Arredondada */}
          {evento.showCoverImage !== false && (
            <CoverImage 
              src={evento.coverImage} 
              fallbackSrc="https://placehold.co/1200x500?text=Capa+do+Evento"
              title={evento.title}
              rawCaption={evento.coverImageCaption}
            />
          )}

          {/* Conteúdo Rico */}
          <div className="public-detail-conteudo-limpo">
            <BlockRenderer blocks={contentBlocks} />
          </div>

          {/* Eventos Relacionados */}
          {eventosRelacionados.length > 0 && (
            <div className="public-detail-relacionados-wrapper">
              <h2 className="public-detail-relacionados-titulo">Próximos Eventos</h2>
              <div className="public-detail-relacionados-grid">
                {eventosRelacionados.map(evento => (
                  <EventCard variant="grid" key={evento.id} evento={evento} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default EventoDetalhe;