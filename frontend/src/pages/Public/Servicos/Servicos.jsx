import { useState, useEffect } from 'react';
import { servicosService } from '@/services/servicosService';
import ContentListLayout from '@/components/Layout/ContentListLayout';
import ServiceCard from '@/components/ServiceCard/ServiceCard';

function Servicos() {
  const [sections, setSections] = useState([]);
  const [sliderData, setSliderData] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarServicos() {
      try {
        const payload = await servicosService.buscarTodosPublico();
        const servicosPublicos = payload.data || [];

        // Slider prioriza destaques
        const servicosDestaque = servicosPublicos.filter(s => s.destaque);
        const servicosParaSlider = servicosDestaque.length > 0 ? servicosDestaque : servicosPublicos;

        setSliderData(servicosParaSlider.map((servico) => ({
          id: servico.id,
          image: servico.imageUrl || 'https://placehold.co/1200x400?text=Banner',
          badge: "Serviços",
          badgeStyle: "white",
          title: servico.title,
          description: servico.summary,
          link: `/servicos/${servico.slug}` 
        })));

        setSections([
          { title: "Nossos Serviços", items: servicosPublicos, type: "service" }
        ]);

      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarServicos();
  }, []);

  return (
    <ContentListLayout 
      pageTitle="Serviços"
      loading={carregando}
      sliderData={sliderData}
      sections={sections}
      emptyMessage="Nenhum serviço disponível no momento."
      renderItem={(item) => <ServiceCard key={item.id} service={item} />}
    />
  );
}

export default Servicos;