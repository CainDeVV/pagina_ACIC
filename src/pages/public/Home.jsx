import { useState, useEffect } from 'react';
import { slidesMock, quemSomosMock, presidentesMock, eventosHomeMock } from '../../mocks/homeMock';
import '../../styles/home.css';

function Home() {
  const [slideAtual, setSlideAtual] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideAtual((prev) => (prev + 1) % slidesMock.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main>
      {/* SEÇÃO 1: SLIDE PRINCIPAL  */}
      <section className="slide-container">
        <div className="slide-item fade-animacao">
          <img 
            src={slidesMock[slideAtual].imagem_url} 
            alt={slidesMock[slideAtual].titulo} 
          />
          <div className="slide-caption">
            <h2>{slidesMock[slideAtual].titulo}</h2>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: QUEM SOMOS  */}
      <section className="secao-quem-somos">
        <h2 className="hashtag-titulo">#SOMOS<span>ASIC</span></h2>
        
        <h3 className="texto-destaque">
          A maior organização multissetorial da região, que reúne empresários de todos os setores da economia, como comércio, indústria, agropecuária e serviços, de empresas de todos os portes e profissionais liberais.
        </h3>
        
        <p className="texto-resumo">
          {quemSomosMock.resumo}
        </p>
        
        <button className="btn-saiba-mais">
          &#8594; Saiba mais
        </button>
      </section>

      {/* SEÇÃO 3: DIRETORIA  */}
      <section className="bg-cinza">
        <h2>Nossa Diretoria</h2>
        <div className="lista-cards">
          {presidentesMock.map((presidente) => (
            <div className="card" key={presidente.id}>
              <div className="card-img-container">
                <img src={presidente.imagem_url} alt={presidente.nome} />
              </div>
              <h3>{presidente.nome}</h3>
              <p className="cargo-destaque"><strong>{presidente.cargo}</strong></p>
              <button className="btn-saiba-mais">Ver Biografia</button>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO 4: EVENTOS (AGENDA PÚBLICA) */}
      <section className="secao-eventos">
        <div className="cabecalho-secao">
          <h2>Eventos</h2>
          <button className="btn-vazado">Ver todos &#8594;</button>
        </div>
        
        <div className="lista-eventos-horizontal">
          {eventosHomeMock.map((evento) => (
            <div className="evento-barra" key={evento.id}>
              <div className="evento-data">
                <span className="icone-calendario"></span>
                <strong>{evento.data_hora.split(' - ')[0]}</strong> {/* Pega só a data */}
              </div>
              <div className="evento-titulo-bloco">
                <h3>{evento.titulo}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;