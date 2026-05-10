/* import './Navbar.css'
import{ useState} from 'react'
import logo from '../../assets/logo.png'

import{
    FaBars,
    FaTimes, 
    FaChevronDown,
    FaHome,
    FaSearch,
    FaGlobeAmericas
} from 'react-icons/fa'

// ... seus imports permanecem iguais

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <header className="header">
                <nav className="navbar">
                    <div className="logo">
                        <img src={logo} alt="CACB" />
                    </div>
                    <ul className="nav-links">
                        <li>INSTITUCIONAL</li>
                        <li>SERVIÇOS</li>
                        <li>EVENTOS</li>
                    </ul>
                </nav>
                <div className="linha-azul"></div>
            </header>

            {/* Menu que "sobe" ou aparece quando clicamos no sanduíche /}
            <div className={menuOpen ? 'mobile-menu active' : 'mobile-menu'}>
                <div className="menu-item">
                    <span>Institucional</span>
                    <FaChevronDown />
                </div>
                
                <div className="menu-item">
                    <span>Serviços</span>
                    <FaChevronDown />
                </div>
                <div className="menu-item">
                    <span>Eventos</span>
                    <FaChevronDown />
                </div>
            </div>

            {/* NAVBAR INFERIOR FIXA (Igual à imagem) /}
            <div className="bottom-navbar">
                {/* BOTÃO SANDUÍCHE / X - Agora dentro da barra inferior /}
                <div 
                    className="bottom-item toggle-btn" 
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <div className="circle-icon">
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </div>
                </div>

                <div className="bottom-item">
                    <FaHome />
                </div>
                <div className="bottom-item">
                    <span>Serviços</span>
                </div>
                <div className="bottom-item">
                    <span>Notícias</span>
                </div>
                <div className="bottom-item">
                    <FaSearch />
                </div>
                <div className="bottom-item">
                    <FaGlobeAmericas />
                </div>
            </div>
        </>
    );
}

export default Navbar;

*/

import './Navbar.css'
import { useState } from 'react'
import logo from '../../assets/logo.png'
import {
    FaBars,
    FaTimes, 
    FaChevronDown,
    FaHome,
    FaSearch,
    FaGlobeAmericas
} from 'react-icons/fa'

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <header className="header">
                <nav className="navbar">
                    <div className="logo">
                        <img src={logo} alt="CACB" />
                    </div>
                    
                    {/* Navegação Desktop com Dropdown integrado do antigo Header */}
                    <ul className="nav-links">
                        <li className="dropdown">
                            INSTITUCIONAL <FaChevronDown size={12} />
                            <div className="dropdown-content">
                                <a href="#quem-somos">Quem Somos</a>
                                <a href="#diretoria">Diretoria</a>
                                <a href="#estatuto">Estatuto</a>
                                <a href="#estrutura">Estrutura Organizacional</a>
                                <a href="#cmec">CMEC</a>
                                <a href="#contatos">Contatos</a>
                            </div>
                        </li>
                        <li>SERVIÇOS</li>
                        <li>EVENTOS</li>
                    </ul>
                </nav>
                <div className="linha-azul"></div>
            </header>

            {/* Menu Mobile (Sobe ao clicar no sanduíche) */}
            <div className={menuOpen ? 'mobile-menu active' : 'mobile-menu'}>
                <div className="menu-item">
                    <span>Institucional</span>
                    <FaChevronDown />
                </div>
                <div className="menu-item">
                    <span>Serviços</span>
                    <FaChevronDown />
                </div>
                <div className="menu-item">
                    <span>Eventos</span>
                    <FaChevronDown />
                </div>
            </div>

            {/* Barra Inferior Fixa */}
            <div className="bottom-navbar">
                <div className="bottom-item toggle-btn" onClick={() => setMenuOpen(!menuOpen)}>
                    <div className="circle-icon">
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </div>
                </div>
                <div className="bottom-item"><FaHome /></div>
                <div className="bottom-item"><span>Serviços</span></div>
                <div className="bottom-item"><span>Notícias</span></div>
                <div className="bottom-item"><FaSearch /></div>
                <div className="bottom-item"><FaGlobeAmericas /></div>
            </div>
        </>
    );
}

export default Navbar;