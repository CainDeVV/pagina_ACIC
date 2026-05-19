import SaibaMaisLayout from '../../../components/Layout/SaibaMaisLayout';
import { galeriaPresidentesMock } from '../../../mocks/institucionalMock';
import './Institucional.css'; // Estilos globais
import './GaleriaPresidentes.css'; // Estilos desta página

function GaleriaPresidentes() {
  return (
    <SaibaMaisLayout titulo={galeriaPresidentesMock.pageTitle}>
      
      {/* Cabeçalho da Página */}
      <h1 className="institutional-title">Nossa História em Lideranças</h1>
      <p className="institucional-intro">
        {galeriaPresidentesMock.intro}
      </p>

      {/* Renderização da Galeria de Cards */}
      <div className="presidentes-timeline">
        {galeriaPresidentesMock.presidentes.map((presidente) => (
          <div className="presidente-card" key={presidente.id}>
            
            <div className="presidente-foto-container">
              <img 
                src={presidente.foto} 
                alt={`Foto de ${presidente.nome}`} 
                className="presidente-foto" 
              />
            </div>
            
            <div className="presidente-info">
              <span className="presidente-periodo">{presidente.periodo}</span>
              <h3 className="presidente-nome">{presidente.nome}</h3>
              <p className="presidente-texto">{presidente.texto}</p>
            </div>

          </div>
        ))}
      </div>

    </SaibaMaisLayout>
  );
}

export default GaleriaPresidentes;