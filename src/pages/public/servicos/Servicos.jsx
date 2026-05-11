import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { servicosMock } from '../../../mocks/servicosMock';
import '../../../styles/servicos.css';

function Servicos() {
  const [slideAtual, setSlideAtual] = useState(0);
  const navigate = useNavigate();

  // Lógica do Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideAtual((prev) => (prev + 1) % servicosMock.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Quando clica no banner, vai para a página do serviço
  const irParaServico = () => {
    navigate(`/servicos/${servicosMock[slideAtual].slug}`);
  };

  return (
    <div className="servicos-page">
      {/* Slider Superior */}
      <div className="servicos-slider" onClick={irParaServico}>
        <img 
          src={servicosMock[slideAtual].bannerUrl} 
          alt={servicosMock[slideAtual].titulo} 
        />
      </div>

      {/* Grade de Todos os Serviços */}
      <div className="servicos-container">
        <h2>Filtre nossos serviços</h2>
        <div className="servicos-grid">
          {servicosMock.map((servico) => (
            <Link to={`/servicos/${servico.slug}`} className="servico-card" key={servico.id}>
              <img src={servico.cardUrl} alt={servico.titulo} />
              <div className="servico-card-content">
                <h3>{servico.titulo}</h3>
                <p>{servico.resumo}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Servicos;