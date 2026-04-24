import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Registo from './pages/Registo';
import Dashboard from './pages/Dashboard';
import Precos from './pages/Precos';
import './App.css';

function RotaProtegida({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">A carregar...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registo" element={<Registo />} />
          <Route path="/precos" element={<Precos />} />
          <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
