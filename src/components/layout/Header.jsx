// src/components/Header/Header.jsx
import { Link, useLocation } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import '../../styles/header.css';
import Navbar from '../Navbar/Navbar';

import logo from '../../assets/ACIC.png'; 

function Header() {
  const location = useLocation();

  const showHeaderShowcase = location.pathname !== '/';

  return (
    <>
      {/* HEADER DESKTOP */}
      <header className="header-container">
        {/* Linha superior: logo + menu */}
        <div className="header-content">
          {/* Logo com link para a página inicial */}
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo ACIC" className="logo" />
          </Link>

          {/* Menu superior */}
          <nav className="nav-menu">
            <ul>
              {/* INSTITUCIONAL */}
              <li className="dropdown">
                <span>Institucional</span>
                <div className="dropdown-content">
                  <Link to="/quem-somos">Quem Somos</Link>
                  <Link to="/estatuto">Estatuto</Link>
                  <Link to="/estrutura-organizacional">
                    Estrutura Organizacional
                  </Link>
                  <Link to="/cmec">CMEC</Link>
                  <Link to="/contatos">Contatos</Link>
                </div>
              </li>

              {/* SERVIÇOS */}
              <li className="dropdown">
                <span>Serviços</span>
                <div className="dropdown-content">
                   <Link to="/servicos">Ver todos os serviços</Link>
                </div>
              </li>

              {/* EVENTOS */}
              <li className="dropdown">
                <span>Eventos</span>
                <div className="dropdown-content">
                  <Link to="/eventos">Ver todos os eventos</Link>
                </div>
              </li>
            </ul>
          </nav>
        </div>

        {/* BLOCO INFERIOR - APENAS FORA DA HOME */}
        {showHeaderShowcase && (
          <div className="header-showcase">
            {/* Botões em pílula */}
            <div className="header-pills">
              <Link to="/quem-somos" className="pill-button">
                Institucional
              </Link>

              <Link to="/servicos" className="pill-button">
                Serviços
              </Link>
            </div>

            {/* Banner de Eventos */}
            <Link
              to="/eventos"
              className="eventos-banner"
              aria-label="Ir para eventos"
            >
              <span className="eventos-text">Eventos</span>
              <span className="eventos-icon">
                <FaCalendarAlt />
              </span>
            </Link>

            {/* Título Serviços + botão Ver todos */}
            <div className="services-header">
              <h3>Serviços</h3>
              <Link to="/servicos" className="ver-todos-btn">
                <span className="arrow">→</span>
                <span>Ver todos</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* NAVBAR MOBILE - aparece apenas em telas menores via CSS */}
      <Navbar />
    </>
  );
}

export default Header;