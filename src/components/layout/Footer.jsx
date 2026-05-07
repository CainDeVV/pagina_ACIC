import '../../styles/footer.css';
import logo from '../../assets/logo.png';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        {/* Coluna 1: Logo e Sobre */}
        <div className="footer-col">
          <img src={logo} alt="Logo ACIC" className="footer-logo" />
          <p>Focada em fortalecer o empreendedorismo local, conectar e capacitar a classe empresarial de Crateús e região.</p>
        </div>

        {/* Coluna 2: Links Rápidos */}
        <div className="footer-col">
          <h3>Acesso Rápido</h3>
          <ul>
            <li>Institucional</li>
            <li>Galeria de Presidentes</li>
            <li>Serviços</li>
            <li>Agenda de Eventos</li>
          </ul>
        </div>

        {/* Coluna 3: Contatos */}
        <div className="footer-col">
          <h3>Fale Conosco</h3>
          <p>📍 Rua Exemplo, 123 - Centro</p>
          <p>📞 (88) 99999-9999</p>
          <p>✉️ contato@asic.org.br</p>
        </div>

      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 ACIC. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;