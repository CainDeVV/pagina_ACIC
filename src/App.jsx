// src/App.jsx
import Header from './components/layout/Header';
import Home from './pages/public/Home';
import QuemSomos from './pages/public/institucional/QuemSomos';
import Estatuto from './pages/public/institucional/Estatuto';
import EstruturaOrganizacional from './pages/public/institucional/EstruturaOrganizacional';
import Cmec from './pages/public/institucional/Cmec';
import Contatos from './pages/public/institucional/Contatos';
import Footer from './components/layout/Footer';

import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <div>
      <Navbar />

      
      <Home />
      <QuemSomos />
      <Estatuto />
      <EstruturaOrganizacional />
      <Cmec />
      <Contatos />
      <Footer />
    </div>
  );
}

export default App;