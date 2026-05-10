// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Páginas
import Home from './pages/public/Home';
import QuemSomos from './pages/public/institucional/QuemSomos';
import Estatuto from './pages/public/institucional/Estatuto';
import EstruturaOrganizacional from './pages/public/institucional/EstruturaOrganizacional';
import Cmec from './pages/public/institucional/Cmec';
import Contatos from './pages/public/institucional/Contatos';
import Eventos from './pages/public/Eventos/Eventos';

function App() {
  return (
    <>
      {/* Cabeçalho fixo em todas as páginas */}
      <Header />

      {/* Gerenciamento de Rotas */}
      <Routes>
        {/* Página Inicial */}
        <Route path="/" element={<Home />} />

        {/* Rotas do Institucional */}
        <Route path="/quem-somos" element={<QuemSomos />} />
        <Route path="/estatuto" element={<Estatuto />} />
        <Route path="/estrutura-organizacional" element={<EstruturaOrganizacional />} />
        <Route path="/cmec" element={<Cmec />} />
        <Route path="/contatos" element={<Contatos />} />

        {/* Rota de Eventos */}
        <Route path="/eventos" element={<Eventos />} />
      </Routes>

      {/* Rodapé fixo em todas as páginas */}
      <Footer />
    </>
  );
}

export default App;