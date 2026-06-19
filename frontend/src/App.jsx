import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import Login from './pages/Public/Login/Login';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Header from './components/Layout/Header';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Public/Home/Home';
import QuemSomos from './pages/Public/Institucional/QuemSomos';
import Diretoria  from './pages/Public/Institucional/Diretoria';
import Estatuto from './pages/Public/Institucional/Estatuto';
import EstruturaOrganizacional from './pages/Public/Institucional/EstruturaOrganizacional';
import Cmec from './pages/Public/Institucional/Cmec';
import Contatos from './pages/Public/Institucional/Contatos';
import GaleriaPresidentes from './pages/Public/Institucional/GaleriaPresidentes';
import Servicos from './pages/Public/Servicos/Servicos';
import ServicoDetalhe from './pages/Public/Servicos/ServicoDetalhe';
import Eventos from './pages/Public/Eventos/Eventos';
import EventoDetalhe from './pages/Public/Eventos/EventoDetalhe';
import Footer from './components/Layout/Footer';
import NotFound from './pages/Public/NotFound/NotFound';

function App() {
  return (
    <div>
      <ScrollToTop />
      <Header />
      <Navbar />
      <Routes>
        <Route
  path="/admin"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>
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
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;