const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./routes/auth');
const clientesRouter = require('./routes/clientes');
const stripeRouter = require('./routes/stripe');

const app = express();
const PORT = process.env.PORT || 3001;

// Webhook do Stripe precisa de raw body - deve vir antes do express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/stripe', stripeRouter);

app.get('/', (req, res) => res.json({ message: 'API Gestão de Clientes SaaS' }));

app.listen(PORT, () => console.log(`Servidor a correr em http://localhost:${PORT}`));
