import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../../components/Admin/AdminGlobal.css';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('acic_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || '');
      } catch (error) {
        console.error('Erro ao fazer parse do usuário no localStorage', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('acic_access_token');
    localStorage.removeItem('acic_user');
    navigate('/login');
  };

  const adminModules = [
    { name: 'Slides', path: '/admin/slides' },
    { name: 'Presidentes', path: '/admin/presidentes' },
    { name: 'Diretoria', path: '/admin/diretoria' },
    { name: 'Serviços', path: '/admin/servicos' },
    { name: 'Eventos', path: '/admin/eventos' },
    { name: 'Notícias', path: '/admin/noticias' },
    { name: 'Páginas Institucionais', path: '/admin/quemsomos' },
  ];

  return (
    <div className="admin-page-container">
      {/* Reaproveitamos a classe global do cabeçalho que já criamos antes */}
      <header className="admin-page-header" style={{ borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '16px' }}>
        <h1>Painel Administrativo — ACIC</h1>
        <button className="btn-logout" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <div className="dashboard-welcome">
        <p>Bem-vindo{userName ? <>, <strong>{userName}</strong></> : ''}!</p>
        <p className="dashboard-subtitle">Selecione o módulo que deseja gerenciar:</p>
      </div>

      <div className="dashboard-grid">
        {adminModules.map((module, index) => (
          <Link key={index} to={module.path} className="dashboard-card">
            <h2>{module.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;