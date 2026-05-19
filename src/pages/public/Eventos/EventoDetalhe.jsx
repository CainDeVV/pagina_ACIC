import { useParams, Link } from 'react-router-dom';
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import { eventosMock } from "../../../mocks/eventosMock.js";
import './Eventos.css';

function EventoDetalhe() {
  const { slug } = useParams();
  const evento = eventosMock.find((e) => e.slug === slug);

  if (!evento) {
    return (
      <div className="eventos-page">
        <div className="eventos-vazio">
          <p>Evento não encontrado.</p>
          <Link to="/eventos" className="btn-voltar">← Voltar para Eventos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="eventos-page">
      {/* Banner */}
      <div className="evento-detalhe-banner">
        <img src={evento.bannerUrl} alt={evento.titulo} />
        <div className="evento-detalhe-banner-overlay">
          <span className="evento-badge">{evento.categoria}</span>
          <h1>{evento.titulo}</h1>
          <p>{evento.subtitulo}</p>
          <span className="evento-data">{evento.data}</span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="evento-detalhe-conteudo">
        <Link to="/eventos" className="btn-voltar">← Voltar para Eventos</Link>
        <BlockRenderer blocks={evento.blocks} />
      </div>
    </div>
  );
}

export default EventoDetalhe;