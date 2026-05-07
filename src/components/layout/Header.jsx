import '../../styles/header.css';
import logo from '../../assets/logo.png'; 

function Header() {
  return (
    <header className="header-container">
      <div className="header-content">
        <img src={logo} alt="Logo ACIC" className="logo" />
        
        <nav className="nav-menu">
          <ul>
            <li>Institucional</li>
            <li>Serviços</li>
            <li>Eventos</li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;