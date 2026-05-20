import { Link, useLocation } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import './SaibaMaisLayout.css';

// O 'children' é o conteúdo específico de cada página que vai ser renderizado aqui dentro
function SaibaMaisLayout({ titulo, children }) {
  const location = useLocation(); // Lê a URL atual (ex: /cmec)

  return (
    <div className="institucional-page">
      
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Institucional' }, 
          { label: titulo }
        ]} 
      />

      <div className="institucional-container">
        
        {/* Menu Lateral (Sidebar) */}
        <aside className="sidebar">
          <h3>Saiba Mais <span>&#709;</span></h3>
          <ul>
            {/* O link fica 'ativo' se a URL bater com o destino do Link */}
            <li><Link to="/quem-somos" className={location.pathname === "/quem-somos" ? "ativo" : ""}>Quem Somos</Link></li>
            <li><Link to="/diretoria" className={location.pathname === "/diretoria" ? "ativo" : ""}>Diretoria</Link></li>
            <li><Link to="/estatuto" className={location.pathname === "/estatuto" ? "ativo" : ""}>Estatuto</Link></li>
            <li><Link to="/estrutura-organizacional" className={location.pathname === "/estrutura-organizacional" ? "ativo" : ""}>Estrutura Organizacional</Link></li>
            <li><Link to="/cmec" className={location.pathname === "/cmec" ? "ativo" : ""}>CMEC</Link></li>
            <li><Link to="/contatos" className={location.pathname === "/contatos" ? "ativo" : ""}>Contatos</Link></li>
            <li><Link to="/galeria-presidentes" className={location.pathname === "/galeria-presidentes" ? "ativo" : ""}>Galeria de Presidentes</Link></li>
          </ul>
        </aside>

        {/* Conteúdo dinâmico da página */}
        <main className="institucional-content">
          {children}
        </main>

      </div>
    </div>
  );
}

export default SaibaMaisLayout;