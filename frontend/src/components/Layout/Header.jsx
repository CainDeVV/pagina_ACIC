import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/ACIC.png'; 

const MENU_ITEMS = [
  {
    title: 'Institucional',
    dropdown: [
      { label: 'Quem Somos', path: '/quem-somos' },
      { label: 'Diretoria', path: '/diretoria' },
      { label: 'Estatuto', path: '/estatuto' },
      { label: 'Estrutura Organizacional', path: '/estrutura-organizacional' },
      { label: 'CMEC', path: '/cmec' },
      { label: 'Contatos', path: '/contatos' },
      { label: 'Galeria de Presidentes', path: '/galeria-presidentes' },
    ]
  },
  {
    title: 'Serviços',
    path: '/servicos',
    dropdown: [
      { label: 'Registro de Marcas e Patentes', path: '/servicos/registro-de-marcas-softwares-e-patentes' },
      { label: 'Certificado de Origem', path: '/servicos/certificado-de-origem' },
      { label: 'Certificado Digital', path: '/servicos/certificado-digital' },
    ]
  },
  { title: 'Eventos', path: '/eventos' },
  { title: 'Notícias', path: '/noticias' }
];

function Header() {
  return (
    <header className="header-container">
      <div className="header-content">
        <Link to="/"><img src={logo} alt="Logo ACIC" className="logo" /></Link>
        
        <nav className="nav-menu">
          <ul>
            {MENU_ITEMS.map((item, idx) => (
              <li key={idx} className={item.dropdown ? 'dropdown' : ''}>
                {item.path ? (
                  <Link to={item.path} className="nav-btn">{item.title}</Link>
                ) : (
                  <span className="nav-btn">{item.title}</span>
                )}
                
                {item.dropdown && (
                  <div className="dropdown-content">
                    {item.dropdown.map((sub, subIdx) => (
                      <Link key={subIdx} to={sub.path}>{sub.label}</Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;