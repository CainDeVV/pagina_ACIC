import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminForm } from '@/hooks/useAdminForm';
import AdminFormLayout from '@/components/Admin/AdminFormLayout';
import { usuariosService } from '@/services/usuariosService';
import api from '@/services/api';

function UsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

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

  const requestOtp = async () => {
    setIsSendingOtp(true);
    setOtpError('');
    try {
      await api.post('/auth/request-action-otp');
    } catch (err) {
      setOtpError('Falha ao enviar código. Tente novamente.');
      console.error(err);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleCustomSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setOtpError('');
    try {
      const payload = { ...formData };
      if (isEdit && (!payload.password || payload.password.trim() === '')) {
        delete payload.password; // Remove senha vazia para não quebrar validação
      }

      if (showOtpModal && otpCode) {
        payload.otpCode = otpCode;
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
      
      const msg = err.response?.data?.message;
      if (msg === 'OTP_REQUIRED' || msg === 'OTP_EXPIRED' || msg === 'Código OTP incorreto.') {
        if (!showOtpModal) {
          setShowOtpModal(true);
          await requestOtp();
        } else {
          setOtpError(msg === 'OTP_REQUIRED' ? 'Digite o código para continuar.' : msg === 'OTP_EXPIRED' ? 'Código expirado. Solicite outro.' : 'Código incorreto.');
        }
        return;
      }

      let errorMessage = 'Erro ao salvar os dados. Verifique e tente novamente.';
      if (err.response?.data?.message) {
        errorMessage = Array.isArray(msg) ? msg.join(' | ') : msg;
      }
      setError(errorMessage);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <>
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
            Senha {isEdit && <span className="admin-field-hint">(Deixe em branco para não alterar)</span>}
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
            <small className="admin-field-error">
              Você não pode rebaixar seu próprio cargo. Peça a outro Administrador se for necessário.
            </small>
          )}
        </div>
      </AdminFormLayout>

      {/* Modal de OTP Simples */}
      {showOtpModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
          justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
          <div style={{
            background: 'white', padding: '30px', borderRadius: '8px', 
            maxWidth: '400px', width: '100%', textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '15px' }}>Verificação de Segurança</h3>
            <p style={{ marginBottom: '20px', color: '#4a5568', fontSize: '14px' }}>
              Enviamos um código para o <strong>seu e-mail de administrador</strong>.
              <br/>Insira o código abaixo para confirmar a alteração de senha.
            </p>
            
            <input 
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              style={{
                width: '100%', padding: '12px', fontSize: '24px', 
                textAlign: 'center', letterSpacing: '8px', marginBottom: '15px',
                border: '1px solid #ccc', borderRadius: '4px'
              }}
            />
            
            {otpError && <p style={{ color: 'red', marginBottom: '15px', fontSize: '14px' }}>{otpError}</p>}
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowOtpModal(false)}
                style={{ padding: '10px 20px', border: 'none', background: '#e2e8f0', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleCustomSubmit}
                disabled={otpCode.length !== 6 || saving}
                style={{ padding: '10px 20px', border: 'none', background: '#3182ce', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
              >
                {saving ? 'Verificando...' : 'Confirmar'}
              </button>
            </div>
            
            <button 
              onClick={requestOtp}
              disabled={isSendingOtp}
              style={{ marginTop: '20px', background: 'none', border: 'none', color: '#3182ce', textDecoration: 'underline', cursor: 'pointer' }}
            >
              {isSendingOtp ? 'Enviando...' : 'Reenviar código'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
export default UsuarioForm;
