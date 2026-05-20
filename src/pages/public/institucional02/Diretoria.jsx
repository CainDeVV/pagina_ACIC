import { useState } from 'react';
import SaibaMaisLayout from "../../../components/Layout/SaibaMaisLayout";
import DirectorCard from "../../../components/DirectorCard/DirectorCard";
import { diretoriaPageMock } from "../../../mocks/institucionalMock";
import './Institucional.css';
import './Diretoria.css';

function Diretoria() {
  // LÓGICA COMPLEXA: Gerenciamento do Modal
  // Guardamos o objeto inteiro do 'membro' no estado. Se estiver nulo, o modal some.
  // Ao clicar nos 3 pontinhos, setamos o membro clicado, o que faz a div .overlay aparecer.
  const [selectedMember, setSelectedMember] = useState(null);

  const openModal = (member) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  return (
    <SaibaMaisLayout activeItem="diretoria" titulo="Diretoria">
      <div className="diretoria-page">
        <h1 className="page-titulo">DIRETORIA DA ACIC</h1>
        <p className="pag-subtitulo">Triênio 2023/2025</p>

        {/* LÓGICA COMPLEXA: Mapeamento Duplo
            Primeiro mapeamos as categorias (Presidente, Tesoureiro, etc.).
            Depois, criamos um Grid e mapeamos os membros pertencentes àquela categoria. */}
        {diretoriaPageMock.map((category, idx) => (
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
            {idx < diretoriaPageMock.length - 1 && <hr className="section-dividir" />}
          </div>
        ))}
      </div>

      {/* COMPONENTE DE MODAL (Exibe apenas se selectedMember existir) */}
      <div className={`overlay ${selectedMember ? 'open' : ''}`} onClick={closeModal}>
        {selectedMember && (
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              {selectedMember.imagem_url ? (
                <img src={selectedMember.imagem_url} alt={selectedMember.nome} className="modal-avatar" />
              ) : (
                <div className="modal-avatar placeholder-sm">👤</div>
              )}
              
              <div className="modal-header-text">
                <h3 className="modal-name">{selectedMember.nome}</h3>
                <div className="modal-role">{selectedMember.cargo}</div>
              </div>

              <button className="modal-close" onClick={closeModal} title="Fechar modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-bio">
                {selectedMember.biografia || "Nenhuma biografia cadastrada no momento."}
              </p>
            </div>
          </div>
        )}
      </div>

    </SaibaMaisLayout>
  );
}

export default Diretoria;