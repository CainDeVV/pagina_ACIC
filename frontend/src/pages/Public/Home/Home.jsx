import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
/* --- IMPORTAÇÃO DOS COMPONENTES REUTILIZÁVEIS --- */
import HeroSlider from '../../../components/HeroSlider/HeroSlider';
import ServiceCard from '../../../components/ServiceCard/ServiceCard';
import NewsCard from '../../../components/NewsCard/NewsCard';
import EventRow from '../../../components/EventRow/EventRow';
import DirectorCard from '../../../components/DirectorCard/DirectorCard';

/* --- IMPORTAÇÃO DOS MOCKS GLOBAIS --- */
import { servicosMock } from '../../../mocks/servicosMock';
import { eventosMock } from '../../../mocks/eventosMock';
import { diretoriaHomeMock } from '../../../mocks/institucionalMock';
import { slidesMock, numerosMock, noticiasMock } from '../../../mocks/homeMock';

import './Home.css';

export default function Home() {

  // LÓGICA COMPLEXA: Mapeamento de Dados Externos
  // Convertemos o array limpo do mock para a estrutura rica de botões e selos exigida pelo HeroSlider
  const homeSliderData = slidesMock.map((slide) => ({
    id: slide.id,
    image: slide.imagem_url,
    badge: "● ACIC — Crateús, CE",
    badgeStyle: "gold", 
    title: slide.titulo,
    description: slide.subtitulo,
    buttons: [
      { label: "Associe-se →", link: "/contatos", type: "primary" },
      { label: "Conheça a ACIC", link: "/quem-somos", type: "outline" }
    ]
  }));

  const homeServicos = servicosMock.slice(0, 6).map((servico, index) => {
    const icones = ['🏛️', '📜', '💻', '⚖️', '📊', '🤝', '🔍'];
    return {
      ...servico,
      icone: icones[index] || '📌'
    };
  });

  const homeEventos = eventosMock.slice(0, 3);

  return (
    <>
    <Helmet>
      <title>ACIC - Associação Comercial e Industrial de Crateús</title>
    </Helmet>
    <main className="acic-home">

      {/* ── HERO SLIDER ── */}
      <HeroSlider 
        slides={homeSliderData} 
        autoPlayTime={5500} 
        titleAsH1={true} 
        showControls={false}  
        indicatorStyle="gold"
      />

      {/* ── NÚMEROS ── */}
      <section className="secao-numeros">
        {numerosMock.map((n, i) => (
          <div className="numero-item" key={i}>
            <div className="numero-valor">{n.valor}</div>
            <div className="numero-label">{n.label}</div>
          </div>
        ))}
      </section>

      {/* ── QUEM SOMOS ── */}
      <section className="secao-quem-somos">
        <div className="qs-visual">
          <img className="qs-img" src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80" alt="Reunião empresarial" />
          <div className="qs-tag">
            <span>+500</span> Empresas associadas
          </div>
        </div>
        <div className="qs-texto">
          <div className="secao-label">Quem somos</div>
          <h2>A força do empresariado do <span>Sertão Central</span></h2>
          <p>A ACIC é a maior organização multissetorial da região, reunindo empresários de todos os setores — comércio, indústria, agropecuária e serviços — de todos os portes e profissionais liberais.</p>
          <p>Há mais de 40 anos, trabalhamos para representar, capacitar e conectar o empresariado cearense, promovendo o desenvolvimento econômico de Crateús e região.</p>
          <Link to="/quem-somos" className="btn-azul">Saiba mais sobre a ACIC →</Link>
        </div>
      </section>

      {/* ── SERVIÇOS ── */}
      <section className="secao-servicos">
        <div className="secao-header">
          <div>
            <div className="secao-label">Para associados</div>
            <h2>Nossos serviços</h2>
          </div>
          <Link to="/servicos" className="btn-link">Ver todos os serviços →</Link>
        </div>
        <div className="grid-servicos">
          {homeServicos.map(s => (
            <ServiceCard key={s.id} service={s} variant="simples" />
          ))}
        </div>
      </section>

      {/* ── DIRETORIA ── */}
      <section className="secao-diretoria">
        <div className="secao-label">Gestão 2023–2025</div>
        <h2>Nossa Diretoria</h2>
        <div className="grid-diretoria">
          {diretoriaHomeMock.map(member => (
            <DirectorCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      {/* ── EVENTOS + NOTÍCIAS ── */}
      <section className="secao-en">
        
        <div className="col-eventos">
          <div className="secao-label">Agenda</div>
          <h2>Próximos Eventos</h2>
          
          <div className="lista-eventos">
            {homeEventos.map(e => (
              <EventRow key={e.id} event={e} />
            ))}
          </div>
          
          <br />
          <Link to="/eventos" className="btn-link">Ver todos os eventos →</Link>
        </div>

        <div className="col-noticias">
          <div className="secao-label">Comunicação</div>
          <h2>Últimas Notícias</h2>
          
          <div className="lista-noticias">
            {noticiasMock.map(n => (
              <NewsCard key={n.id} news={n} />
            ))}
          </div>
          
          <br />
          <Link to="/noticias" className="btn-link">Ver todas as notícias →</Link>
        </div>

      </section>

      {/* ── CTA ASSOCIE-SE ── */}
      <section className="secao-cta">
        <div className="cta-texto">
          <h2>Faça parte da ACIC</h2>
          <p>Junte-se a centenas de empresários e impulsione seu negócio com nossa rede.</p>
        </div>
        <Link to="/contatos" className="btn-cta">Quero me associar →</Link>
      </section>

    </main>
    </>
  );
}