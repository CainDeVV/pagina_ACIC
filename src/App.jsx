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
// Futuras páginas (crie depois, se desejar)
// import Servicos from './pages/public/Servicos';
// import Eventos from './pages/public/Eventos';

function App() {
  return (
    <>
      {/* Cabeçalho (inclui também a Navbar mobile) */}
      <Header />

      {/* Rotas da aplicação */}
      <Routes>
        {/* Página inicial */}
        <Route path="/" element={<Home />} />

        {/* Institucional */}
        <Route path="/quem-somos" element={<QuemSomos />} />
        <Route path="/estatuto" element={<Estatuto />} />
        <Route
          path="/estrutura-organizacional"
          element={<EstruturaOrganizacional />}
        />
        <Route path="/cmec" element={<Cmec />} />
        <Route path="/contatos" element={<Contatos />} />

        
        <Route path="/eventos" element={<Eventos />} />

        {/*
          <Route path="/servicos" element={<Servicos />} />
          
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/busca" element={<Busca />} />
         */}
      </Routes>

      {/* Rodapé */}
      <Footer />
    </>
  );
}

export default App;