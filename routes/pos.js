// routes/pos.js
const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

// ✅ Create a new POS bill
router.post('/send-bill', async (req, res) => {
  const { amount, phone, tillNumber } = req.body;

  if (!amount || !phone || !tillNumber) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const txCode = Math.floor(1000 + Math.random() * 9000).toString();

  const newBill = {
    txCode,
    amount: parseFloat(amount),
    phone,
    till: tillNumber,
    status: 'pending',
    createdAt: Date.now()
  };

  const { error } = await supabase.from('pos_bills').insert([newBill]);
  if (error) return res.status(500).json({ success: false, error: error.message });

  console.log(`🧾 POS Bill Created: ${txCode} - KES ${amount} for ${phone}`);
  res.json({ success: true, txCode, message: 'Bill created, waiting for payment' });
});

// ✅ Check transaction status
router.get('/check/:code', async (req, res) => {
  const { data, error } = await supabase
    .from('pos_bills')
    .select('*')
    .eq('txCode', req.params.code)
    .single();

  if (error || !data) {
    return res.status(404).json({ success: false, message: 'TX not found' });
  }

  res.json({ success: true, status: data.status || 'pending' });
});

module.exports = router;
