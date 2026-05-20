import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Página não encontrada</h2>
        <p className="not-found-text">
          Desculpe, a página que você está procurando não existe ou foi movida. 
          Verifique o link digitado ou retorne para a página inicial.
        </p>
        <Link to="/" className="btn-voltar-home">
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
}

export default NotFound;