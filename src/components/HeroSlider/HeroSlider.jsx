import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './HeroSlider.css';

/**
 * Componente Reutilizável de Slider
 * @param {Array} slides - Array de objetos: { id, image, pill, title, description, link }
 * @param {Number} autoPlayTime - Tempo de transição em ms (padrão: 5000)
 */
function HeroSlider({ slides, autoPlayTime = 5000 }) {
  const [slideAtual, setSlideAtual] = useState(0);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const timer = setInterval(() => {
      setSlideAtual((prev) => (prev + 1) % slides.length);
    }, autoPlayTime);
    return () => clearInterval(timer);
  }, [slideAtual, slides, autoPlayTime]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[slideAtual];

  const proximoSlide = () => {
    setSlideAtual((prev) => (prev + 1) % slides.length);
  };

  const slideAnterior = () => {
    setSlideAtual((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Renderiza o conteúdo do texto. Se tiver link, usa o <Link>, se não, usa uma <div>
  const renderContent = () => {
    const innerContent = (
      <>
        {currentSlide.pill && <span className="hero-slider-pill">{currentSlide.pill}</span>}
        <h2>{currentSlide.title}</h2>
        {currentSlide.description && <p>{currentSlide.description}</p>}
      </>
    );

    if (currentSlide.link) {
      return (
        <Link to={currentSlide.link} className="hero-slider-content">
          {innerContent}
        </Link>
      );
    }

    return <div className="hero-slider-content">{innerContent}</div>;
  };

  return (
    <div className="hero-slider-wrapper">
      
      {/* Imagens (Crossfade) */}
      {slides.map((slide, index) => (
        <img 
          key={slide.id}
          src={slide.image} 
          alt={slide.title} 
          className={`hero-slider-bg ${index === slideAtual ? 'active' : ''}`}
        />
      ))}

      {/* Conteúdo de Texto */}
      {renderContent()}

      {/* Controles (Setas) */}
      <div className="hero-slider-controls">
        <button className="hero-slider-btn" onClick={slideAnterior}>
          <FaChevronLeft />
        </button>
        <button className="hero-slider-btn" onClick={proximoSlide}>
          <FaChevronRight />
        </button>
      </div>

      {/* Indicadores (Barrinhas) */}
      <div className="hero-slider-indicators">
        {slides.map((_, index) => (
          <button 
            key={index}
            className={`hero-indicator ${index === slideAtual ? 'active' : ''}`}
            onClick={() => setSlideAtual(index)}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
}

export default HeroSlider;