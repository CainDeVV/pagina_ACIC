// src/components/Navbar/Navbar.jsx

import './Navbar.css';
import { useState } from 'react';
import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaHome,
  FaSearch,
  FaGlobeAmericas
} from 'react-icons/fa';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenSection(null);
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <>
      {/* Painel do menu mobile */}
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
            <a href="#quem-somos" onClick={closeMenu}>Quem Somos</a>
            <a href="#diretoria" onClick={closeMenu}>Diretoria</a>
            <a href="#estatuto" onClick={closeMenu}>Estatuto</a>
            <a href="#estrutura" onClick={closeMenu}>
              Estrutura Organizacional
            </a>
            <a href="#cmec" onClick={closeMenu}>CMEC</a>
            <a href="#contatos" onClick={closeMenu}>Contatos</a>
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
            <a href="#servicos" onClick={closeMenu}>
              Ver Serviços
            </a>
          </div>
        )}

        {/* EVENTOS */}
        <div
          className="menu-item eventos"
          onClick={() => toggleSection('eventos')}
        >
          <span>Eventos</span>
          <FaChevronDown />
        </div>

        {openSection === 'eventos' && (
          <div className="submenu">
            <a href="#eventos" onClick={closeMenu}>
              Ver Eventos
            </a>
          </div>
        )}
      </div>

      {/* Barra inferior fixa */}
      <div className="bottom-navbar">
        <button
          type="button"
          className="bottom-item toggle-btn"
          onClick={toggleMenu}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <a href="#" className="bottom-item" onClick={closeMenu}>
          <FaHome />
        </a>

        <a href="#servicos" className="bottom-item" onClick={closeMenu}>
          <span>Serviços</span>
        </a>

        <a href="#noticias" className="bottom-item" onClick={closeMenu}>
          <span>Notícias</span>
        </a>

        <a href="#busca" className="bottom-item" onClick={closeMenu}>
          <FaSearch />
        </a>

        <a href="#quem-somos" className="bottom-item" onClick={closeMenu}>
          <FaGlobeAmericas />
        </a>
      </div>
    </>
  );
}

export default Navbar;