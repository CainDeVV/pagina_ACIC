import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { noticiasService } from '@/services/noticiasService';
import categoriasService from '@/services/categoriasService';
import ContentListLayout from '@/components/Layout/ContentListLayout';
import PublicSearchFilter from '@/components/Layout/PublicSearchFilter';
import { NewsCard } from '@/components/Card';

function Noticias() {
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
    async function carregarNoticias() {
      setCarregando(true);
      try {
        const params = {
          limit: 20
        };
        
        if (debouncedSearch) params.search = debouncedSearch;
        if (selectedCategoria) params.categoriasIds = [selectedCategoria];

        const payload = await noticiasService.buscarTodosPublico(params);
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
          { title: debouncedSearch || selectedCategoria ? "Resultados da Busca" : "Em Destaque", items: destaques, type: "news" },
          { title: debouncedSearch || selectedCategoria ? "Outras Notícias" : "Últimas Notícias", items: ultimas, type: "news" }
        ].filter(sec => sec.items.length > 0));

      } catch (error) {
        console.error("Erro ao carregar notícias:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarNoticias();
  }, [debouncedSearch, selectedCategoria]);

  return (
    <>
      <Helmet>
        <title>Notícias e Atualizações | ACIC Crateús</title>
        <meta name="description" content="Acompanhe as últimas notícias, projetos e atualizações da Associação Comercial e Industrial de Crateús." />
      </Helmet>

      <ContentListLayout
        pageTitle={debouncedSearch || selectedCategoria ? "Resultados da Busca" : "Notícias ACIC"}
        loading={carregando}
        sliderData={(!debouncedSearch && !selectedCategoria) ? sliderData : []}
        sections={sections}
        emptyMessage="Nenhuma notícia disponível no momento."
        renderItem={(item) => <NewsCard key={item.id} noticia={item} variant="grid" />}
      >
        <PublicSearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoriasAtivas={categoriasAtivas}
          selectedCategoria={selectedCategoria}
          setSelectedCategoria={setSelectedCategoria}
          placeholder="Buscar notícias por título ou conteúdo..."
        />
      </ContentListLayout>
    </>
  );
}

export default Noticias;
