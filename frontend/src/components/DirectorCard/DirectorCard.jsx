import { FaEllipsisH } from 'react-icons/fa';
import './DirectorCard.css';

const DirectorCard = ({ member, variant = 'dark', onMoreInfo }) => {
  // LÓGICA COMPLEXA: Fallback de Imagem e Biografia
  // Verificamos se há imagem para exibir o placeholder
  const hasImage = Boolean(member.imagem_url);
  
  // Verificamos se a biografia existe e não está vazia. O trim() evita 
  // que espaços em branco acionem o botão sem ter texto de fato.
  const hasBio = Boolean(member.biografia && member.biografia.trim() !== "");

  return (
    <div className={`director-card variant-${variant}`}>
      <div className="director-img-wrapper">
        {hasImage ? (
          <img 
            src={member.imagem_url} 
            alt={member.nome} 
            loading="lazy" 
            className="director-img" 
          />
        ) : (
          <div className="director-placeholder">
            👤
          </div>
        )}
        
        {/* LÓGICA COMPLEXA: Ação Inteligente do Modal
            O botão só é renderizado se a função 'onMoreInfo' foi passada PELO PAI (ex: Diretoria.jsx)
            E se o membro tiver algo escrito na 'biografia' do banco de dados (mock). */}
        {onMoreInfo && hasBio && (
          <button 
            className="director-dots-btn" 
            onClick={() => onMoreInfo(member)} 
            title="Ver mais informações"
            aria-label={`Ver detalhes de ${member.nome}`}
          >
            <FaEllipsisH />
          </button>
        )}
      </div>

      <div className="director-info">
        <h3 className="director-name">{member.nome}</h3>
        <div className="director-role">{member.cargo}</div>
      </div>
    </div>
  );
};

export default DirectorCard;