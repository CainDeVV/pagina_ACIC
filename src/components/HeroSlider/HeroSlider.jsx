import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './HeroSlider.css';

/**
 * Componente Reutilizável de Slider
 * @param {Array} slides - [{ id, image, badge, badgeStyle, title, description, link, buttons: [{label, link, type}] }]
 * @param {Number} autoPlayTime - Tempo de transição em ms (padrão: 5000)
 * @param {Boolean} titleAsH1 - Define se o título usa a tag <h1> para SEO (ideal para a Home)
 */
function HeroSlider({ slides, autoPlayTime = 5000, titleAsH1 = false }) {
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
  const TitleTag = titleAsH1 ? 'h1' : 'h2'; // Define dinamicamente a tag do título

  const proximoSlide = () => {
    setSlideAtual((prev) => (prev + 1) % slides.length);
  };

  const slideAnterior = () => {
    setSlideAtual((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const renderContent = () => {
    const innerContent = (
      <>
        {currentSlide.badge && (
          <span className={`hero-slider-badge ${currentSlide.badgeStyle || 'white'}`}>
            {currentSlide.badge}
          </span>
        )}
        
        <TitleTag className="hero-slider-title">{currentSlide.title}</TitleTag>
        
        {currentSlide.description && <p className="hero-slider-desc">{currentSlide.description}</p>}
        
        {/* Se existirem botões (como na Home), renderiza eles aqui */}
        {currentSlide.buttons && currentSlide.buttons.length > 0 && (
          <div className="hero-slider-btns">
            {currentSlide.buttons.map((btn, idx) => (
              <Link key={idx} to={btn.link} className={`hero-btn hero-btn-${btn.type}`}>
                {btn.label}
              </Link>
            ))}
          </div>
        )}
      </>
    );

    // Se o slide inteiro for um link (como em Serviços), envelopamos tudo num <Link>
    if (currentSlide.link) {
      return (
        <Link to={currentSlide.link} className="hero-slider-content is-link">
          {innerContent}
        </Link>
      );
    }

    // Se não, é só um bloco de texto normal com botões dentro (como na Home)
    return <div className="hero-slider-content">{innerContent}</div>;
  };

  return (
    <div className="hero-slider-wrapper">
      {/* Crossfade das Imagens */}
      {slides.map((slide, index) => (
        <img 
          key={slide.id}
          src={slide.image} 
          alt={slide.title} 
          className={`hero-slider-bg ${index === slideAtual ? 'active' : ''}`}
        />
      ))}

      {renderContent()}

      {/* Controles e Indicadores */}
      <div className="hero-slider-controls">
        <button className="hero-slider-btn" onClick={slideAnterior}><FaChevronLeft /></button>
        <button className="hero-slider-btn" onClick={proximoSlide}><FaChevronRight /></button>
      </div>

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