import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { eventosService } from '../../../services/eventosService';
import './Eventos.css';

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarEventos() {
      try {
        const dados = await eventosService.buscarTodos();
        setEventos(dados);
      } catch (error) {
        console.error("Erro ao carregar os eventos:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarEventos();
  }, []);

  // Assumimos o primeiro evento retornado da API como o destaque principal
  const eventosDestaque = eventos.length > 0 ? [eventos[0]] : [];
  const outrosEventos = eventos.length > 1 ? eventos.slice(1) : [];

  if (carregando) {
    return (
      <div className="eventos-page">
        <div className="eventos-header">
          <h1>Eventos</h1>
          <p>Carregando eventos...</p>
        </div>
        <div className="eventos-vazio">
          <p>Buscando dados no servidor...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Helmet>
      <title>Eventos | ACIC</title>
    </Helmet> 
    <div className="eventos-page">
      <div className="eventos-header">
        <h1>Eventos</h1>
        <p>Fique por dentro das novidades e acontecimentos da ACIC Crateús</p>
      </div>

      {eventosDestaque.length > 0 && (
        <section className="eventos-destaque-section">
          <h2 className="eventos-section-titulo">Em Destaque</h2>
          {eventosDestaque.map((evento) => (
            <Link
              to={`/eventos/${evento.slug}`}
              key={evento.id}
              className="evento-destaque-card"
            >
              <div className="evento-destaque-img-wrapper">
                <img src={evento.coverImage || 'https://placehold.co/800x400?text=Evento+ACIC'} alt={evento.title} />
                <span className="evento-badge">
                  {evento.status === 'PUBLISHED' ? 'Evento' : 'Em Breve'}
                </span>
              </div>
              <div className="evento-destaque-info">
                <span className="evento-data">
                  {new Date(evento.startsAt).toLocaleDateString('pt-BR')}
                </span>
                <h3>{evento.title}</h3>
                {evento.location && <p>📍 {evento.location}</p>}
                <span className="btn-saiba-mais-evento">Saiba mais →</span>
              </div>
            </Link>
          ))}
        </section>
      )}

      {outrosEventos.length > 0 && (
        <section className="eventos-lista-section">
          <h2 className="eventos-section-titulo">Outros Eventos</h2>
          <div className="eventos-grid">
            {outrosEventos.map((evento) => (
              <Link
                to={`/eventos/${evento.slug}`}
                key={evento.id}
                className="evento-card"
              >
                <img src={evento.coverImage || 'https://placehold.co/150x150?text=Evento'} alt={evento.title} />
                <div className="evento-card-info">
                  <span className="evento-badge">
                    {evento.status === 'PUBLISHED' ? 'Evento' : 'Em Breve'}
                  </span>
                  <h3>{evento.title}</h3>
                  {evento.location && <p>📍 {evento.location}</p>}
                  <span className="evento-data">
                    {new Date(evento.startsAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {eventos.length === 0 && (
        <div className="eventos-vazio">
          <p>Nenhum evento disponível no momento.</p>
        </div>
      )}
    </div>
    </>
  );
}

export default Eventos;