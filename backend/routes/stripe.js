const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// Criar sessão de checkout
router.post('/checkout', authMiddleware, async (req, res) => {
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email });
      customerId = customer.id;
      await pool.query('UPDATE users SET stripe_customer_id = $1 WHERE id = $2', [customerId, user.id]);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/dashboard?sucesso=1`,
      cancel_url: `${process.env.FRONTEND_URL}/precos`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Portal de faturação (cancelar/gerir subscrição)
router.post('/portal', authMiddleware, async (req, res) => {
  try {
    const userResult = await pool.query('SELECT stripe_customer_id FROM users WHERE id = $1', [req.user.id]);
    const { stripe_customer_id } = userResult.rows[0];

    if (!stripe_customer_id) return res.status(400).json({ error: 'Sem subscrição ativa' });

    const session = await stripe.billingPortal.sessions.create({
      customer: stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/dashboard`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook Stripe (atualizar plano automaticamente)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed' || event.type === 'invoice.paid') {
    const customerId = event.data.object.customer;
    await pool.query('UPDATE users SET plan = $1 WHERE stripe_customer_id = $2', ['pro', customerId]);
  }

  if (event.type === 'customer.subscription.deleted') {
    const customerId = event.data.object.customer;
    await pool.query('UPDATE users SET plan = $1 WHERE stripe_customer_id = $2', ['free', customerId]);
  }

  res.json({ received: true });
});

module.exports = router;
