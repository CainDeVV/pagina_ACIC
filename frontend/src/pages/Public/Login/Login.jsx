import api from '../../../services/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../../contexts/AuthContext';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setErro('O email é obrigatório.');
            return;
        }

        if (!password.trim()) {
            setErro('A senha é obrigatória.');
            return;
        }

        try {
            setErro('');

            const response = await api.post('/auth/login', {
                email,
                password,
            });

            const { access_token, user } = response.data;

            // Injeta dados no Cérebro (Context) que cuidará do localStorage de forma segura
            login(user, access_token);

            if (user.role === 'ADMIN' || user.role === 'EDITOR') {
                navigate('/admin');
            } else if (user.role === 'ASSOCIADO') {
                navigate('/associado');
            } else {
                navigate('/');
            }

        } catch (error) {
            setErro('Email ou senha inválidos.');
            console.error(error);
        }
    };

    return (
        <div className="login-container">
            <Helmet>
                <title>Login Administrativo | ACIC</title>
            </Helmet>
            <div className="login-card">
                <h1>Login Administrativo</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Digite seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Senha</label>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {erro && (
                        <p style={{ color: 'red', marginBottom: '10px' }}>
                            {erro}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;