import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Precos() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    if (!user) { navigate('/registo'); return; }
    try {
      const res = await axios.post('http://localhost:3001/api/stripe/checkout');
      window.location.href = res.data.url;
    } catch (err) {
      alert('Erro ao iniciar pagamento: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="precos-page">
      <h1>Planos e Preços</h1>
      <p className="precos-sub">Simples, transparente, sem surpresas.</p>

      <div className="planos">
        <div className="plano">
          <div className="plano-nome">Gratuito</div>
          <div className="plano-preco">0€ <span>/mês</span></div>
          <ul>
            <li>Até 10 clientes</li>
            <li>Pesquisa básica</li>
            <li>Adicionar / Editar / Eliminar</li>
          </ul>
          <button className="btn-outline" onClick={() => navigate('/registo')}>Começar grátis</button>
        </div>

        <div className="plano destaque">
          <div className="badge">MAIS POPULAR</div>
          <div className="plano-nome">Pro</div>
          <div className="plano-preco">9,99€ <span>/mês</span></div>
          <ul>
            <li>Clientes ilimitados</li>
            <li>Pesquisa avançada</li>
            <li>Exportar dados</li>
            <li>Suporte prioritário</li>
          </ul>
          <button className="btn-primary" onClick={handleUpgrade}>
            {user?.plan === 'pro' ? 'Plano atual' : 'Ativar Pro'}
          </button>
        </div>
      </div>
    </div>
  );
}
