import './Navbar.css'
import{ useState} from 'react'
import logo from '../../assets/logo'

import{
    FaBars,
    FaTimes, 
    FaChevronDown,
    FaHome,
    FaSearch,
    FaGlobeAmericas
} from 'react-icons/fa'

function Navbar(){
    const [menuOpen, setMenuOpen] = useState(false)
    return(
    <>
        <header className="header">
            <nav className="navbar">
                <div className="logo">
                    <img src={logo} alt="logo.png" />
                </div>
                <ul className="nav-links">
                    <li>INATITUCIONAL</li>
                    <LI>SERVIÇOS</LI>
                    <LI>EVENTOS</LI>
                </ul>

                <button className="hamburguer" onClick={() => setMenuOpen(!menuOpen)}>
                    {
                        menuOpen 
                        ? <FaTimes/> 
                        : <FaBars/>
                    }
                </button>
            </nav>

            <div className="linha-azul"></div>
             
        </header>

        <div className={menuOpen ? 'mobile-menu active' : 'mobile-menu'}>
            <div className="menu-item">
                    <span>Institucional</span>
                    <FaChevronDown/>
            </div>

            <div className="menu-item">
                <span>Para Entidades</span>
                <FaChevronDown />
            </div>

            <div className="menu-item">
                <span>Serviços</span>
                <FaChevronDown />
            </div>

            <div className="menu-item">
                <span>Comunicação</span>
                <FaChevronDown />
            </div>

            <div className="menu-item">
                <span>LLE</span>
            </div>

            <div className="eventos-box">
                <span>Eventos</span>
            </div>

        </div>

        {/* NAVBAR INFERIOR MOBILE */}

        <div className="bottom-navbar">

            <div
            className="bottom-item close"
            onClick={() => setMenuOpen(false)}
            >
            <FaTimes />
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
    )
}

export default Navbar