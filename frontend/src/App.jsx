import { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { Routes, Route, useLocation } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Header from './components/Layout/Header';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Layout/Footer';
import PageLoader from './components/PageLoader/PageLoader';

// Páginas Administrativas carregadas dinamicamente
const Dashboard = lazy(() => import('./pages/Admin/Dashboard/Dashboard'));
const QuemSomosList = lazy(() => import('./pages/Admin/QuemSomos/QuemSomosList'));
const QuemSomosForm = lazy(() => import('./pages/Admin/QuemSomos/QuemSomosForm'));
const SlidesList = lazy(() => import('./pages/Admin/Slides/SlidesList'));
const SlideForm = lazy(() => import('./pages/Admin/Slides/SlideForm'));
const PresidentesList = lazy(() => import('./pages/Admin/Presidentes/PresidentesList'));
const PresidenteForm = lazy(() => import('./pages/Admin/Presidentes/PresidenteForm'));
const DiretoriaList = lazy(() => import('./pages/Admin/Diretoria/DiretoriaList'));
const DiretoriaForm = lazy(() => import('./pages/Admin/Diretoria/DiretoriaForm'));
const ServicosList = lazy(() => import('./pages/Admin/Servicos/ServicosList'));
const ServicosForm = lazy(() => import('./pages/Admin/Servicos/ServicosForm'));
const PatrocinadoresList = lazy(() => import('./pages/Admin/Patrocinadores/PatrocinadoresList'));
const PatrocinadorForm = lazy(() => import('./pages/Admin/Patrocinadores/PatrocinadorForm'));
const EventosList = lazy(() => import('./pages/Admin/Eventos/EventosList'));
const EventoForm = lazy(() => import('./pages/Admin/Eventos/EventoForm'));
const NoticiasList = lazy(() => import('./pages/Admin/Noticias/NoticiasList'));
const NoticiaForm = lazy(() => import('./pages/Admin/Noticias/NoticiaForm'));

// Páginas Públicas carregadas dinamicamente
const Home = lazy(() => import('./pages/Public/Home/Home'));
const QuemSomos = lazy(() => import('./pages/Public/Institucional/QuemSomos'));
const Diretoria = lazy(() => import('./pages/Public/Institucional/Diretoria'));
const Estatuto = lazy(() => import('./pages/Public/Institucional/Estatuto'));
const EstruturaOrganizacional = lazy(() => import('./pages/Public/Institucional/EstruturaOrganizacional'));
const Cmec = lazy(() => import('./pages/Public/Institucional/Cmec'));
const Contatos = lazy(() => import('./pages/Public/Institucional/Contatos'));
const GaleriaPresidentes = lazy(() => import('./pages/Public/Institucional/GaleriaPresidentes'));
const Servicos = lazy(() => import('./pages/Public/Servicos/Servicos'));
const ServicoDetalhe = lazy(() => import('./pages/Public/Servicos/ServicoDetalhe'));
const Eventos = lazy(() => import('./pages/Public/Eventos/Eventos'));
const EventoDetalhe = lazy(() => import('./pages/Public/Eventos/EventoDetalhe'));
const Noticias = lazy(() => import('./pages/Public/Noticias/Noticias'));
const NoticiaDetalhe = lazy(() => import('./pages/Public/Noticias/NoticiaDetalhe'));
const Login = lazy(() => import('./pages/Public/Login/Login'));
const NotFound = lazy(() => import('./pages/Public/NotFound/NotFound'));

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div>
      <ScrollToTop />
      
      {!isAdminRoute && (
        <>
          <Header />
          <Navbar />
        </>
      )}

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* === ROTAS ADMINISTRATIVAS === */}
          <Route path="/admin" element={<PrivateRoute />}>
            <Route index element={<Dashboard />} />

            <Route path="quemsomos" element={<QuemSomosList />} />
            <Route path="quemsomos/nova" element={<QuemSomosForm />} />
            <Route path="quemsomos/:id/editar" element={<QuemSomosForm />} />

            <Route path="slides" element={<SlidesList />} />
            <Route path="slides/novo" element={<SlideForm />} />
            <Route path="slides/:id/editar" element={<SlideForm />} />

            <Route path="presidentes" element={<PresidentesList />} />
            <Route path="presidentes/novo" element={<PresidenteForm />} />
            <Route path="presidentes/:id/editar" element={<PresidenteForm />} />

            <Route path="diretoria" element={<DiretoriaList />} />
            <Route path="diretoria/novo" element={<DiretoriaForm />} />
            <Route path="diretoria/:id/editar" element={<DiretoriaForm />} />

            <Route path="servicos" element={<ServicosList />} />
            <Route path="servicos/novo" element={<ServicosForm />} />
            <Route path="servicos/:id/editar" element={<ServicosForm />} />
            <Route path="patrocinadores" element={<PatrocinadoresList />} />
            <Route path="patrocinadores/novo" element={<PatrocinadorForm />} />
            <Route path="patrocinadores/:id/editar" element={<PatrocinadorForm />} />

            <Route path="eventos" element={<EventosList />} />
            <Route path="eventos/novo" element={<EventoForm />} />
            <Route path="eventos/:id/editar" element={<EventoForm />} />

            <Route path="noticias" element={<NoticiasList />} />
            <Route path="noticias/nova" element={<NoticiaForm />} />
            <Route path="noticias/:id/editar" element={<NoticiaForm />} />
          </Route>

          {/* === ROTAS PÚBLICAS === */}
          <Route path="/" element={<Home />} />

          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/diretoria" element={<Diretoria />} />
          <Route path="/estatuto" element={<Estatuto />} />
          <Route path="/estrutura-organizacional" element={<EstruturaOrganizacional />} />
          <Route path="/cmec" element={<Cmec />} />
          <Route path="/contatos" element={<Contatos />} />
          <Route path="/galeria-presidentes" element={<GaleriaPresidentes />} />

          <Route path="/servicos" element={<Servicos />} />
          <Route path="/servicos/:slug" element={<ServicoDetalhe />} />

          <Route path="/eventos" element={<Eventos />} />
          <Route path="/eventos/:slug" element={<EventoDetalhe />} />

          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticias/:slug" element={<NoticiaDetalhe />} />

          <Route path="/login" element={<Login />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;