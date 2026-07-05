import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import ServiceCard from '../../../components/ServiceCard/ServiceCard';
import { servicosService } from '../../../services/servicosService';
import './Servicos.css';
import '../../../components/Layout/SaibaMaisLayout.css';

function ServicoDetalhe() {
  const { slug } = useParams();
  const [servicoAtual, setServicoAtual] = useState(null);
  const [outrosServicos, setOutrosServicos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        // Busca o serviço atual e a lista de todos (para a vitrine inferior)
        const [servico, todos] = await Promise.all([
          servicosService.buscarPorId(slug),
          servicosService.buscarTodos()
        ]);

        setServicoAtual(servico);
        // Filtra para remover o serviço atual da lista de "Outros Serviços"
        setOutrosServicos((todos || []).filter(s => s.slug !== slug));
      } catch (error) {
        console.error("Erro ao buscar detalhes do serviço:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, [slug]);

  if (carregando) {
    return (
      <div className="servico-detalhe-page" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <p>Carregando detalhes do serviço...</p>
      </div>
    );
  }

  if (!servicoAtual) {
    return (
      <>
        <Helmet>
          <title>Serviço não encontrado | ACIC</title>
        </Helmet>
        <div className="servico-detalhe-page" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2>Serviço não encontrado.</h2>
          <Link to="/servicos" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>← Voltar para Serviços</Link>
        </div>
      </>
    );
  }

  const imagemBanner = servicoAtual.imageUrl || 'https://placehold.co/1200x400?text=Servico';

  return (
    <>
      <Helmet>
        <title>{servicoAtual.title} | ACIC</title>
      </Helmet>

      <div className="servico-detalhe-page">
        <Breadcrumb items={[{ label: 'Serviços', path: '/servicos' }, { label: servicoAtual.title }]} />

        <div className="servico-banner">
          <img src={imagemBanner} alt={servicoAtual.title} />
          <div className="servico-banner-content">
            <h1>{servicoAtual.title}</h1>
            <button className="btn-eu-quero" onClick={() => setIsModalOpen(true)}>
              Eu Quero
            </button>
          </div>
        </div>

        <div className="servico-descricao">
          <BlockRenderer blocks={servicoAtual.description?.blocks || []} />
        </div>

        {outrosServicos.length > 0 && (
          <>
            <hr style={{ borderColor: '#eaeaea', marginBottom: '40px' }} />
            <h2>Outros Serviços</h2>
            <div className="servicos-grid">
              {outrosServicos.slice(0, 3).map(servico => ( // Limitamos a 3 para a tela não ficar gigante
                <ServiceCard key={servico.id} service={servico} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* DRAWER / MODAL LATERAL */}
      <div className={`drawer-overlay ${isModalOpen ? 'open' : ''}`} onClick={() => setIsModalOpen(false)}>
        <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <h2>Eu Quero</h2>
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
          </div>

          <p style={{ lineHeight: '1.6', color: 'var(--color-gray-medium)', fontSize: '1.1rem' }}>
            Para solicitar este serviço, entre em contato diretamente com a nossa equipe de atendimento.
            Estaremos prontos para te ajudar!
          </p>

          <div className="btn-telefone">
            📞 (88) 99999-9999
          </div>

          <a href="https://wa.me/5588999999999" target="_blank" rel="noreferrer" className="btn-whatsapp">
            Enviar mensagem no WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}

export default ServicoDetalhe;