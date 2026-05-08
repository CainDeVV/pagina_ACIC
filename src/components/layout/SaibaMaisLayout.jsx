import '../../styles/institucional/saibaMaisLayout.css';

// O 'children' é o conteúdo específico de cada página que vai ser renderizado aqui dentro
function SaibaMaisLayout({ titulo, children }) {
  return (
    <div className="institucional-page">
      
      {/* Breadcrumb */}
      <div className="breadcrumb">
        Institucional &gt; <span className="atual">{titulo}</span>
      </div>

      <div className="institucional-container">
        
        {/* Menu Lateral (Sidebar) */}
        <aside className="sidebar">
          <h3>Saiba Mais <span>&#709;</span></h3>
          <ul>
            <li><a href="#quem-somos">Quem Somos</a></li>
            <li><a href="#diretoria">Diretoria</a></li>
            <li><a href="#estatuto">Estatuto</a></li>
            <li><a href="#estrutura">Estrutura Organizacional</a></li>
            <li><a href="#cmec" className={titulo === "CMEC" ? "ativo" : ""}>CMEC</a></li>
            <li><a href="#contatos">Contatos</a></li>
            <li><a href="#identidade">Identidade Visual</a></li>
          </ul>
        </aside>

        {/* Conteúdo dinâmico da página */}
        <main className="institucional-content">
          {children}
        </main>

      </div>
    </div>
  );
}

export default SaibaMaisLayout;