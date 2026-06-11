import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/ACIC.png'; 

function Header() {
  return (
    <header className="header-container">
      <div className="header-content">
        <Link to="/"><img src={logo} alt="Logo ACIC" className="logo" /></Link>
        
        <nav className="nav-menu">
          <ul>
            <li className="dropdown">
              Institucional
              <div className="dropdown-content">
                <Link to="/quem-somos">Quem Somos</Link>
                <Link to="/diretoria">Diretoria</Link>
                <Link to="/estatuto">Estatuto</Link>
                <Link to="/estrutura-organizacional">Estrutura Organizacional</Link>
                <Link to="/cmec">CMEC</Link>
                <Link to="/contatos">Contatos</Link>
                <Link to="/galeria-presidentes">Galeria de Presidentes</Link>
              </div>
            </li>
            <li className="dropdown">
              <Link to="/servicos" style={{ color: 'inherit', textDecoration: 'none' }}>
                Serviços
              </Link>
              <div className="dropdown-content">
                <Link to="/servicos/registro-de-marcas">Registro de Marcas e Patentes</Link>
                <Link to="/servicos/certificado-de-origem">Certificado de Origem</Link>
                <Link to="/servicos/certificado-digital">Certificado Digital</Link>
              </div>
            </li>
            <li>
              <Link to="/eventos" style={{ color: 'inherit', textDecoration: 'none' }}>
                Eventos
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;