import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/public/Home';
import QuemSomos from './pages/public/institucional/QuemSomos';
import Estatuto from './pages/public/institucional/Estatuto';
import EstruturaOrganizacional from './pages/public/institucional/EstruturaOrganizacional';
import Cmec from './pages/public/institucional/Cmec';
import Contatos from './pages/public/institucional/Contatos';
import GaleriaPresidentes from './pages/public/institucional/GaleriaPresidentes';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quem-somos" element={<QuemSomos />} />
        <Route path="/estatuto" element={<Estatuto />} />
        <Route path="/estrutura-organizacional" element={<EstruturaOrganizacional />} />
        <Route path="/cmec" element={<Cmec />} />
        <Route path="/contatos" element={<Contatos />} />
        <Route path="/galeria-presidentes" element={<GaleriaPresidentes />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;