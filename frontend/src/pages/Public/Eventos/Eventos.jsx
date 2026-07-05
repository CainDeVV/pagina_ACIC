import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import HeroSlider from '../../../components/HeroSlider/HeroSlider';
import { eventosService } from '../../../services/eventosService';
import './Eventos.css';

function Eventos() {
  const [eventosDestaque, setEventosDestaque] = useState([]);
  const [proximosEventos, setProximosEventos] = useState([]);
  const [eventosPassados, setEventosPassados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarEventos() {
      try {
        const dados = await eventosService.buscarTodos();
        
        // 1. Filtrar Rascunhos (Privacidade)
        const eventosPublicos = dados.filter(e => e.status !== 'DRAFT');
        
        // 2. Separar Destaques
        const destaques = eventosPublicos.filter(e => e.destaque === true);
        
        // 3. Separar Futuro vs Passado
        const agora = new Date();
        const naoDestaques = eventosPublicos.filter(e => e.destaque !== true);
        
        const futuros = naoDestaques.filter(e => new Date(e.startsAt) > agora && e.status !== 'FINISHED' && e.status !== 'CANCELLED');
        const passados = naoDestaques.filter(e => new Date(e.startsAt) <= agora || e.status === 'FINISHED' || e.status === 'CANCELLED');

        // Ordenar futuros (mais próximos primeiro) e passados (mais recentes primeiro)
        futuros.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
        passados.sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt));

        setEventosDestaque(destaques);
        setProximosEventos(futuros);
        setEventosPassados(passados);

      } catch (error) {
        console.error("Erro ao carregar os eventos:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarEventos();
  }, []);

  const getBadgeText = (evento) => {
    if (evento.status === 'CANCELLED') return 'Cancelado';
    if (evento.status === 'FINISHED') return 'Realizado';
    return new Date(evento.startsAt) > new Date() ? 'Em Breve' : 'Realizado';
  };

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

  const temEventos = eventosDestaque.length > 0 || proximosEventos.length > 0 || eventosPassados.length > 0;

  // Filtra eventos para o slider superior
  const eventosParaSlider = eventosDestaque.length > 0 ? eventosDestaque : proximosEventos.length > 0 ? proximosEventos : eventosPassados;
  
  const sliderData = eventosParaSlider.slice(0, 4).map((evento) => ({
    id: evento.id,
    image: evento.coverImage || 'https://placehold.co/1200x400?text=Banner+do+Evento',
    badge: "Eventos",
    badgeStyle: "white",
    title: evento.title,
    description: evento.location ? `📍 ${evento.location}` : 'Fique por dentro das novidades e acontecimentos da ACIC Crateús',
    link: `/eventos/${evento.slug}` 
  }));

  return (
    <>
    <Helmet>
      <title>Eventos | ACIC</title>
    </Helmet> 
    <div className="eventos-page">
      {sliderData.length > 0 && <HeroSlider slides={sliderData} autoPlayTime={5000} />}

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
                  {getBadgeText(evento)}
                </span>
              </div>
              <div className="evento-destaque-info">
                <span className="evento-data">
                  {new Date(evento.startsAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
                <h3>{evento.title}</h3>
                {evento.location && <p>📍 {evento.location}</p>}
                <span className="btn-saiba-mais-evento">Saiba mais →</span>
              </div>
            </Link>
          ))}
        </section>
      )}

      {proximosEventos.length > 0 && (
        <section className="eventos-lista-section">
          <h2 className="eventos-section-titulo">Próximos Eventos</h2>
          <div className="eventos-grid">
            {proximosEventos.map((evento) => (
              <Link
                to={`/eventos/${evento.slug}`}
                key={evento.id}
                className="evento-card"
              >
                <img src={evento.coverImage || 'https://placehold.co/150x150?text=Evento'} alt={evento.title} />
                <div className="evento-card-info">
                  <span className="evento-badge">
                    {getBadgeText(evento)}
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

      {eventosPassados.length > 0 && (
        <section className="eventos-lista-section">
          <h2 className="eventos-section-titulo">Eventos Realizados</h2>
          <div className="eventos-grid">
            {eventosPassados.map((evento) => (
              <Link
                to={`/eventos/${evento.slug}`}
                key={evento.id}
                className="evento-card"
                style={{ opacity: 0.8 }}
              >
                <img src={evento.coverImage || 'https://placehold.co/150x150?text=Evento'} alt={evento.title} style={{ filter: 'grayscale(100%)' }} />
                <div className="evento-card-info">
                  <span className="evento-badge" style={{ background: 'var(--color-gray-medium)' }}>
                    {getBadgeText(evento)}
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

      {!temEventos && (
        <div className="eventos-vazio">
          <p>Nenhum evento disponível no momento.</p>
        </div>
      )}
    </div>
    </>
  );
}

export default Eventos;