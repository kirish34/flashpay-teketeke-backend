const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

router.get('/', async (_, res) => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // FlashPay Bills
  const { data: flashpay, error: err1 } = await supabase
    .from('flashpay_bills')
    .select('*');
  if (err1) return res.status(500).json({ error: err1.message });

  const todayFlash = flashpay.filter(b => new Date(b.createdAt).toISOString().startsWith(today));
  const flashpayTotal = todayFlash.reduce((sum, b) => sum + parseFloat(b.amount), 0);

  // POS Bills
  const { data: pos, error: err2 } = await supabase
    .from('pos_bills')
    .select('*');
  if (err2) return res.status(500).json({ error: err2.message });

  const todayPos = pos.filter(b => new Date(b.createdAt).toISOString().startsWith(today));
  const posTotal = todayPos.reduce((sum, b) => sum + parseFloat(b.amount), 0);

  // Matatu Payments
  const { data: txs, error: err3 } = await supabase
    .from('teketeke_tx')
    .select('*');
  if (err3) return res.status(500).json({ error: err3.message });

  const todayTx = txs.filter(tx => tx.date.startsWith(today));
  const matatuSummary = {
    total: todayTx.reduce((sum, tx) => sum + parseFloat(tx.amount), 0),
    count: todayTx.length,
    byMatatu: {}
  };
  todayTx.forEach(tx => {
    if (!matatuSummary.byMatatu[tx.matatu]) matatuSummary.byMatatu[tx.matatu] = 0;
    matatuSummary.byMatatu[tx.matatu] += parseFloat(tx.amount);
  });

  res.json({
    date: today,
    flashpayTotal,
    flashpayCount: todayFlash.length,
    posTotal,
    posCount: todayPos.length,
    matatuPayments: matatuSummary
  });
});

module.exports = router;
