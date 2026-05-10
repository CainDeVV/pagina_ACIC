import '../../styles/header.css';
import logo from '../../assets/logo.png';
import Navbar from '../Navbar/Navbar';

function Header() {
  return (
    <>
      {/* Header original - permanece igual no desktop */}
      <header className="header-container">
        <div className="header-content">
          <img src={logo} alt="Logo ACIC" className="logo" />

          <nav className="nav-menu">
            <ul>
              <li className="dropdown">
                Institucional
                <div className="dropdown-content">
                  <a href="#quem-somos">Quem Somos</a>
                  <a href="#diretoria">Diretoria</a>
                  <a href="#estatuto">Estatuto</a>
                  <a href="#estrutura">Estrutura Organizacional</a>
                  <a href="#cmec">CMEC</a>
                  <a href="#contatos">Contatos</a>
                </div>
              </li>
              <li>Serviços</li>
              <li>Eventos</li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Navbar mobile (aparece apenas via CSS em telas pequenas) */}
      <Navbar />
    </>
  );
}

export default Header;