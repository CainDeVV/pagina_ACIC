import { useState, useEffect } from 'react';
import { noticiasService } from '../../../services/noticiasService';
import ContentListLayout from '../../../components/Layout/ContentListLayout';

function Noticias() {
  const [sections, setSections] = useState([]);
  const [sliderData, setSliderData] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarNoticias() {
      try {
        const payload = await noticiasService.buscarTodosPublico();
        const noticiasPublicas = payload.data || [];

        // Separar Destaques
        const destaques = noticiasPublicas.filter(n => n.destaque === true);
        const ultimas = noticiasPublicas.filter(n => n.destaque !== true);

        // Slider prioriza destaques
        const noticiasParaSlider = destaques.length > 0 ? destaques : ultimas;

        setSliderData(noticiasParaSlider.slice(0, 4).map((noticia) => ({
          id: noticia.id,
          image: noticia.coverImage || 'https://placehold.co/1200x400?text=Notícia+ACIC',
          badge: "Notícias",
          badgeStyle: "white",
          title: noticia.title,
          description: noticia.summary || 'Leia as principais informações do nosso portal',
          link: `/noticias/${noticia.slug}`
        })));

        setSections([
          { title: "Em Destaque", items: destaques, type: "news" },
          { title: "Últimas Notícias", items: ultimas, type: "news" }
        ]);

      } catch (error) {
        console.error("Erro ao carregar notícias:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarNoticias();
  }, []);

  return (
    <ContentListLayout 
      pageTitle="Notícias"
      loading={carregando}
      sliderData={sliderData}
      sections={sections}
      emptyMessage="Nenhuma notícia publicada no momento."
    />
  );
}

export default Noticias;
