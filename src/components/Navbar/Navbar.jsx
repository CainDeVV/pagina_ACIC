// src/components/Navbar/Navbar.jsx

import './Navbar.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaHome,
  FaSearch,
  FaGlobeAmericas,
  FaCalendarAlt
} from 'react-icons/fa';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenSection(null);
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <>
      {/* PAINEL DO MENU MOBILE */}
      <div className={menuOpen ? 'mobile-menu active' : 'mobile-menu'}>
        {/* INSTITUCIONAL */}
        <div
          className="menu-item"
          onClick={() => toggleSection('institucional')}
        >
          <span>Institucional</span>
          <FaChevronDown />
        </div>

        {openSection === 'institucional' && (
          <div className="submenu">
            <Link to="/quem-somos" onClick={closeMenu}>
              Quem Somos
            </Link>
            <Link to="/diretoria" onClick={closeMenu}>
              Diretoria
            </Link>
            <Link to="/estatuto" onClick={closeMenu}>
              Estatuto
            </Link>
            <Link to="/estrutura-organizacional" onClick={closeMenu}>
              Estrutura Organizacional
            </Link>
            <Link to="/cmec" onClick={closeMenu}>
              CMEC
            </Link>
            <Link to="/contatos" onClick={closeMenu}>
              Contatos
            </Link>
          </div>
        )}

        {/* SERVIÇOS */}
        <div
          className="menu-item"
          onClick={() => toggleSection('servicos')}
        >
          <span>Serviços</span>
          <FaChevronDown />
        </div>

        {openSection === 'servicos' && (
          <div className="submenu">
            <Link to="/servicos" onClick={closeMenu}>
              Ver Serviços
            </Link>
          </div>
        )}

        {/* EVENTOS */}
        <Link
          to="/eventos"
          className="menu-item eventos-link"
          onClick={closeMenu}
        >
          <span>Eventos</span>
          <FaCalendarAlt />
        </Link>

        {/* SERVIÇOS + VER TODOS */}
        <div className="mobile-services-header">
          <h3>Serviços</h3>

          <Link
            to="/servicos"
            className="mobile-ver-todos-btn"
            onClick={closeMenu}
          >
            <span className="arrow">→</span>
            <span>Ver todos</span>
          </Link>
        </div>
      </div>

      {/* MENU DESKTOP */}
      <nav className="desktop-navbar">
        {/* Institucional */}
        <Link to="/quem-somos">
          <span>Institucional</span>
        </Link>

        {/* Serviços */}
        <Link to="/servicos">
          <span>Serviços</span>
        </Link>

        {/* Eventos com calendário à extrema direita */}
        <Link to="/eventos">
          <span>Eventos</span>
          <span className="eventos-icon">
            <FaCalendarAlt />
          </span>
        </Link>
      </nav>

      {/* BARRA INFERIOR MOBILE */}
      <div className="bottom-navbar">
        {/* Botão Menu */}
        <button
          type="button"
          className="bottom-item toggle-btn"
          onClick={toggleMenu}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Home */}
        <Link to="/" className="bottom-item" onClick={closeMenu}>
          <FaHome />
        </Link>

        {/* Serviços */}
        <Link to="/servicos" className="bottom-item" onClick={closeMenu}>
          <span>Serviços</span>
        </Link>

        {/* Notícias */}
        <Link to="/noticias" className="bottom-item" onClick={closeMenu}>
          <span>Notícias</span>
        </Link>

        {/* Busca */}
        <Link to="/busca" className="bottom-item" onClick={closeMenu}>
          <FaSearch />
        </Link>

        {/* Institucional */}
        <Link to="/quem-somos" className="bottom-item" onClick={closeMenu}>
          <FaGlobeAmericas />
        </Link>
      </div>
    </>
  );
}

export default Navbar;