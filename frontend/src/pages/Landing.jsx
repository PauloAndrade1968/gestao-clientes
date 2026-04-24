import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="landing">
      <nav className="nav">
        <div className="nav-logo">ClientePro</div>
        <div className="nav-links">
          <button className="btn-outline-sm" onClick={() => navigate('/precos')}>Preços</button>
          <button className="btn-outline-sm" onClick={() => navigate('/login')}>Entrar</button>
          <button className="btn-primary" onClick={() => navigate('/registo')}>Começar grátis</button>
        </div>
      </nav>

      <section className="hero-section">
        <h1>Gere os teus clientes<br /><span className="highlight">de forma simples</span></h1>
        <p>Organiza, pesquisa e mantém o controlo de todos os teus clientes num só lugar. Grátis para começar.</p>
        <button className="btn-hero" onClick={() => navigate('/registo')}>Começar Grátis →</button>
      </section>

      <section className="features">
        <div className="feature">
          <div className="feature-icon">📋</div>
          <h3>Organizado</h3>
          <p>Todos os dados dos teus clientes num único lugar</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🔍</div>
          <h3>Pesquisa Rápida</h3>
          <p>Encontra qualquer cliente em segundos</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🔒</div>
          <h3>Seguro</h3>
          <p>Os teus dados são privados e protegidos</p>
        </div>
      </section>
    </div>
  );
}
