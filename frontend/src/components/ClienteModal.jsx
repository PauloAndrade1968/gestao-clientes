import { useState, useEffect } from 'react';

export default function ClienteModal({ cliente, onClose, onSave }) {
  const [form, setForm] = useState({
    nome: '', email: '', telefone: '', morada: '', notas: ''
  });

  useEffect(() => {
    if (cliente) setForm(cliente);
  }, [cliente]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{cliente?.id ? 'Editar Cliente' : 'Novo Cliente'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nome *</label>
          <input name="nome" value={form.nome} onChange={handleChange} required placeholder="Nome completo" />

          <label>Email</label>
          <input name="email" value={form.email || ''} onChange={handleChange} placeholder="email@exemplo.com" type="email" />

          <label>Telefone</label>
          <input name="telefone" value={form.telefone || ''} onChange={handleChange} placeholder="+351 900 000 000" />

          <label>Morada</label>
          <input name="morada" value={form.morada || ''} onChange={handleChange} placeholder="Rua, Cidade" />

          <label>Notas</label>
          <textarea name="notas" value={form.notas || ''} onChange={handleChange} placeholder="Observações..." rows={3} />

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
