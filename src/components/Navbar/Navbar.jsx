import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown, FaHome, FaCalendarAlt } from 'react-icons/fa';
import './Navbar.css';

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
      {/* PAINEL DO MENU MOBILE (Desliza para cima) */}
      <div className={menuOpen ? 'mobile-menu active' : 'mobile-menu'}>
        
        <div className="menu-item" onClick={() => toggleSection('institucional')}>
          <span>Institucional</span>
          <FaChevronDown />
        </div>

        {openSection === 'institucional' && (
          <div className="submenu">
            <Link to="/quem-somos" onClick={closeMenu}>Quem Somos</Link>
            <Link to="/diretoria" onClick={closeMenu}>Diretoria</Link>
            <Link to="/estatuto" onClick={closeMenu}>Estatuto</Link>
            <Link to="/estrutura-organizacional" onClick={closeMenu}>Estrutura Organizacional</Link>
            <Link to="/cmec" onClick={closeMenu}>CMEC</Link>
            <Link to="/contatos" onClick={closeMenu}>Contatos</Link>
            <Link to="/galeria-presidentes" onClick={closeMenu}>Galeria de Presidentes</Link>
          </div>
        )}

        <Link to="/servicos" className="menu-item" onClick={closeMenu}>
          <span>Serviços</span>
        </Link>

        <Link to="/eventos" className="menu-item" onClick={closeMenu}>
          <span>Eventos</span>
          <FaCalendarAlt />
        </Link>
      </div>

      {/* BARRA INFERIOR FIXA (Mais Fina) */}
      <div className="bottom-navbar">
        {/* Botão Menu (Hambúrguer) */}
        <button type="button" className="bottom-item toggle-btn" onClick={toggleMenu}>
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

        {/* Eventos */}
        <Link to="/eventos" className="bottom-item" onClick={closeMenu}>
          <FaCalendarAlt />
        </Link>
      </div>
    </>
  );
}

export default Navbar;