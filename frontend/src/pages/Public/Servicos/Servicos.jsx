import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { servicosMock } from '../../../mocks/servicosMock';
import HeroSlider from '../../../components/HeroSlider/HeroSlider';
import ServiceCard from '../../../components/ServiceCard/ServiceCard';
import './Servicos.css';

function Servicos() {

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
    <>
    <Helmet>
      <title>Serviços | ACIC</title>
    </Helmet>
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
    </>
  );
}

export default Servicos;