import api from '@/services/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    // Etapa 1: credenciais
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Etapa 2: OTP
    const [step, setStep] = useState(1); // 1 = credenciais, 2 = OTP
    const [otpCode, setOtpCode] = useState('');

    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    // ── Etapa 1: envia email + senha, recebe "requiresOtp: true" ──────────────
    const handleSubmitCredenciais = async (e) => {
        e.preventDefault();

        if (!email.trim()) { setErro('O email é obrigatório.'); return; }
        if (!password.trim()) { setErro('A senha é obrigatória.'); return; }

        setErro('');
        setLoading(true);

        try {
            await api.post('/auth/login', { email, password });
            // Backend retorna { requiresOtp: true, email } — vamos para etapa 2
            setStep(2);
        } catch (error) {
            setErro('Email ou senha inválidos.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ── Etapa 2: envia código OTP, recebe tokens e autentica ──────────────────
    const handleSubmitOtp = async (e) => {
        e.preventDefault();

        if (!otpCode.trim() || otpCode.length !== 6) {
            setErro('Digite o código de 6 dígitos enviado ao seu email.');
            return;
        }

        setErro('');
        setLoading(true);

        try {
            const response = await api.post('/auth/verify-otp', {
                email,
                code: otpCode,
            });

            const { access_token, refresh_token, user } = response.data;
            login(user, access_token, refresh_token);

            if (user.role === 'ADMIN' || user.role === 'EDITOR') {
                navigate('/admin');
            } else if (user.role === 'ASSOCIADO') {
                navigate('/associado');
            } else {
                navigate('/');
            }
        } catch (error) {
            const msg = error?.response?.data?.message;
            if (msg?.includes('expirou')) {
                setErro('O código expirou. Faça o login novamente.');
                setStep(1);
                setOtpCode('');
            } else {
                setErro('Código incorreto. Tente novamente.');
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Helmet>
                <title>Login Administrativo | ACIC</title>
            </Helmet>
            <div className="login-card">
                <h1>Login Administrativo</h1>

                {/* ── ETAPA 1: Email + Senha ── */}
                {step === 1 && (
                    <form onSubmit={handleSubmitCredenciais}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                id="login-email"
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <label>Senha</label>
                            <input
                                id="login-password"
                                type="password"
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                        </div>

                        {erro && (
                            <p style={{ color: 'red', marginBottom: '10px' }}>{erro}</p>
                        )}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? 'Verificando...' : 'Entrar'}
                        </button>
                    </form>
                )}

                {/* ── ETAPA 2: Código OTP ── */}
                {step === 2 && (
                    <form onSubmit={handleSubmitOtp}>
                        <p style={{ color: '#4a5568', marginBottom: '16px', textAlign: 'center', fontSize: '14px' }}>
                            Enviamos um código de 6 dígitos para <strong>{email}</strong>.
                            <br />Verifique sua caixa de entrada.
                        </p>

                        <div className="form-group">
                            <label>Código de verificação</label>
                            <input
                                id="login-otp"
                                type="text"
                                placeholder="000000"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                                autoComplete="one-time-code"
                                inputMode="numeric"
                                style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
                            />
                        </div>

                        {erro && (
                            <p style={{ color: 'red', marginBottom: '10px' }}>{erro}</p>
                        )}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? 'Verificando...' : 'Confirmar código'}
                        </button>

                        <button
                            type="button"
                            onClick={() => { setStep(1); setErro(''); setOtpCode(''); }}
                            style={{
                                display: 'block',
                                width: '100%',
                                marginTop: '8px',
                                background: 'none',
                                border: 'none',
                                color: '#718096',
                                cursor: 'pointer',
                                fontSize: '13px',
                                textDecoration: 'underline',
                            }}
                        >
                            ← Voltar e usar outro email
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Login;