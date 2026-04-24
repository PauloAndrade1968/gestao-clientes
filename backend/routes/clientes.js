const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const LIMITE_FREE = 10;

// Listar clientes do utilizador
router.get('/', authMiddleware, async (req, res) => {
  const { search } = req.query;
  try {
    let query, params;
    if (search) {
      query = `SELECT * FROM clientes WHERE user_id=$1 AND (nome ILIKE $2 OR email ILIKE $2 OR telefone ILIKE $2) ORDER BY criado_em DESC`;
      params = [req.user.id, `%${search}%`];
    } else {
      query = 'SELECT * FROM clientes WHERE user_id=$1 ORDER BY criado_em DESC';
      params = [req.user.id];
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar cliente
router.post('/', authMiddleware, async (req, res) => {
  const { nome, email, telefone, morada, notas } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
  try {
    // Verificar limite do plano free
    const userResult = await pool.query('SELECT plan FROM users WHERE id=$1', [req.user.id]);
    const { plan } = userResult.rows[0];

    if (plan === 'free') {
      const count = await pool.query('SELECT COUNT(*) FROM clientes WHERE user_id=$1', [req.user.id]);
      if (parseInt(count.rows[0].count) >= LIMITE_FREE) {
        return res.status(403).json({ error: `Limite de ${LIMITE_FREE} clientes atingido. Faz upgrade para Pro.`, upgrade: true });
      }
    }

    const result = await pool.query(
      'INSERT INTO clientes (user_id, nome, email, telefone, morada, notas) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [req.user.id, nome, email, telefone, morada, notas]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar cliente
router.put('/:id', authMiddleware, async (req, res) => {
  const { nome, email, telefone, morada, notas } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
  try {
    const result = await pool.query(
      'UPDATE clientes SET nome=$1, email=$2, telefone=$3, morada=$4, notas=$5 WHERE id=$6 AND user_id=$7 RETURNING *',
      [nome, email, telefone, morada, notas, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar cliente
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM clientes WHERE id=$1 AND user_id=$2 RETURNING *', [req.params.id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json({ message: 'Cliente eliminado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
