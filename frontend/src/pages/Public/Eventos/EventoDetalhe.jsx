import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import BlockRenderer from '@/components/BlockRenderer/BlockRenderer';
import { EventCard } from '@/components/Card';
import CoverImage from '@/components/CoverImage/CoverImage';
import { eventosService } from '@/services/eventosService';
import { formatDateTime } from '@/utils/dateUtils';
import { CONTENT_STATUS } from '@/constants/status';
import { getEventBadge } from '@/utils/eventUtils';
import { FaCalendarAlt } from 'react-icons/fa';
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

        const todosEventos = await eventosService.buscarTodosPublico();
        const agora = new Date();
        const relacionados = (todosEventos?.data || [])
          .filter(e => e.status !== CONTENT_STATUS.DRAFT && e.status !== CONTENT_STATUS.FINISHED && e.status !== CONTENT_STATUS.CANCELLED)
          .filter(e => new Date(e.startsAt) > agora)
          .filter(e => e.id !== dados.id)
          .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt))
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
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px 40px' }}>
          <Breadcrumb items={[{ label: 'Eventos', path: '/eventos' }, { label: evento.title }]} />

          {/* Cabeçalho Limpo (Novo Design) */}
          <div className="evento-detalhe-header-limpo">
            <div className="evento-detalhe-badges">
              <span className="evento-badge">{getEventBadge(evento)}</span>
              <div className="evento-detalhe-meta">
                <div className="evento-meta-item">
                  <FaCalendarAlt />
                  <span className="evento-data">{formatDateTime(evento.startsAt)}</span>
                </div>
                {evento.location && <span className="evento-local">📍 {evento.location}</span>}
              </div>
            </div>
            <h1 className="evento-detalhe-titulo">{evento.title}</h1>
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
          <div className="evento-detalhe-conteudo-limpo">
            <BlockRenderer blocks={contentBlocks} />
          </div>

          {/* Eventos Relacionados */}
          {eventosRelacionados.length > 0 && (
            <div style={{ marginTop: '64px' }}>
              <h2 className="eventos-section-titulo" style={{ margin: '0 0 24px 0' }}>Próximos Eventos</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
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