import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { noticiasService } from '@/services/noticiasService';
import ContentListLayout from '@/components/Layout/ContentListLayout';
import { NewsCard } from '@/components/Card';

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
    <>
      <Helmet>
        <title>Notícias e Atualizações | ACIC Crateús</title>
        <meta name="description" content="Acompanhe as últimas notícias, projetos e atualizações da Associação Comercial e Industrial de Crateús." />
      </Helmet>
      <ContentListLayout
        title="Notícias ACIC"
        description="Fique por dentro das últimas novidades e ações da nossa associação."
        carregando={carregando}
        sliderData={sliderData}
        sections={sections}
        basePath="/noticias"
        renderItem={(item) => <NewsCard key={item.id} noticia={item} variant="grid" />}
      />
    </>
  );
}

export default Noticias;
