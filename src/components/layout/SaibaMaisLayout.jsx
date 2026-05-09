import '../../styles/institucional/saibaMaisLayout.css';

// O 'children' é o conteúdo específico de cada página que vai ser renderizado aqui dentro
function SaibaMaisLayout({ titulo, children }) {
  return (
    <div className="institucional-page">
      
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="#institucional">Institucional</a> 
        <span className="separador">&gt;</span> 
        <span className="atual">{titulo}</span>
      </div>

      <div className="institucional-container">
        
        {/* Menu Lateral (Sidebar) */}
        <aside className="sidebar">
          <h3>Saiba Mais <span>&#709;</span></h3>
          <ul>
            <li><a href="#quem-somos" className={titulo === "Quem Somos" ? "ativo" : ""}>Quem Somos</a></li>
            <li><a href="#diretoria" className={titulo === "Diretoria" ? "ativo" : ""}>Diretoria</a></li>
            <li><a href="#estatuto" className={titulo === "Estatuto" ? "ativo" : ""}>Estatuto</a></li>
            <li><a href="#estrutura" className={titulo === "Estrutura Organizacional" ? "ativo" : ""}>Estrutura Organizacional</a></li>
            <li><a href="#cmec" className={titulo === "CMEC" ? "ativo" : ""}>CMEC</a></li>
            <li><a href="#contatos" className={titulo === "Contatos" ? "ativo" : ""}>Contatos</a></li>
            <li><a href="#identidade" className={titulo === "Identidade Visual" ? "ativo" : ""}>Identidade Visual</a></li>
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