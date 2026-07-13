import { FaEllipsisH } from 'react-icons/fa';
import './DirectorCard.css';

const DirectorCard = ({ member, variant = 'dark', onMoreInfo }) => {
  // Fallback de Imagem e Biografia
  const hasImage = Boolean(member.photoUrl);
  
  // O trim() evita que espaços em branco acionem o botão sem ter texto de fato.
  const hasBio = Boolean(member.bio && member.bio.trim() !== "");

  return (
    <div className={`director-card variant-${variant}`}>
      <div className="director-img-wrapper">
        {hasImage ? (
          <img 
            src={member.photoUrl} 
            alt={member.name} 
            loading="lazy" 
            className="director-img" 
          />
        ) : (
          <div className="director-placeholder">
            👤
          </div>
        )}
        
        {/* Ação Inteligente do Modal */}
        {onMoreInfo && hasBio && (
          <button 
            className="director-dots-btn" 
            onClick={() => onMoreInfo(member)} 
            title="Ver mais informações"
            aria-label={`Ver detalhes de ${member.name}`}
          >
            <FaEllipsisH />
          </button>
        )}
      </div>

      <div className="director-info">
        <h3 className="director-name">{member.name}</h3>
        <div className="director-role">{member.role}</div>
      </div>
    </div>
  );
};

export default DirectorCard;