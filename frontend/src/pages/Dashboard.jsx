import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getClientes, createCliente, updateCliente, deleteCliente } from '../api';
import ClienteModal from '../components/ClienteModal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [error, setError] = useState('');
  const [upgradeMsg, setUpgradeMsg] = useState('');

  useEffect(() => {
    if (searchParams.get('sucesso')) {
      window.history.replaceState({}, '', '/dashboard');
      setTimeout(() => window.location.reload(), 500);
    }
  }, [searchParams]);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getClientes(search);
      setClientes(res.data);
    } catch {
      setError('Erro ao carregar clientes.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchClientes, 300);
    return () => clearTimeout(t);
  }, [fetchClientes]);

  const handleSave = async (form) => {
    try {
      if (form.id) {
        await updateCliente(form.id, form);
      } else {
        await createCliente(form);
      }
      setModalOpen(false);
      setSelectedCliente(null);
      fetchClientes();
    } catch (err) {
      if (err.response?.data?.upgrade) {
        setUpgradeMsg(err.response.data.error);
        setModalOpen(false);
      } else {
        alert('Erro ao guardar cliente.');
      }
    }
  };

  const handleDelete = async (id, nome) => {
    if (!window.confirm(`Eliminar "${nome}"?`)) return;
    try {
      await deleteCliente(id);
      fetchClientes();
    } catch { alert('Erro ao eliminar.'); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Gestão de Clientes</h1>
          <span className={`badge-plan ${user?.plan}`}>{user?.plan === 'pro' ? 'PRO' : 'FREE'}</span>
        </div>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          {user?.plan !== 'pro' && (
            <button className="btn-upgrade" onClick={() => navigate('/precos')}>Upgrade Pro</button>
          )}
          <button className="btn-outline-sm" onClick={handleLogout}>Sair</button>
        </div>
      </header>

      {upgradeMsg && (
        <div className="upgrade-banner">
          {upgradeMsg} &nbsp;
          <button className="btn-primary" onClick={() => navigate('/precos')}>Ver Planos</button>
          <button className="btn-close" onClick={() => setUpgradeMsg('')}>✕</button>
        </div>
      )}

      <div className="toolbar">
        <input
          type="text"
          placeholder="Pesquisar por nome, email ou telefone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn-primary" onClick={() => { setSelectedCliente(null); setModalOpen(true); }}>
          + Novo Cliente
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {loading ? <div className="loading">A carregar...</div> : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Nome</th><th>Email</th><th>Telefone</th><th>Morada</th><th>Data</th><th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr><td colSpan={7} className="empty">Nenhum cliente encontrado.</td></tr>
              ) : clientes.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td><strong>{c.nome}</strong></td>
                  <td>{c.email || '—'}</td>
                  <td>{c.telefone || '—'}</td>
                  <td>{c.morada || '—'}</td>
                  <td>{new Date(c.criado_em).toLocaleDateString('pt-PT')}</td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => { setSelectedCliente(c); setModalOpen(true); }}>Editar</button>
                    <button className="btn-delete" onClick={() => handleDelete(c.id, c.nome)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total">
            {clientes.length} cliente(s)
            {user?.plan === 'free' && ` — Plano Free: ${clientes.length}/10`}
          </div>
        </div>
      )}

      {modalOpen && (
        <ClienteModal
          cliente={selectedCliente}
          onClose={() => { setModalOpen(false); setSelectedCliente(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
