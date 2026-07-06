import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import { INSTITUCIONAL_MENU } from '@/constants/menu';
import './SaibaMaisLayout.css';

// O 'children' é o conteúdo específico de cada página que vai ser renderizado aqui dentro
function SaibaMaisLayout({ titulo, children }) {
  const location = useLocation(); // Lê a URL atual (ex: /cmec)

  return (
    <div className="institucional-page">
      <Helmet><title>{`${titulo} | ACIC`}</title></Helmet>
      
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
            {INSTITUCIONAL_MENU.map((item, idx) => (
              <li key={idx}>
                <Link 
                  to={item.path} 
                  className={location.pathname === item.path ? "ativo" : ""}
                >
                  {item.label}
                </Link>
              </li>
            ))}
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