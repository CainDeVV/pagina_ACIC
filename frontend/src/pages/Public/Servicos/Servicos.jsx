import { Link } from 'react-router-dom';
import { servicosMock } from '../../../mocks/servicosMock';
import HeroSlider from '../../../components/HeroSlider/HeroSlider';
import ServiceCard from '../../../components/ServiceCard/ServiceCard';
import './Servicos.css';

function Servicos() {

  // 1. Filtra apenas os serviços marcados como destaque
  // (Caso nenhum esteja como destaque no Mock, exibimos todos temporariamente para não quebrar a tela)
  const servicosDestaque = servicosMock.filter(s => s.destaque);
  const servicosParaSlider = servicosDestaque.length > 0 ? servicosDestaque : servicosMock;

  const sliderData = servicosMock.map((servico) => ({
    id: servico.id,
    image: servico.bannerUrl,
    badge: "Serviços",
    badgeStyle: "white", // Passamos o estilo branco para os Serviços
    title: servico.titulo,
    description: servico.resumo,
    link: `/servicos/${servico.slug}` 
  }));

  return (
    <div className="servicos-page">
      <HeroSlider slides={sliderData} autoPlayTime={5000} />

      <div className="servicos-container">
        <div className="servicos-grid">
          {servicosMock.map(servico => (
            <ServiceCard key={servico.id} service={servico} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Servicos;