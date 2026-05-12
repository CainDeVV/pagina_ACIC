import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicosMock } from '../../../mocks/servicosMock';
import BlockRenderer from '../../../components/BlockRenderer'; // Importe do BlockRenderer!
import '../../../styles/servicos.css';
import '../../../styles/institucional/saibaMaisLayout.css'; 

function ServicoDetalhe() {
  const { slug } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const servicoAtual = servicosMock.find(s => s.slug === slug);
  const outrosServicos = servicosMock.filter(s => s.slug !== slug);

  if (!servicoAtual) {
    return <div className="servico-detalhe-page"><h2>Serviço não encontrado.</h2></div>;
  }

  return (
    <>
      <div className="servico-detalhe-page">
        
        <div className="breadcrumb">
          <Link to="/servicos">Serviços</Link> 
          <span className="separador">&gt;</span> 
          <span className="atual">{servicoAtual.titulo}</span>
        </div>

        <div className="servico-banner">
          <img src={servicoAtual.bannerUrl} alt={servicoAtual.titulo} />
          <div className="servico-banner-content">
            <h1>{servicoAtual.titulo}</h1>
            <button className="btn-eu-quero" onClick={() => setIsModalOpen(true)}>
              {/* Agora o texto do botão vem dinamicamente do mock */}
              {servicoAtual.textoBotao || "Eu quero"} 
            </button>
          </div>
        </div>

        {/* Substituímos a div dangerouslySetInnerHTML pelo nosso poderoso BlockRenderer */}
        <div className="servico-descricao">
          <BlockRenderer blocks={servicoAtual.blocks} />
        </div>

        <hr style={{ borderColor: '#eaeaea', marginBottom: '40px' }} />

        <h2>Outros Serviços</h2>
        <div className="servicos-grid">
          {outrosServicos.map((servico) => (
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

      {/* DRAWER / MODAL LATERAL */}
      <div className={`drawer-overlay ${isModalOpen ? 'open' : ''}`} onClick={() => setIsModalOpen(false)}>
        <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <h2>{servicoAtual.textoBotao || "Eu quero"}</h2>
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
          </div>
          
          <p style={{ lineHeight: '1.6', color: '#555', fontSize: '1.1rem' }}>
            {servicoAtual.modalInfo.texto}
          </p>

          <div className="btn-telefone">
            📞 {servicoAtual.modalInfo.telefone}
          </div>

          <a href={servicoAtual.modalInfo.linkWhatsapp} target="_blank" rel="noreferrer" className="btn-whatsapp">
            Enviar mensagem no WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}

export default ServicoDetalhe;