import api from '../../../services/api';
import { useState } from 'react';
import './Login.css';

function Login() {
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

    localStorage.setItem(
      'acic_access_token',
      response.data.access_token
    );
   window.location.href = '/admin';

    console.log('Login realizado com sucesso!');
    console.log(response.data);

  } catch (error) {
    setErro('Email ou senha inválidos.');
    console.error(error);
  }
};

  return (
    <div className="login-container">
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

          <button type="submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;