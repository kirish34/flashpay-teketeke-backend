const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

//
// ✅ Log fare payment from a matatu
//
router.post('/pay', async (req, res) => {
  const { matatu, amount } = req.body;
  if (!matatu || !amount) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const tx = {
    matatu,
    amount: parseFloat(amount),
    date: new Date().toISOString(),
    status: 'paid'
  };

  const { error } = await supabase.from('teketeke_tx').insert([tx]);
  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true, message: 'Fare logged successfully' });
});

//
// ✅ Get all fare payments
//
router.get('/payments', async (req, res) => {
  const { data, error } = await supabase.from('teketeke_tx').select('*');
  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json(data);
});

//
// ✅ Daily summary (for SACCO dashboard)
//
router.get('/summary', async (req, res) => {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  const { data, error } = await supabase.from('teketeke_tx').select('*');
  if (error) return res.status(500).json({ success: false, error: error.message });

  const todayTx = data.filter(tx => tx.date.startsWith(today));

  const summary = {
    total: todayTx.reduce((sum, tx) => sum + parseFloat(tx.amount), 0),
    count: todayTx.length,
    byMatatu: {}
  };

  todayTx.forEach(tx => {
    if (!summary.byMatatu[tx.matatu]) summary.byMatatu[tx.matatu] = 0;
    summary.byMatatu[tx.matatu] += parseFloat(tx.amount);
  });

  res.json(summary);
});

module.exports = router;
