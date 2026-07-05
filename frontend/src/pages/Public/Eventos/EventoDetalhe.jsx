import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import EventCard from '../../../components/EventCard/EventCard';
import { eventosService } from '../../../services/eventosService';
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
        const dados = await eventosService.buscarPorId(slug);
        setEvento(dados);

        const todosEventos = await eventosService.buscarTodos();
        const agora = new Date();
        const relacionados = todosEventos
          .filter(e => e.status !== 'DRAFT' && e.status !== 'FINISHED' && e.status !== 'CANCELLED')
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

  const getBadgeText = (evento) => {
    if (evento.status === 'CANCELLED') return 'Cancelado';
    if (evento.status === 'FINISHED') return 'Realizado';
    return new Date(evento.startsAt) > new Date() ? 'Em Breve' : 'Realizado';
  };

  // Lógica de legenda e texto alternativo (Alt Text)
  let finalCoverAlt = evento.title;
  let showCoverCaption = false;
  let cleanCoverCaption = evento.coverImageCaption ? evento.coverImageCaption.trim() : '';

  if (cleanCoverCaption) {
    if (cleanCoverCaption.startsWith('[') && cleanCoverCaption.endsWith(']')) {
      finalCoverAlt = cleanCoverCaption.slice(1, -1);
      showCoverCaption = false;
    } else {
      finalCoverAlt = cleanCoverCaption;
      showCoverCaption = true;
    }
  }

  return (
    <>
    <Helmet><title>{`${evento.title} | ACIC`}</title></Helmet>
    <div className="eventos-page">
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px 40px' }}>
        <Breadcrumb items={[{ label: 'Eventos', path: '/eventos' }, { label: evento.title }]} />
        
        {/* Cabeçalho Limpo (Novo Design) */}
        <div className="evento-detalhe-header-limpo">
          <div className="evento-detalhe-badges">
            <span className="evento-badge">{getBadgeText(evento)}</span>
            <div className="evento-detalhe-meta">
              <span className="evento-data">📅 {new Date(evento.startsAt).toLocaleString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              {evento.location && <span className="evento-local">📍 {evento.location}</span>}
            </div>
          </div>
          <h1 className="evento-detalhe-titulo">{evento.title}</h1>
        </div>

        {/* Imagem de Capa Arredondada */}
        {evento.showCoverImage !== false && (
          <div className="evento-detalhe-cover">
            <img 
              src={evento.coverImage || 'https://placehold.co/1200x500?text=Capa+do+Evento'} 
              alt={finalCoverAlt} 
            />
            {showCoverCaption && (
              <div className="noticia-detalhe-cover-caption">
                {cleanCoverCaption}
              </div>
            )}
          </div>
        )}

        {/* Conteúdo Rico */}
        <div className="evento-detalhe-conteudo-limpo">
          <BlockRenderer blocks={contentBlocks} />
        </div>

        {/* Eventos Relacionados */}
        {eventosRelacionados.length > 0 && (
          <div style={{ marginTop: '64px' }}>
            <h2 className="eventos-section-titulo" style={{ margin: '0 0 24px 0' }}>Próximos Eventos</h2>
            <div className="eventos-grid-moderno" style={{ padding: 0 }}>
              {eventosRelacionados.map(evento => (
                <EventCard key={evento.id} event={evento} />
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