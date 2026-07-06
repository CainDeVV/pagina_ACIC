import { useState, useEffect } from 'react';
import { eventosService } from '../../../services/eventosService';
import { CONTENT_STATUS } from '../../../constants/status';
import ContentListLayout from '../../../components/Layout/ContentListLayout';

function Eventos() {
  const [sections, setSections] = useState([]);
  const [sliderData, setSliderData] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarEventos() {
      try {
        const payload = await eventosService.buscarTodosPublico();
        const eventosPublicos = payload.data || [];
        
        const destaques = eventosPublicos.filter(e => e.destaque === true);
        
        const agora = new Date();
        const naoDestaques = eventosPublicos.filter(e => e.destaque !== true);
        
        const futuros = naoDestaques.filter(e => new Date(e.startsAt) > agora && e.status !== CONTENT_STATUS.FINISHED && e.status !== CONTENT_STATUS.CANCELLED);
        const passados = naoDestaques.filter(e => new Date(e.startsAt) <= agora || e.status === CONTENT_STATUS.FINISHED || e.status === CONTENT_STATUS.CANCELLED);

        futuros.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
        passados.sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt));

        const eventosParaSlider = destaques.length > 0 ? destaques : futuros.length > 0 ? futuros : passados;
        
        setSliderData(eventosParaSlider.slice(0, 4).map((evento) => ({
          id: evento.id,
          image: evento.coverImage || 'https://placehold.co/1200x400?text=Banner+do+Evento',
          badge: "Eventos",
          badgeStyle: "white",
          title: evento.title,
          description: evento.location ? `📍 ${evento.location}` : 'Fique por dentro das novidades e acontecimentos da ACIC Crateús',
          link: `/eventos/${evento.slug}` 
        })));

        setSections([
          { title: "Em Destaque", items: destaques, type: "event" },
          { title: "Próximos Eventos", items: futuros, type: "event" },
          { title: "Eventos Realizados", items: passados, type: "event" }
        ]);

      } catch (error) {
        console.error("Erro ao carregar os eventos:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarEventos();
  }, []);

  return (
    <ContentListLayout 
      pageTitle="Eventos"
      loading={carregando}
      sliderData={sliderData}
      sections={sections}
      emptyMessage="Nenhum evento disponível no momento."
    />
  );
}

export default Eventos;