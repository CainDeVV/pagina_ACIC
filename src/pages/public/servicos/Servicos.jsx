import { Link } from 'react-router-dom';
import { servicosMock } from '../../../mocks/servicosMock';
import HeroSlider from '../../../components/HeroSlider/HeroSlider'; // Importamos o novo componente
import '../../../styles/servicos.css';

function Servicos() {

  // Formatamos os dados do Mock para o formato que o HeroSlider exige
  const sliderData = servicosMock.map((servico) => ({
    id: servico.id,
    image: servico.bannerUrl,
    pill: "Serviços",
    title: servico.titulo,
    description: servico.resumo,
    link: `/servicos/${servico.slug}` // Faz o texto ser clicável!
  }));

  return (
    <div className="servicos-page">
      
      {/* Agora o Slider inteiro se resume a 1 linha de código! */}
      <HeroSlider slides={sliderData} autoPlayTime={5000} />

      {/* Grade de Todos os Serviços */}
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