import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown, FaHome, FaCalendarAlt, FaNewspaper } from 'react-icons/fa';
import { INSTITUCIONAL_MENU, SERVICOS_MENU } from '../../constants/menu';
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

        {/* SUBMENU: INSTITUCIONAL */}
        <div className="menu-item" onClick={() => toggleSection('institucional')}>
          <span>Institucional</span>
          <FaChevronDown />
        </div>

        {openSection === 'institucional' && (
          <div className="submenu">
            {INSTITUCIONAL_MENU.map((item, idx) => (
              <Link key={idx} to={item.path} onClick={closeMenu}>{item.label}</Link>
            ))}
          </div>
        )}

        {/* SUBMENU: SERVIÇOS */}
        <div className="menu-item" onClick={() => toggleSection('servicos')}>
          <span>Serviços</span>
          <FaChevronDown />
        </div>

        {openSection === 'servicos' && (
          <div className="submenu">
            {SERVICOS_MENU.map((item, idx) => (
              <Link key={idx} to={item.path} onClick={closeMenu}>{item.label}</Link>
            ))}
            <Link to="/servicos" onClick={closeMenu} style={{ fontWeight: 'bold' }}>Ver todos</Link>
          </div>
        )}

        {/* LINK DIRETO: EVENTOS */}
        <Link to="/eventos" className="menu-item" onClick={closeMenu}>
          <span>Eventos</span>
          <FaCalendarAlt />
        </Link>

        {/* LINK DIRETO: NOTÍCIAS */}
        <Link to="/noticias" className="menu-item" onClick={closeMenu}>
          <span>Notícias</span>
          <FaNewspaper />
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

        {/* Notícias */}
        <Link to="/noticias" className="bottom-item" onClick={closeMenu}>
          <FaNewspaper />
        </Link>
      </div>
    </>
  );
}

export default Navbar;