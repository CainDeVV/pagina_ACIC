import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './HeroSlider.css';

/**
 * Componente Reutilizável de Slider
 * @param {Array} slides - [{ id, image, badge, badgeStyle, title, description, link, buttons }]
 * @param {Number} autoPlayTime - Tempo de transição em ms (padrão: 5000)
 * @param {Boolean} titleAsH1 - Define se o título usa a tag <h1> para SEO (ideal para a Home)
 * @param {Boolean} showControls - Exibe as setas laterais (padrão: true)
 */
function HeroSlider({ slides, autoPlayTime = 5000, titleAsH1 = false, showControls = true }) {
  const [slideAtual, setSlideAtual] = useState(0);
  const [imageFormats, setImageFormats] = useState({});

  const handleImageLoad = (id, e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (!naturalWidth || !naturalHeight) return;
    
    const ratio = naturalWidth / naturalHeight;
    // Banners bem largos (4:1, 3:1, ou 21:9) -> ratio >= 2.2
    // Imagens normais (16:9, quadradas) -> ratio < 2.2
    const format = ratio >= 2.2 ? 'panorama' : 'split';
    
    setImageFormats(prev => ({ ...prev, [id]: { format, ratio } }));
  };

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const timer = setInterval(() => {
      setSlideAtual((prev) => (prev + 1) % slides.length);
    }, autoPlayTime);
    return () => clearInterval(timer);
  }, [slideAtual, slides, autoPlayTime]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[slideAtual];
  const TitleTag = titleAsH1 ? 'h1' : 'h2';

  const proximoSlide = (e) => {
    e.preventDefault(); // Evita clicar no link do banner sem querer
    setSlideAtual((prev) => (prev + 1) % slides.length);
  };

  const slideAnterior = (e) => {
    e.preventDefault();
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

    if (currentSlide.link) {
      return (
        <Link to={currentSlide.link} className="hero-slider-content is-link">
          {innerContent}
        </Link>
      );
    }

    return <div className="hero-slider-content">{innerContent}</div>;
  };

  return (
    <div className="hero-slider-wrapper">
      {/* Crossfade das Imagens (Híbrido) */}
      {slides.map((slide, index) => {
        // Assume padrão 16:9 até carregar
        const slideData = imageFormats[slide.id] || { format: 'split', ratio: 1.77 };
        const { format, ratio } = slideData;
        const isActive = index === slideAtual ? 'active' : '';
        
        // A altura do slider no CSS é 520px. Calculamos a largura real da imagem na tela.
        const imgWidth = 520 * ratio;

        return (
          <div 
            key={slide.id} 
            className={`hero-slider-slide ${isActive} format-${format}`}
            style={{ '--img-width': `${imgWidth}px` }}
          >
            {format === 'split' && (
               <img src={slide.image} alt="" className="hero-slider-bg-blur" />
            )}
            
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="hero-slider-bg-main"
              onLoad={(e) => handleImageLoad(slide.id, e)}
            />
          </div>
        );
      })}

      {renderContent()}

      {/* NOVO: Condicional para exibir ou esconder as setinhas */}
      {showControls && (
        <div className="hero-slider-controls">
          <button className="hero-slider-btn" onClick={slideAnterior}><FaChevronLeft /></button>
          <button className="hero-slider-btn" onClick={proximoSlide}><FaChevronRight /></button>
        </div>
      )}

      {/* Indicadores (Barrinhas) sempre aparecem */}
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