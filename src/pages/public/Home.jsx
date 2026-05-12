import { useState, useEffect } from 'react';
import HeroSlider from '../../components/HeroSlider/HeroSlider'; // <-- Importamos aqui

/* ─── MOCK DATA ─── */
const slidesMock = [
  { id: 1, titulo: 'Fortalecendo o comércio de Crateús', subtitulo: 'Há décadas unindo empresários e impulsionando a economia regional', imagem_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80' },
  { id: 2, titulo: 'Conectando empresários de todos os setores', subtitulo: 'Comércio, indústria, agropecuária e serviços em um só lugar', imagem_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=80' },
  { id: 3, titulo: 'Sua voz no desenvolvimento regional', subtitulo: 'Representação política e institucional para o empresário cearense', imagem_url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1400&q=80' },
];

const numerosMock = [
  { valor: '+500', label: 'Empresas associadas' },
  { valor: '40+', label: 'Anos de atuação' },
  { valor: '12', label: 'Municípios atendidos' },
  { valor: '200+', label: 'Eventos realizados' },
];

const servicosMock = [
  { id: 1, icone: '🏛️', titulo: 'Representação Institucional', descricao: 'Atuamos junto a órgãos públicos defendendo os interesses dos associados.' },
  { id: 2, icone: '📜', titulo: 'Certificado Digital', descricao: 'Emissão de certificado digital com atendimento ágil e suporte especializado.' },
  { id: 3, icone: '⚖️', titulo: 'Mediação Empresarial', descricao: 'Resolução de conflitos de forma rápida, sigilosa e econômica.' },
  { id: 4, icone: '📊', titulo: 'Capacitação & Cursos', descricao: 'Treinamentos e workshops para qualificar equipes e gestores.' },
  { id: 5, icone: '🤝', titulo: 'Networking', descricao: 'Eventos e encontros para ampliar sua rede de contatos empresariais.' },
  { id: 6, icone: '🔍', titulo: 'Análise de Crédito', descricao: 'Consulta e proteção ao crédito para empresas e profissionais.' },
];

const presidentesMock = [
  { id: 1, nome: 'João Silva', cargo: 'Presidente', imagem_url: 'https://i.pravatar.cc/300?img=11' },
  { id: 2, nome: 'Maria Souza', cargo: '1ª Vice-Presidente', imagem_url: 'https://i.pravatar.cc/300?img=5' },
  { id: 3, nome: 'Carlos Melo', cargo: '2º Vice-Presidente', imagem_url: 'https://i.pravatar.cc/300?img=12' },
  { id: 4, nome: 'Ana Ferreira', cargo: 'Diretora Financeira', imagem_url: 'https://i.pravatar.cc/300?img=9' },
];

const eventosMock = [
  { id: 1, titulo: 'Café Empresarial — Networking & Negócios', data: '14 Mai 2025', hora: '08h00', local: 'Sede ACIC' },
  { id: 2, titulo: 'Palestra: Tributação para Pequenas Empresas', data: '21 Mai 2025', hora: '19h00', local: 'Auditório ACIC' },
  { id: 3, titulo: 'Feira de Negócios do Sertão Central', data: '05 Jun 2025', hora: '09h00', local: 'Centro de Eventos' },
];

const noticiasMock = [
  { id: 1, categoria: 'Economia', titulo: 'ACIC participa de reunião com secretaria estadual sobre desenvolvimento regional', data: '07 Mai 2025', imagem_url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=70' },
  { id: 2, categoria: 'Eventos', titulo: 'Café empresarial reúne mais de 80 associados em encontro de networking', data: '02 Mai 2025', imagem_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=70' },
  { id: 3, categoria: 'Associados', titulo: 'Novo programa de benefícios é lançado para empresas do setor de serviços', data: '28 Abr 2025', imagem_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=70' },
];
/* ─────────────────────────────────────────────────────── */

const BLUE = '#1A5FA8';
const BLUE_DARK = '#0E3F72';
const GOLD = '#F5A500';
const TEAL = '#1A8A6E';
const TEAL_LIGHT = '#E6F5F1';
const BLUE_LIGHT = '#EBF3FB';
const GRAY_BG = '#F5F6F8';
const TEXT = '#1A1A2E';
const TEXT_MUTED = '#5A6172';

// Retirei todo o CSS do ".hero" pois o componente HeroSlider assume o controle!
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .acic-home {
    font-family: 'Inter', sans-serif;
    color: ${TEXT};
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* ── NÚMEROS ── */
  .secao-numeros {
    background: ${BLUE_DARK};
    padding: 40px 6%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0;
  }
  .numero-item {
    text-align: center;
    padding: 24px 16px;
    border-right: 1px solid rgba(255,255,255,0.12);
  }
  .numero-item:last-child { border-right: none; }
  .numero-valor {
    font-family: 'Sora', sans-serif;
    font-size: 38px;
    font-weight: 800;
    color: ${GOLD};
    line-height: 1;
    margin-bottom: 6px;
  }
  .numero-label {
    font-size: 13px;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.3px;
  }

  /* ── QUEM SOMOS ── */
  .secao-quem-somos {
    background: #fff;
    padding: 80px 6%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
  }
  .qs-visual { position: relative; }
  .qs-img { width: 100%; height: 380px; object-fit: cover; border-radius: 12px; }
  .qs-tag {
    position: absolute; bottom: -20px; right: -20px; background: ${GOLD};
    color: #5C3A00; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700;
    padding: 18px 24px; border-radius: 10px; line-height: 1.4; box-shadow: 0 8px 24px rgba(245,165,0,0.35);
  }
  .qs-tag span { font-size: 28px; font-weight: 800; display: block; }
  .qs-texto { padding-right: 16px; }
  .secao-label {
    display: flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; color: ${TEAL}; margin-bottom: 16px;
  }
  .secao-label::before { content: ''; display: block; width: 32px; height: 3px; background: ${TEAL}; border-radius: 2px; }
  .qs-texto h2 { font-family: 'Sora', sans-serif; font-size: 32px; font-weight: 800; color: ${TEXT}; line-height: 1.25; margin-bottom: 20px; }
  .qs-texto h2 span { color: ${BLUE}; }
  .qs-texto p { font-size: 15px; color: ${TEXT_MUTED}; margin-bottom: 28px; }
  .btn-azul { background: ${BLUE}; color: #fff; font-weight: 600; font-size: 14px; padding: 13px 28px; border-radius: 6px; border: none; cursor: pointer; transition: background 0.15s; }
  .btn-azul:hover { background: ${BLUE_DARK}; }

  /* ── SERVIÇOS ── */
  .secao-servicos { background: ${GRAY_BG}; padding: 80px 6%; }
  .secao-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; flex-wrap: wrap; gap: 16px; }
  .secao-header h2 { font-family: 'Sora', sans-serif; font-size: 28px; font-weight: 800; color: ${TEXT}; }
  .btn-link { background: none; border: none; color: ${BLUE}; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 6px; }
  .btn-link:hover { text-decoration: underline; }
  .grid-servicos { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
  .card-servico { background: #fff; border-radius: 12px; padding: 28px 24px; border: 1px solid #E8EAF0; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; cursor: default; }
  .card-servico:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(26,95,168,0.1); border-color: ${BLUE}; }
  .servico-icone { width: 52px; height: 52px; background: ${BLUE_LIGHT}; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px; }
  .card-servico h3 { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; color: ${TEXT}; margin-bottom: 8px; }
  .card-servico p { font-size: 13px; color: ${TEXT_MUTED}; line-height: 1.6; }

  /* ── DIRETORIA ── */
  .secao-diretoria { background: ${BLUE_DARK}; padding: 80px 6%; }
  .secao-diretoria .secao-label { color: ${GOLD}; }
  .secao-diretoria .secao-label::before { background: ${GOLD}; }
  .secao-diretoria h2 { font-family: 'Sora', sans-serif; font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 40px; }
  .grid-diretoria { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; }
  .card-membro { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; overflow: hidden; transition: background 0.2s; }
  .card-membro:hover { background: rgba(255,255,255,0.11); }
  .card-membro img { width: 100%; height: 220px; object-fit: cover; object-position: top; display: block; }
  .card-membro-info { padding: 18px 20px; border-top: 3px solid ${GOLD}; }
  .card-membro h3 { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .cargo-badge { font-size: 12px; color: ${GOLD}; font-weight: 600; letter-spacing: 0.3px; }

  /* ── EVENTOS + NOTÍCIAS ── */
  .secao-en { background: #fff; padding: 80px 6%; display: grid; grid-template-columns: 1fr 1.5fr; gap: 60px; align-items: start; }
  .col-eventos h2 { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 24px; color: ${TEXT}; }
  .evento-item { display: flex; gap: 16px; padding: 18px 0; border-bottom: 1px solid #EAECF0; align-items: flex-start; }
  .evento-item:last-child { border-bottom: none; }
  .evento-data-box { flex-shrink: 0; width: 52px; height: 58px; background: ${BLUE_LIGHT}; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-top: 3px solid ${BLUE}; }
  .evento-dia { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 800; color: ${BLUE}; line-height: 1; }
  .evento-mes { font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${BLUE}; letter-spacing: 0.5px; }
  .evento-info h3 { font-size: 14px; font-weight: 600; color: ${TEXT}; margin-bottom: 4px; line-height: 1.4; }
  .evento-meta { font-size: 12px; color: ${TEXT_MUTED}; display: flex; gap: 10px; }
  .col-noticias h2 { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 24px; color: ${TEXT}; }
  .lista-noticias { display: flex; flex-direction: column; gap: 16px; }
  .card-noticia { display: flex; gap: 16px; align-items: center; cursor: pointer; padding: 12px; border-radius: 10px; border: 1px solid transparent; transition: border-color 0.2s, background 0.2s; }
  .card-noticia:hover { border-color: #E0E7F0; background: ${GRAY_BG}; }
  .noticia-img { width: 96px; height: 72px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
  .noticia-cat { display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${TEAL}; background: ${TEAL_LIGHT}; padding: 2px 8px; border-radius: 20px; margin-bottom: 6px; }
  .card-noticia h3 { font-size: 13px; font-weight: 600; color: ${TEXT}; line-height: 1.45; margin-bottom: 4px; }
  .noticia-data { font-size: 11px; color: ${TEXT_MUTED}; }

  /* ── FAIXA ASSOCIE-SE ── */
  .secao-cta { background: ${TEAL}; padding: 60px 6%; display: flex; justify-content: space-between; align-items: center; gap: 32px; flex-wrap: wrap; }
  .cta-texto h2 { font-family: 'Sora', sans-serif; font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 8px; }
  .cta-texto p { color: rgba(255,255,255,0.85); font-size: 15px; }
  .btn-cta { background: #fff; color: ${TEAL}; font-family: 'Sora', sans-serif; font-weight: 700; font-size: 15px; padding: 15px 36px; border-radius: 8px; border: none; cursor: pointer; flex-shrink: 0; transition: transform 0.15s, box-shadow 0.15s; }
  .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }

  @media (max-width: 768px) {
    .secao-quem-somos, .secao-en { grid-template-columns: 1fr; }
    .qs-visual { display: none; }
    .secao-numeros { grid-template-columns: repeat(2, 1fr); }
    .numero-item:nth-child(2) { border-right: none; }
    .numero-item:nth-child(1), .numero-item:nth-child(2) { border-bottom: 1px solid rgba(255,255,255,0.12); }
  }
`;

function parseEventoData(dataStr) {
  const parts = dataStr.split(' ');
  return { dia: parts[0], mes: parts[1] };
}

export default function Home() {

  // Transforma o array antigo do colega no formato exigido pelo nosso novo HeroSlider
  const homeSliderData = slidesMock.map((slide) => ({
    id: slide.id,
    image: slide.imagem_url,
    badge: "● ACIC — Crateús, CE",
    badgeStyle: "gold", // Ativa o selo dourado!
    title: slide.titulo,
    description: slide.subtitulo,
    // Botões que apareciam antes estaticamente
    buttons: [
      { label: "Associe-se →", link: "/contatos", type: "primary" },
      { label: "Conheça a ACIC", link: "/quem-somos", type: "outline" }
    ]
  }));

  return (
    <>
      <style>{css}</style>
      <main className="acic-home">

        {/* ── NOVO HERO CENTRALIZADO ── 
            - titleAsH1 garante o SEO perfeito (o título renderiza como <h1>)
        */}
        <HeroSlider 
          slides={homeSliderData} 
          autoPlayTime={5500} 
          titleAsH1={true} 
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
            <button className="btn-azul">Saiba mais sobre a ACIC →</button>
          </div>
        </section>

        {/* ── SERVIÇOS ── */}
        <section className="secao-servicos">
          <div className="secao-header">
            <div>
              <div className="secao-label">Para associados</div>
              <h2>Nossos serviços</h2>
            </div>
            <button className="btn-link">Ver todos os serviços →</button>
          </div>
          <div className="grid-servicos">
            {servicosMock.map(s => (
              <div className="card-servico" key={s.id}>
                <div className="servico-icone">{s.icone}</div>
                <h3>{s.titulo}</h3>
                <p>{s.descricao}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── DIRETORIA ── */}
        <section className="secao-diretoria">
          <div className="secao-label">Gestão 2023–2025</div>
          <h2>Nossa Diretoria</h2>
          <div className="grid-diretoria">
            {presidentesMock.map(p => (
              <div className="card-membro" key={p.id}>
                <img src={p.imagem_url} alt={p.nome} />
                <div className="card-membro-info">
                  <h3>{p.nome}</h3>
                  <div className="cargo-badge">{p.cargo}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── EVENTOS + NOTÍCIAS ── */}
        <section className="secao-en">
          <div className="col-eventos">
            <div className="secao-label">Agenda</div>
            <h2>Próximos Eventos</h2>
            {eventosMock.map(e => {
              const { dia, mes } = parseEventoData(e.data);
              return (
                <div className="evento-item" key={e.id}>
                  <div className="evento-data-box">
                    <span className="evento-dia">{dia}</span>
                    <span className="evento-mes">{mes}</span>
                  </div>
                  <div className="evento-info">
                    <h3>{e.titulo}</h3>
                    <div className="evento-meta">
                      <span>🕐 {e.hora}</span>
                      <span>📍 {e.local}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <br />
            <button className="btn-link">Ver todos os eventos →</button>
          </div>

          <div className="col-noticias">
            <div className="secao-label">Comunicação</div>
            <h2>Últimas Notícias</h2>
            <div className="lista-noticias">
              {noticiasMock.map(n => (
                <div className="card-noticia" key={n.id}>
                  <img className="noticia-img" src={n.imagem_url} alt={n.titulo} />
                  <div>
                    <span className="noticia-cat">{n.categoria}</span>
                    <h3>{n.titulo}</h3>
                    <div className="noticia-data">{n.data}</div>
                  </div>
                </div>
              ))}
            </div>
            <br />
            <button className="btn-link">Ver todas as notícias →</button>
          </div>
        </section>

        {/* ── CTA ASSOCIE-SE ── */}
        <section className="secao-cta">
          <div className="cta-texto">
            <h2>Faça parte da ACIC</h2>
            <p>Junte-se a centenas de empresários e impulsione seu negócio com nossa rede.</p>
          </div>
          <button className="btn-cta">Quero me associar →</button>
        </section>

      </main>
    </>
  );
}