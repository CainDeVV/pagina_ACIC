import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { eventosService } from '@/services/eventosService';
import categoriasService from '@/services/categoriasService';
import ContentListLayout from '@/components/Layout/ContentListLayout';
import PublicSearchFilter from '@/components/Layout/PublicSearchFilter';
import { EventCard } from '@/components/Card';
import { getEventBadge } from '@/utils/eventUtils';

function Eventos() {
  const [sections, setSections] = useState([]);
  const [sliderData, setSliderData] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [categoriasAtivas, setCategoriasAtivas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');

  // Busca inicial das categorias
  useEffect(() => {
    categoriasService.buscarAtivas().then(setCategoriasAtivas).catch(console.error);
  }, []);

  // Debounce para o input de busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    async function carregarEventos() {
      setCarregando(true);
      try {
        const params = {
          limit: 20
        };
        
        if (debouncedSearch) params.search = debouncedSearch;
        if (selectedCategoria) params.categoriasIds = [selectedCategoria];

        const payload = await eventosService.buscarTodosPublico(params);
        const eventosPublicos = payload.data || [];
        
        const destaques = eventosPublicos.filter(e => e.destaque === true);
        const naoDestaques = eventosPublicos.filter(e => e.destaque !== true);
        
        const futuros = naoDestaques.filter(e => getEventBadge(e) === 'Em Breve');
        const acontecendo = naoDestaques.filter(e => getEventBadge(e) === 'Acontecendo');
        const passados = naoDestaques.filter(e => getEventBadge(e) === 'Realizado');
        const cancelados = naoDestaques.filter(e => getEventBadge(e) === 'Cancelado');

        acontecendo.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
        futuros.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
        passados.sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt));
        cancelados.sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt));

        const eventosParaSlider = destaques.length > 0 ? destaques : acontecendo.length > 0 ? acontecendo : futuros.length > 0 ? futuros : passados;
        
        setSliderData(eventosParaSlider.slice(0, 4).map((evento) => ({
          id: evento.id,
          image: evento.coverImage || 'https://placehold.co/1200x400?text=Banner+do+Evento',
          badge: "Eventos",
          badgeStyle: "white",
          title: evento.title,
          description: evento.location ? `📍 ${evento.location}` : 'Fique por dentro das novidades e acontecimentos da ACIC Crateús',
          link: `/eventos/${evento.slug}` 
        })));

        if (debouncedSearch || selectedCategoria) {
          setSections([
            { title: "Resultados (Destaques)", items: destaques, type: "event" },
            { title: "Resultados (Acontecendo Agora)", items: acontecendo, type: "event" },
            { title: "Resultados (Próximos Eventos)", items: futuros, type: "event" },
            { title: "Resultados (Eventos Anteriores)", items: passados, type: "event" }
          ].filter(sec => sec.items.length > 0));
        } else {
          setSections([
            { title: "Em Destaque", items: destaques, type: "events" },
            { title: "Acontecendo Agora", items: acontecendo, type: "events" },
            { title: "Próximos Eventos", items: futuros, type: "events" },
            { title: "Eventos Anteriores", items: passados, type: "events" },
            { title: "Eventos Cancelados", items: cancelados, type: "event" }
          ].filter(sec => sec.items.length > 0));
        }

      } catch (error) {
        console.error("Erro ao carregar os eventos:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarEventos();
  }, [debouncedSearch, selectedCategoria]);

  return (
    <>
      <Helmet>
        <title>Eventos ACIC | Feiras, Cursos e Networking</title>
        <meta name="description" content="Participe dos eventos promovidos pela ACIC Crateús. Feiras de negócios, cursos, capacitações e muito networking para você e sua empresa." />
      </Helmet>

      <ContentListLayout 
        pageTitle={debouncedSearch || selectedCategoria ? "Resultados da Busca" : "Eventos"}
        loading={carregando}
        sliderData={(!debouncedSearch && !selectedCategoria) ? sliderData : []}
        sections={sections}
        emptyMessage="Nenhum evento disponível no momento."
        renderItem={(item) => <EventCard key={item.id} evento={item} variant="grid" />}
      >
        <PublicSearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoriasAtivas={categoriasAtivas}
          selectedCategoria={selectedCategoria}
          setSelectedCategoria={setSelectedCategoria}
          placeholder="Buscar eventos por título ou local..."
        />
      </ContentListLayout>
    </>
  );
}

export default Eventos;