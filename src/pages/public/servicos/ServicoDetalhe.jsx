import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicosMock } from '../../../mocks/servicosMock';
import '../../../styles/servicos.css';
import '../../../styles/institucional/saibaMaisLayout.css'; // Aproveitando o CSS do breadcrumb

function ServicoDetalhe() {
  const { slug } = useParams(); // Pega o nome do serviço lá da URL da barra de endereços
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Procura no mock qual serviço corresponde ao slug da URL
  const servicoAtual = servicosMock.find(s => s.slug === slug);
  
  // Filtra os "Outros Serviços" (todos menos o atual)
  const outrosServicos = servicosMock.filter(s => s.slug !== slug);

  // Se o usuário digitar uma URL errada, avisa que não encontrou
  if (!servicoAtual) {
    return <div className="servico-detalhe-page"><h2>Serviço não encontrado.</h2></div>;
  }

  return (
    <>
      <div className="servico-detalhe-page">
        
        {/* Breadcrumb idêntico ao do institucional */}
        <div className="breadcrumb">
          <Link to="/servicos">Serviços</Link> 
          <span className="separador">&gt;</span> 
          <span className="atual">{servicoAtual.titulo}</span>
        </div>

        {/* Banner com botão */}
        <div className="servico-banner">
          <img src={servicoAtual.bannerUrl} alt={servicoAtual.titulo} />
          <div className="servico-banner-content">
            <h1>{servicoAtual.titulo}</h1>
            <button className="btn-eu-quero" onClick={() => setIsModalOpen(true)}>
              Eu quero
            </button>
          </div>
        </div>

        {/* Descrição Dinâmica em HTML */}
        <div 
          className="servico-descricao"
          dangerouslySetInnerHTML={{ __html: servicoAtual.descricaoHtml }}
        />

        <hr style={{ borderColor: '#eaeaea', marginBottom: '40px' }} />

        {/* Outros Serviços */}
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
        {/* Usamos e.stopPropagation() para clicar no painel branco não fechar o modal */}
        <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <h2>Eu quero</h2>
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