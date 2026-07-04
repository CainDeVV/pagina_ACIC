import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import { eventosService } from '../../../services/eventosService';
import './Eventos.css';

function EventoDetalhe() {
  const { slug } = useParams();
  const [evento, setEvento] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregarEvento() {
      try {
        const dados = await eventosService.buscarPorId(slug);
        setEvento(dados);
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
        <div className="eventos-vazio">
          <p>Carregando informações do evento...</p>
        </div>
      </div>
    );
  }

  if (erro || !evento) {
    return (
      <>
      <Helmet>
        <title>Evento Não Encontrado | ACIC</title>
      </Helmet>
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
    <Helmet>
      <title>{evento.title} | ACIC</title>
    </Helmet>
    <div className="eventos-page">
      {/* Banner */}
      <div className="evento-detalhe-banner">
        <img src={evento.coverImage || 'https://placehold.co/1200x400?text=Banner+do+Evento'} alt={evento.title} />
        <div className="evento-detalhe-banner-overlay">
          <span className="evento-badge">
            {evento.status === 'PUBLISHED' ? 'Evento' : 'Em Breve'}
          </span>
          <h1>{evento.title}</h1>
          {evento.location && <p>📍 {evento.location}</p>}
          <span className="evento-data">
            {new Date(evento.startsAt).toLocaleString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="evento-detalhe-conteudo">
        <Link to="/eventos" className="btn-voltar">← Voltar para Eventos</Link>
        <BlockRenderer blocks={contentBlocks} />
      </div>
    </div>
    </>
  );
}

export default EventoDetalhe;