import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Monitor,
  Users,
  Briefcase,
  CalendarDays,
  Newspaper,
  FileText,
  Settings,
  LogOut,
  Image as ImageIcon,
  Award
} from 'lucide-react';
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
    { name: 'Slides', path: '/admin/slides', icon: <ImageIcon size={32} strokeWidth={1.5} /> },
    { name: 'Páginas Institucionais', path: '/admin/quemsomos', icon: <FileText size={32} strokeWidth={1.5} /> },
    { name: 'Presidentes', path: '/admin/presidentes', icon: <Users size={32} strokeWidth={1.5} /> },
    { name: 'Diretoria', path: '/admin/diretoria', icon: <Briefcase size={32} strokeWidth={1.5} /> },
    { name: 'Serviços', path: '/admin/servicos', icon: <Settings size={32} strokeWidth={1.5} /> },
    { name: 'Patrocinadores', path: '/admin/patrocinadores', icon: <Award size={32} strokeWidth={1.5} /> },
    { name: 'Eventos', path: '/admin/eventos', icon: <CalendarDays size={32} strokeWidth={1.5} /> },
    { name: 'Notícias', path: '/admin/noticias', icon: <Newspaper size={32} strokeWidth={1.5} /> },
  ];

  return (
    <div className="admin-page-container">
      <Helmet>
        <title>Painel Administrativo | ACIC</title>
      </Helmet>
      <header className="admin-page-header">
        <div className="admin-header-title">
          <Monitor size={28} className="header-icon" />
          <h1>Painel Administrativo ACIC</h1>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </header>

      <div className="dashboard-welcome">
        <div className="welcome-content">
          <h2>Bem-vindo de volta{userName ? <>, <span className="highlight-name">{userName}</span></> : ''} 👋</h2>
          <p>O que você gostaria de gerenciar hoje?</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {adminModules.map((module, index) => (
          <Link key={index} to={module.path} className="dashboard-card">
            <div className="dashboard-card-icon">
              {module.icon}
            </div>
            <h3>{module.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;