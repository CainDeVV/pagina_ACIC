import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Header from './components/Layout/Header';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Layout/Footer';

// Páginas Administrativas (Dashboard)
import Dashboard from './pages/Admin/Dashboard/Dashboard';

// Páginas Administrativas (CRUDs)
import SlidesList from './pages/Admin/Slides/SlidesList';
import SlideForm from './pages/Admin/Slides/SlideForm';
import PresidentesList from './pages/Admin/Presidentes/PresidentesList';
import PresidenteForm from './pages/Admin/Presidentes/PresidenteForm';
import DiretoriaList from './pages/Admin/Diretoria/DiretoriaList';
import DiretoriaForm from './pages/Admin/Diretoria/DiretoriaForm';
import ServicosList from './pages/Admin/Servicos/ServicosList';
import ServicosForm from './pages/Admin/Servicos/ServicosForm';
import EventosList from './pages/Admin/Eventos/EventosList';
import EventoForm from './pages/Admin/Eventos/EventoForm';
import NoticiasList from './pages/Admin/Noticias/NoticiasList';
import NoticiaForm from './pages/Admin/Noticias/NoticiaForm';

// Páginas Públicas
import Home from './pages/Public/Home/Home';
import QuemSomos from './pages/Public/Institucional/QuemSomos';
import Diretoria from './pages/Public/Institucional/Diretoria';
import Estatuto from './pages/Public/Institucional/Estatuto';
import EstruturaOrganizacional from './pages/Public/Institucional/EstruturaOrganizacional';
import Cmec from './pages/Public/Institucional/Cmec';
import Contatos from './pages/Public/Institucional/Contatos';
import GaleriaPresidentes from './pages/Public/Institucional/GaleriaPresidentes';
import Servicos from './pages/Public/Servicos/Servicos';
import ServicoDetalhe from './pages/Public/Servicos/ServicoDetalhe';
import Eventos from './pages/Public/Eventos/Eventos';
import EventoDetalhe from './pages/Public/Eventos/EventoDetalhe';
import Noticias from './pages/Public/Noticias/Noticias';
import NoticiaDetalhe from './pages/Public/Noticias/NoticiaDetalhe';
import Login from './pages/Public/Login/Login';
import NotFound from './pages/Public/NotFound/NotFound';

function App() {
  return (
    <div>
      <ScrollToTop />
      <Header />
      <Navbar />
      <Routes>
        {/* === ROTAS ADMINISTRATIVAS === */}
        <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        
        <Route path="/admin/slides" element={<PrivateRoute><SlidesList /></PrivateRoute>} />
        <Route path="/admin/slides/novo" element={<PrivateRoute><SlideForm /></PrivateRoute>} />
        <Route path="/admin/slides/:id/editar" element={<PrivateRoute><SlideForm /></PrivateRoute>} />
        
        <Route path="/admin/presidentes" element={<PrivateRoute><PresidentesList /></PrivateRoute>} />
        <Route path="/admin/presidentes/novo" element={<PrivateRoute><PresidenteForm /></PrivateRoute>} />
        <Route path="/admin/presidentes/:id/editar" element={<PrivateRoute><PresidenteForm /></PrivateRoute>} />
        
        <Route path="/admin/diretoria" element={<PrivateRoute><DiretoriaList /></PrivateRoute>} />
        <Route path="/admin/diretoria/novo" element={<PrivateRoute><DiretoriaForm /></PrivateRoute>} />
        <Route path="/admin/diretoria/:id/editar" element={<PrivateRoute><DiretoriaForm /></PrivateRoute>} />
        
        <Route path="/admin/servicos" element={<PrivateRoute><ServicosList /></PrivateRoute>} />
        <Route path="/admin/servicos/novo" element={<PrivateRoute><ServicosForm /></PrivateRoute>} />
        <Route path="/admin/servicos/:id/editar" element={<PrivateRoute><ServicosForm /></PrivateRoute>} />
        
        <Route path="/admin/eventos" element={<PrivateRoute><EventosList /></PrivateRoute>} />
        <Route path="/admin/eventos/novo" element={<PrivateRoute><EventoForm /></PrivateRoute>} />
        <Route path="/admin/eventos/:id/editar" element={<PrivateRoute><EventoForm /></PrivateRoute>} />
        
        <Route path="/admin/noticias" element={<PrivateRoute><NoticiasList /></PrivateRoute>} />
        <Route path="/admin/noticias/novo" element={<PrivateRoute><NoticiaForm /></PrivateRoute>} />
        <Route path="/admin/noticias/:id/editar" element={<PrivateRoute><NoticiaForm /></PrivateRoute>} />

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
      <Footer />
    </div>
  );
}

export default App;