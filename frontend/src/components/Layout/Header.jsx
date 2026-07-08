import { Link } from 'react-router-dom';
import './Header.css';
import logo from '@/assets/ACIC.png';

import { MAIN_MENU } from '@/constants/menu';

function Header() {
  return (
    <header className="header-container">
      <div className="header-content">
        <Link to="/"><img src={logo} alt="Logo ACIC" className="logo" /></Link>

        <nav className="nav-menu">
          <ul>
            {MAIN_MENU.map((item, idx) => (
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