import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { servicosMock } from '../../../mocks/servicosMock';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../../../styles/servicos.css';

function Servicos() {
  const [slideAtual, setSlideAtual] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideAtual((prev) => (prev + 1) % servicosMock.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slideAtual]); // Reseta o tempo a cada mudança manual

  const servicoInfo = servicosMock[slideAtual];

  const proximoSlide = () => {
    setSlideAtual((prev) => (prev + 1) % servicosMock.length);
  };

  const slideAnterior = () => {
    setSlideAtual((prev) => (prev - 1 + servicosMock.length) % servicosMock.length);
  };

  return (
    <div className="servicos-page">
      
      {/* Slider Superior */}
      <div className="servicos-slider">
        
        {servicosMock.map((servico, index) => (
          <img 
            key={servico.id}
            src={servico.bannerUrl} 
            alt={servico.titulo} 
            className={`slider-bg-image ${index === slideAtual ? 'active' : ''}`}
          />
        ))}

        {/* TEXTO Clicável sobre a imagem */}
        <Link to={`/servicos/${servicoInfo.slug}`} className="slider-text-overlay">
          <span className="slider-pill">Serviços</span>
          <h2>{servicoInfo.titulo}</h2>
          <p>{servicoInfo.resumo}</p>
        </Link>
        
        {/* Controles do Slider (Setas) */}
        <div className="slider-controls">
          <button className="slider-btn" onClick={slideAnterior}>
            <FaChevronLeft />
          </button>
          <button className="slider-btn" onClick={proximoSlide}>
            <FaChevronRight />
          </button>
        </div>

        {/* Barrinhas centrais (Indicadores) */}
        <div className="slider-indicators">
          {servicosMock.map((_, index) => (
            <button 
              key={index}
              className={`indicator-bar ${index === slideAtual ? 'active' : ''}`}
              onClick={() => setSlideAtual(index)}
              aria-label={`Ir para o slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Grade de Todos os Serviços (Título Removido) */}
      <div className="servicos-container">
        <div className="servicos-grid">
          {servicosMock.map((servico) => (
            <Link to={`/servicos/${servico.slug}`} className="servico-card" key={servico.id}>
              <img src={servico.cardUrl} alt={servico.titulo} />
              <div className="servico-card-content">
                <h3>{servico.titulo}</h3>
                <p>{servico.resumo}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Servicos;