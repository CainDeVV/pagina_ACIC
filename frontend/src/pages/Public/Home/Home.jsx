import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/* --- IMPORTAÇÃO DOS COMPONENTES REUTILIZÁVEIS --- */
import HeroSlider from '../../../components/HeroSlider/HeroSlider';
import ServiceCard from '../../../components/ServiceCard/ServiceCard';
import ContentCard from '../../../components/ContentCard/ContentCard';
import DirectorCard from '../../../components/DirectorCard/DirectorCard';
import { CONTENT_STATUS } from '../../../constants/status';

/* --- IMPORTAÇÃO DOS SERVIÇOS (API REAL) --- */
import { servicosService } from '../../../services/servicosService';
import { eventosService } from '../../../services/eventosService';
import { institucionalService } from '../../../services/institucionalService';
import { slidesService } from '../../../services/slidesService';
import { noticiasService } from '../../../services/noticiasService';

import './Home.css';

// Constante local para os números, já que o backend ainda não possui uma tabela para isso.
const NUMEROS_ESTATICOS = [
  { valor: '+500', label: 'Empresas associadas' },
  { valor: '40+', label: 'Anos de atuação' },
  { valor: '12', label: 'Municípios atendidos' },
  { valor: '200+', label: 'Eventos realizados' },
];

export default function Home() {
  const [slides, setSlides] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [diretoria, setDiretoria] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDadosDaHome() {
      try {
        // Dispara todas as requisições ao backend simultaneamente.
        // O .catch(() => []) garante que se um módulo (ex: Noticias) ainda não 
        // estiver pronto no backend, a Home não vai quebrar por inteiro.
        const [dadosSlides, dadosServicos, dadosDiretoria, dadosEventos, dadosNoticias] = await Promise.all([
          slidesService.buscarTodos().catch(() => []),
          servicosService.buscarTodos().catch(() => []),
          institucionalService.buscarDiretoria().catch(() => []),
          eventosService.buscarTodos().catch(() => []),
          noticiasService.buscarTodos().catch(() => [])
        ]);

        setSlides((dadosSlides || []).filter(s => s.status === CONTENT_STATUS.PUBLISHED));
        setServicos((dadosServicos || []).filter(s => s.status === CONTENT_STATUS.PUBLISHED));
        setEventos(dadosEventos || []);
        setNoticias(dadosNoticias || []);

        // O backend agrupa a diretoria por categoria. Para a Home, nós "desempacotamos"
        // essa lista para pegar apenas os 4 primeiros diretores no geral.
        const todosDiretores = (dadosDiretoria || []).flatMap(categoria => categoria.members);
        setDiretoria(todosDiretores.slice(0, 4));

      } catch (error) {
        console.error("Erro ao carregar os dados da Home:", error);
      } finally {
        setCarregando(false);
      }
    }
    
    carregarDadosDaHome();
  }, []);

  if (carregando) {
    return (
      <main className="acic-home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Carregando o portal ACIC...</p>
      </main>
    );
  }

  // ── PREPARAÇÃO DE DADOS PARA OS COMPONENTES ── 
  const homeSliderData = slides.map((slide) => ({
    id: slide.id,
    image: slide.imageUrl,
    badge: "● ACIC — Crateús, CE",
    badgeStyle: "gold", 
    title: slide.title,
    description: slide.subtitle,
    // Se o slide tiver linkUrl no banco, usa ele. Se não, usa os botões padrão da ACIC.
    buttons: slide.linkUrl ? [
      { label: "Saiba mais", link: slide.linkUrl, type: "primary" }
    ] : [
      { label: "Associe-se →", link: "/contatos", type: "primary" },
      { label: "Conheça a ACIC", link: "/quem-somos", type: "outline" }
    ]
  }));

  const homeServicos = servicos.slice(0, 6).map((servico, index) => {
    const iconesFallback = ['🏛️', '📜', '💻', '⚖️', '📊', '🤝'];
    return {
      ...servico,
      // Se não houver ícone cadastrado no banco, injetamos um visual padrão
      icon: servico.icon || iconesFallback[index] || '📌'
    };
  });

  // Lógica de Eventos na Home: Mostrar próximos, se não tiver mostrar os últimos realizados
  const agora = new Date();
  const eventosPublicos = eventos.filter(e => e.status !== CONTENT_STATUS.DRAFT);
  
  let proximosHome = eventosPublicos.filter(e => new Date(e.startsAt) > agora && e.status !== CONTENT_STATUS.FINISHED && e.status !== CONTENT_STATUS.CANCELLED);
  if (proximosHome.length > 0) {
    proximosHome.sort((a,b) => new Date(a.startsAt) - new Date(b.startsAt));
  } else {
    proximosHome = eventosPublicos.sort((a,b) => new Date(b.startsAt) - new Date(a.startsAt));
  }
  const homeEventos = proximosHome.slice(0, 3);

  // Lógica de Notícias na Home
  const noticiasPublicas = noticias.filter(n => n.status === CONTENT_STATUS.PUBLISHED);
  const homeNoticias = noticiasPublicas.slice(0, 3);

  return (
    <>
    <Helmet>
      <title>ACIC - Associação Comercial e Industrial de Crateús</title>
    </Helmet>
    <main className="acic-home">

      {/* ── HERO SLIDER ── */}
      {homeSliderData.length > 0 ? (
        <HeroSlider 
          slides={homeSliderData} 
          autoPlayTime={5500} 
          titleAsH1={true} 
          showControls={false}  
          indicatorStyle="gold"
        />
      ) : (
        <div style={{ height: '520px', background: 'var(--home-blue-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)' }}>
          <h1>Bem-vindo à ACIC Crateús</h1>
        </div>
      )}

      {/* ── NÚMEROS ── */}
      <section className="secao-numeros">
        {NUMEROS_ESTATICOS.map((n, i) => (
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
        
        {homeServicos.length > 0 ? (
          <div className="grid-servicos">
            {homeServicos.map(s => (
              <ServiceCard key={s.id} service={s} variant="simples" />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--home-text-muted)' }}>Nenhum serviço cadastrado no momento.</p>
        )}
      </section>

      {/* ── DIRETORIA ── */}
      <section className="secao-diretoria">
        <div className="secao-label">Gestão 2023–2025</div>
        <h2>Nossa Diretoria</h2>
        
        {diretoria.length > 0 ? (
          <div className="grid-diretoria">
            {diretoria.map(member => (
              <DirectorCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Nenhum membro da diretoria em destaque no momento.</p>
        )}
      </section>

      {/* ── EVENTOS + NOTÍCIAS ── */}
      <section className="secao-en">
        
        <div className="col-eventos">
          <div className="secao-label">Agenda</div>
          <h2>Próximos Eventos</h2>
          
          {homeEventos.length > 0 ? (
            <div className="lista-eventos">
              {homeEventos.map(e => (
                <ContentCard type="event" variant="compact" key={e.id} data={e} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--home-text-muted)' }}>Nenhum evento programado.</p>
          )}
          
          <Link to="/eventos" className="btn-link">Ver todos os eventos →</Link>
        </div>

        <div className="col-noticias">
          <div className="secao-label">Comunicação</div>
          <h2>Últimas Notícias</h2>
          
          {homeNoticias.length > 0 ? (
            <div className="lista-noticias">
              {homeNoticias.map(n => (
                <ContentCard type="news" variant="compact" key={n.id} data={n} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--home-text-muted)' }}>Nenhuma notícia publicada recentemente.</p>
          )}
          
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