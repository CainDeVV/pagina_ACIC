import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SaibaMaisLayout from "../../../components/Layout/SaibaMaisLayout";
import DirectorCard from "../../../components/DirectorCard/DirectorCard";
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import { institucionalService } from '../../../services/institucionalService';
import './Institucional.css';
import './Diretoria.css';

function Diretoria() {
  const [diretoriaCategorias, setDiretoriaCategorias] = useState([]);
  const [paginaIntro, setPaginaIntro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  
  // Gerenciamento do Modal
  const [selectedMember, setSelectedMember] = useState(null);

  const openModal = (member) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  useEffect(() => {
    async function buscarDados() {
      try {
        // Promise.allSettled é o padrão da indústria para requisições concorrentes independentes.
        // Ele aguarda todas finalizarem e não "quebra" se uma delas falhar (como o 404 da intro).
        const [resultadoDiretores, resultadoIntro] = await Promise.allSettled([
          institucionalService.buscarDiretoria(),
          institucionalService.buscarPagina('diretoria')
        ]);
        
        // Tratamento elegante dos resultados individuais
        const dadosDiretores = resultadoDiretores.status === 'fulfilled' ? resultadoDiretores.value : [];
        if (resultadoDiretores.status === 'rejected') {
          console.error("Erro ao carregar diretores:", resultadoDiretores.reason);
        }

        const dadosIntro = resultadoIntro.status === 'fulfilled' ? resultadoIntro.value : null;
        if (resultadoIntro.status === 'rejected') {
          console.warn("Introdução não publicada no CMS (Ignorado).");
        }
        
        setDiretoriaCategorias(dadosDiretores || []);
        setPaginaIntro(dadosIntro);
      } catch (error) {
        console.error("Erro fatal inesperado ao buscar dados da Diretoria:", error);
      } finally {
        setCarregando(false);
      }
    }
    buscarDados();
  }, []);

  if (carregando) {
    return (
      <SaibaMaisLayout activeItem="diretoria" titulo="Carregando...">
        <p style={{ padding: '20px' }}>Carregando informações...</p>
      </SaibaMaisLayout>
    );
  }

  return (
    <>
    <Helmet>
      <title>{paginaIntro ? paginaIntro.title : 'Diretoria'} | ACIC</title>
    </Helmet>
    <SaibaMaisLayout activeItem="diretoria" titulo={paginaIntro ? paginaIntro.title : "Diretoria"}>
      <div className="diretoria-page">
        
        {/* Cabeçalho Editável (Mini-CMS) */}
        {paginaIntro ? (
          <div style={{ marginBottom: '40px' }}>
            <BlockRenderer blocks={paginaIntro.content?.blocks || []} />
          </div>
        ) : (
          <div style={{ marginBottom: '40px' }}>
            <p style={{ padding: '20px' }}>Conteúdo introdutório ainda não publicado no painel administrativo.</p>
          </div>
        )}

        {/* Mapeamento das Categorias e Membros */}
        {diretoriaCategorias.length > 0 ? (
          diretoriaCategorias.map((category, idx) => (
            <div key={idx}>
              <div className="section">
                <div className="role-label">{category.roleLabel}</div>
                
                <div className="cards-grid">
                  {category.members.map((member) => (
                    <DirectorCard 
                      key={member.id} 
                      member={member} 
                      variant="light" 
                      onMoreInfo={openModal} 
                    />
                  ))}
                </div>
              </div>
              {/* Oculta a linha divisória após a última seção */}
              {idx < diretoriaCategorias.length - 1 && <hr className="section-dividir" />}
            </div>
          ))
        ) : (
          <p style={{ padding: '20px 0', textAlign: 'center' }}>
            Nenhum membro da diretoria cadastrado no banco de dados.
          </p>
        )}
      </div>

      {/* COMPONENTE DE MODAL (Agora lendo tudo do banco de dados) */}
      <div className={`overlay ${selectedMember ? 'open' : ''}`} onClick={closeModal}>
        {selectedMember && (
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              {selectedMember.photoUrl ? (
                <img src={selectedMember.photoUrl} alt={selectedMember.name} className="modal-avatar" />
              ) : (
                <div className="modal-avatar placeholder-sm">👤</div>
              )}
              
              <div className="modal-header-text">
                <h3 className="modal-name">{selectedMember.name}</h3>
                <div className="modal-role">{selectedMember.role}</div>
              </div>

              <button className="modal-close" onClick={closeModal} title="Fechar modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-bio">
                {selectedMember.bio || "Nenhuma biografia cadastrada no momento."}
              </p>
            </div>
          </div>
        )}
      </div>

    </SaibaMaisLayout>
    </>
  );
}

export default Diretoria;