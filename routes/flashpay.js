// routes/flashpay.js
const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

// ✅ Cashier saves a bill
router.post('/save', async (req, res) => {
  const { ussdCode, amount, till } = req.body;
  if (!ussdCode || !amount || !till) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const bill = {
    ussdCode,
    amount,
    till,
    status: 'waiting',
    createdAt: Date.now()
  };

  const { data, error } = await supabase.from('flashpay_bills').insert([bill]);

  if (error) return res.status(500).json({ success: false, error });

  res.json({ success: true, bill: data?.[0] || bill }); // Safe fallback
});

// ✅ Customer dials USSD — mark as paid
router.post('/confirm', async (req, res) => {
  const { ussdCode, phone } = req.body;

  const { data, error } = await supabase
    .from('flashpay_bills')
    .select('*')
    .eq('ussdCode', ussdCode)
    .eq('status', 'waiting')
    .order('createdAt', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return res.status(404).json({ success: false, message: 'No pending bill found' });
  }

  const updated = {
    phone,
    status: 'paid'
  };

  const { error: updateError } = await supabase
    .from('flashpay_bills')
    .update(updated)
    .eq('id', data.id);

  if (updateError) return res.status(500).json({ success: false, updateError });

  console.log(`📲 STK simulated for ${phone} → KES ${data.amount} Till ${data.till}`);
  res.json({ success: true, message: 'STK simulated and bill marked as paid' });
});

// ✅ Fetch all unpaid bills
router.get('/active', async (_, res) => {
  const { data, error } = await supabase
    .from('flashpay_bills')
    .select('*')
    .eq('status', 'waiting')
    .order('createdAt', { ascending: false });

  if (error) return res.status(500).json({ success: false, error });

  res.json(data);
});

module.exports = router;
