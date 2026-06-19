function Dashboard() {
  const handleLogout = () => {
    localStorage.removeItem('acic_access_token');
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1>Painel Administrativo</h1>
      <p>Usuário autenticado com sucesso.</p>

      <button onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}

export default Dashboard;