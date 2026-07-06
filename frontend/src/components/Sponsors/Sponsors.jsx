import { useState, useEffect } from 'react';
import { patrocinadoresService } from '@/services/patrocinadoresService';
import './Sponsors.css';

function Sponsors() {
  const [patrocinadores, setPatrocinadores] = useState([]);

  useEffect(() => {
    async function carregarPatrocinadores() {
      try {
        const payload = await patrocinadoresService.buscarTodosAtivos();
        setPatrocinadores(payload.data || []);
      } catch (error) {
        console.error('Erro ao carregar patrocinadores:', error);
      }
    }
    carregarPatrocinadores();
  }, []);

  if (!patrocinadores || patrocinadores.length === 0) {
    return null;
  }

  return (
    <section className="sponsors-section">
      <div className="sponsors-container">
        <h2 className="sponsors-title">Nossos Patrocinadores</h2>
        <div className="sponsors-grid">
          {patrocinadores.map((patrocinador) => (
            <a
              key={patrocinador.id}
              href={patrocinador.linkUrl || '#'}
              target={patrocinador.linkUrl ? '_blank' : '_self'}
              rel="noreferrer"
              className="sponsor-card"
              title={patrocinador.name}
            >
              <img src={patrocinador.logoUrl} alt={`Logo ${patrocinador.name}`} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Sponsors;
