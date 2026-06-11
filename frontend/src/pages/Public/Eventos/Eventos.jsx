import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { eventosMock } from "../../../mocks/eventosMock.js";
import './Eventos.css';

function Eventos() {
  const eventosDestaque = eventosMock.filter((e) => e.destaque);
  const outrosEventos = eventosMock.filter((e) => !e.destaque);

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

      {/* Eventos em Destaque */}
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
                <img src={evento.cardUrl} alt={evento.titulo} />
                <span className="evento-badge">{evento.categoria}</span>
              </div>
              <div className="evento-destaque-info">
                <span className="evento-data">{evento.data}</span>
                <h3>{evento.titulo}</h3>
                <p>{evento.resumo}</p>
                <span className="btn-saiba-mais-evento">Saiba mais →</span>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* Outros Eventos */}
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
                <img src={evento.cardUrl} alt={evento.titulo} />
                <div className="evento-card-info">
                  <span className="evento-badge">{evento.categoria}</span>
                  <h3>{evento.titulo}</h3>
                  <p>{evento.resumo}</p>
                  <span className="evento-data">{evento.data}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {eventosMock.length === 0 && (
        <div className="eventos-vazio">
          <p>Nenhum evento disponível no momento.</p>
        </div>
      )}
    </div>
    </>
  );
}

export default Eventos;