import { Helmet } from 'react-helmet-async';
import HeroSlider from '../HeroSlider/HeroSlider';
import './ContentListLayout.css';

const ContentListLayout = ({ 
  pageTitle, 
  sliderData = [], 
  sections = [], 
  renderItem,
  loading = false, 
  emptyMessage = "Nenhum conteúdo disponível no momento." 
}) => {

  if (loading) {
    return (
      <div className="content-list-page">
        <Helmet>
          <title>{pageTitle} | ACIC</title>
        </Helmet>
        <div className="content-list-vazio">
          <p>Carregando {pageTitle.toLowerCase()}...</p>
        </div>
      </div>
    );
  }

  const hasContent = sections.some(section => section.items && section.items.length > 0);

  return (
    <div className="content-list-page">
      <Helmet>
        <title>{pageTitle ? `${pageTitle} | ACIC` : 'ACIC'}</title>
      </Helmet> 

      {sliderData.length > 0 && <HeroSlider slides={sliderData} autoPlayTime={5000} />}

        <div className="content-list-container">
          {sections.map((section, idx) => {
            if (!section.items || section.items.length === 0) return null;

            return (
              <section key={idx} className="content-lista-section">
                <h2 className="content-section-titulo">{section.title}</h2>
                <div className="content-grid-moderno">
                  {section.items.map((item) => renderItem(item))}
                </div>
              </section>
            );
          })}

          {!hasContent && (
            <div className="content-list-vazio">
              <p>{emptyMessage}</p>
            </div>
          )}
        </div>
      </div>
  );
};

export default ContentListLayout;
