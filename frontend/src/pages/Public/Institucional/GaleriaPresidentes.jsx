import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SaibaMaisLayout from '../../../components/Layout/SaibaMaisLayout';
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import { institucionalService } from '../../../services/institucionalService';
import './Institucional.css'; 
import './GaleriaPresidentes.css'; 

function GaleriaPresidentes() {
  const [presidentes, setPresidentes] = useState([]);
  const [paginaIntro, setPaginaIntro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarDados() {
      try {
        // Promise.all executa as requisições em paralelo.
        const [dadosPresidentes, dadosIntro] = await Promise.all([
          institucionalService.buscarPresidentesPublico().catch(() => ({ data: [] })),
          institucionalService.buscarPagina('presidentes').catch(() => null)
        ]);
        
        // Inverte a ordem do painel (sortOrder), para exibir o mais recente (Maior Ordem) primeiro.
        const invertidos = [...(dadosPresidentes?.data || [])].reverse();
        setPresidentes(invertidos);
        setPaginaIntro(dadosIntro);
      } catch (error) {
        console.error("Erro geral ao buscar dados da Galeria de Presidentes:", error);
      } finally {
        setCarregando(false);
      }
    }
    buscarDados();
  }, []);

  if (carregando) {
    return (
      <SaibaMaisLayout titulo="Carregando...">
        <p style={{ padding: '20px' }}>Carregando informações...</p>
      </SaibaMaisLayout>
    );
  }

  return (
    <>
    <Helmet>
      <title>{paginaIntro ? paginaIntro.title : 'Galeria de Presidentes'} | ACIC</title>
    </Helmet>

    <SaibaMaisLayout titulo={paginaIntro ? paginaIntro.title : "Galeria de Presidentes"}>
      
      {/* Cabeçalho Editável: Se houver dados no banco, usa o BlockRenderer. Se não, usa o texto padrão. */}
      {paginaIntro ? (
        <div style={{ marginBottom: '40px' }}>
          <BlockRenderer blocks={paginaIntro.content?.blocks || []} />
        </div>
      ) : (
        <div style={{ marginBottom: '40px' }}>
          <p style={{ padding: '20px' }}>Conteúdo introdutório ainda não publicado no painel administrativo.</p>
        </div>
      )}

      {/* Renderização da Galeria de Cards ou Mensagem de Vazio */}
      {presidentes.length > 0 ? (
        <div className="presidentes-timeline">
          {presidentes.map((presidente) => {
            // Formata o período de mandato dinamicamente
            const periodo = presidente.termEnd 
              ? `${presidente.termStart} - ${presidente.termEnd}` 
              : `${presidente.termStart} - Atual`;

            return (
              <div className="presidente-card" key={presidente.id}>
                
                <div className="presidente-foto-container">
                  <img 
                    src={presidente.photoUrl || 'https://placehold.co/300x400?text=Sem+Foto'} 
                    alt={`Foto de ${presidente.name}`} 
                    className="presidente-foto" 
                  />
                </div>
                
                <div className="presidente-info">
                  <span className="presidente-periodo">{periodo}</span>
                  <h3 className="presidente-nome">{presidente.name}</h3>
                  <p className="presidente-texto">{presidente.bio || 'Nenhuma biografia cadastrada no momento.'}</p>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ padding: '20px 0', textAlign: 'center' }}>
          Nenhum presidente cadastrado no banco de dados no momento.
        </p>
      )}

    </SaibaMaisLayout>
    </>
  );
}

export default GaleriaPresidentes;