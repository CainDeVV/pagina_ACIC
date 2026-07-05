import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import { servicosService } from '../../../services/servicosService';
import { CONTENT_STATUS } from '../../../constants/status';
import HeroSlider from '../../../components/HeroSlider/HeroSlider';
import ServiceCard from '../../../components/ServiceCard/ServiceCard';
import './Servicos.css';

function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarServicos() {
      try {
        const dados = await servicosService.buscarTodos();
        const servicosPublicos = (dados || []).filter(s => s.status === CONTENT_STATUS.PUBLISHED);
        setServicos(servicosPublicos);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarServicos();
  }, []);

  if (carregando) {
    return (
      <div className="servicos-page" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <p>Carregando serviços...</p>
      </div>
    );
  }

  // Filtra os serviços para o Slider e prepara o objeto
  const servicosDestaque = servicos.filter(s => s.destaque);
  const servicosParaSlider = servicosDestaque.length > 0 ? servicosDestaque : servicos;

  const sliderData = servicosParaSlider.map((servico) => ({
    id: servico.id,
    image: servico.imageUrl || 'https://placehold.co/1200x400?text=Banner',
    badge: "Serviços",
    badgeStyle: "white",
    title: servico.title,
    description: servico.summary,
    link: `/servicos/${servico.slug}` 
  }));

  return (
    <>
    <Helmet>
      <title>Serviços | ACIC</title>
    </Helmet>
    <div className="servicos-page">
      {sliderData.length > 0 && <HeroSlider slides={sliderData} autoPlayTime={5000} />}

      <div className="servicos-container">
        <div className="servicos-grid">
          {servicos.length > 0 ? (
            servicos.map(servico => (
              <ServiceCard key={servico.id} service={servico} />
            ))
          ) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--color-gray-medium)' }}>
              Nenhum serviço cadastrado no banco de dados no momento.
            </p>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default Servicos;