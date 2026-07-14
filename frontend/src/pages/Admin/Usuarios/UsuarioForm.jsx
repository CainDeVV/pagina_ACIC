import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminForm } from '@/hooks/useAdminForm';
import AdminFormLayout from '@/components/Admin/AdminFormLayout';
import { usuariosService } from '@/services/usuariosService';

function UsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { 
    formData, 
    loading: saving,
    fetching: loading, 
    error, 
    setError,
    handleChange
  } = useAdminForm({
    id,
    initialData: {
      name: '',
      email: '',
      password: '',
      role: 'EDITOR',
      active: true
    },
    service: usuariosService,
    redirectPath: '/admin/usuarios'
  });

  const loggedInUserId = React.useMemo(() => {
    const userStr = localStorage.getItem('acic_user');
    if (userStr) {
      try { return JSON.parse(userStr).id; } catch (e) { console.error('Erro ao fazer parse do usuario cacheado', e); }
    }
    return null;
  }, []);

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = { ...formData };
      if (isEdit && (!payload.password || payload.password.trim() === '')) {
        delete payload.password; // Remove senha vazia para não quebrar validação
      }

      let updatedUser;
      if (isEdit) {
        updatedUser = await usuariosService.atualizar(id, payload);
      } else {
        updatedUser = await usuariosService.criar(payload);
      }

      // Sincroniza cache local
      const userStr = localStorage.getItem('acic_user');
      if (userStr) {
        try {
          const loggedInUser = JSON.parse(userStr);
          if (loggedInUser.id === updatedUser.id) {
            const newCache = { ...loggedInUser, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role };
            localStorage.setItem('acic_user', JSON.stringify(newCache));
          }
        } catch(e) { console.error('Erro ao salvar no cache local', e); }
      }

      navigate('/admin/usuarios');
    } catch (err) {
      console.error(err);
      let errorMessage = 'Erro ao salvar os dados. Verifique e tente novamente.';
      if (err.response?.data?.message) {
        // Se o erro vier como Array (class-validator), transforma em string
        const msg = err.response.data.message;
        errorMessage = Array.isArray(msg) ? msg.join(' | ') : msg;
      }
      setError(errorMessage);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <AdminFormLayout
      title="Usuário"
      isEditing={isEdit}
      loading={saving}
      error={error}
      onSubmit={handleCustomSubmit}
      backPath="/admin/usuarios"
    >
      <div className="form-group">
        <label>Nome Completo *</label>
        <input 
          type="text" 
          name="name" 
          value={formData.name || ''} 
          onChange={handleChange} 
          required 
          placeholder="Ex: João da Silva"
        />
      </div>
      
      <div className="form-group">
        <label>E-mail *</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email || ''} 
          onChange={handleChange} 
          required 
          placeholder="Ex: admin@acic.local"
        />
      </div>

      <div className="form-group">
        <label>
          Senha {isEdit && <span style={{fontSize: '0.8rem', color: '#666'}}>(Deixe em branco para não alterar)</span>}
          {!isEdit && '*'}
        </label>
        <input 
          type="password" 
          name="password" 
          value={formData.password || ''} 
          onChange={handleChange} 
          required={!isEdit}
          minLength={6}
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      <div className="form-group">
        <label>Permissão (Cargo) *</label>
        <select 
          name="role" 
          value={formData.role || 'EDITOR'} 
          onChange={handleChange}
          disabled={isEdit && loggedInUserId === id} // Anti-Lockout
        >
          <option value="EDITOR">Editor (Pode criar e editar conteúdos gerais)</option>
          <option value="ADMIN">Administrador (Pode gerenciar usuários e configurações do sistema)</option>
        </select>
        {isEdit && loggedInUserId === id && (
          <small style={{color: '#f39c12', display: 'block', marginTop: '5px'}}>
            Você não pode rebaixar seu próprio cargo. Peça a outro Administrador se for necessário.
          </small>
        )}
      </div>
    </AdminFormLayout>
  );
}

export default UsuarioForm;
