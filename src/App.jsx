// src/App.jsx
import Header from './components/layout/Header';
import Home from './pages/public/Home';
import QuemSomos from './pages/public/institucional/QuemSomos';
import Cmec from './pages/public/institucional/Cmec';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div>
      <Header />
      <Home />
      <QuemSomos />
      <QuemSomos />
      <Footer />
    </div>
  );
}

export default App;