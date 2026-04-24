import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Registo() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('https://gestao-clientes-api-jpsx.onrender.com/api/auth/register', form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao registar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>Criar Conta</h1>
        <p className="auth-sub">Grátis para sempre até 10 clientes</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="email@exemplo.com" />
          <label>Password</label>
          <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required placeholder="Mínimo 6 caracteres" />
          <button className="btn-primary full" disabled={loading}>{loading ? 'A criar conta...' : 'Criar Conta Grátis'}</button>
        </form>
        <p className="auth-link">Já tens conta? <Link to="/login">Entrar</Link></p>
      </div>
    </div>
  );
}
