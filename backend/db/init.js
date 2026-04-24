const pool = require('./index');

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      stripe_customer_id VARCHAR(255),
      plan VARCHAR(20) DEFAULT 'free',
      criado_em TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS clientes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      telefone VARCHAR(50),
      morada VARCHAR(500),
      notas TEXT,
      criado_em TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log('Tabelas criadas/verificadas com sucesso.');
  process.exit(0);
}

init().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
