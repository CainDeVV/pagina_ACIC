import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Atualiza o state para que a próxima renderização mostre a UI de fallback.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Você também pode registrar o erro em um serviço de relatórios de erro (ex: Sentry)
    console.error("ErrorBoundary detectou um erro crítico:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI de fallback alternativa
      return (
        <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#d9534f' }}>Ops! Algo deu errado.</h1>
          <p>Encontramos um erro inesperado ao carregar esta parte do sistema.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', marginTop: '20px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Tentar Novamente
          </button>
          
          {/* Apenas visível em ambiente de desenvolvimento */}
          {import.meta.env.MODE === 'development' && this.state.error && (
            <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left', marginTop: '40px', background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
              <summary>Detalhes do Erro Técnico</summary>
              <br />
              {this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
