// routes/cashiers.js
const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

const ussdPrefix = '*123*'; // Update if your USSD base code changes

// 🔢 Generate 1-digit branch number (1–9)
function getBranchDigit(name) {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (hash % 9) + 1;
}

// ✅ Get all cashiers
router.get('/all', async (_, res) => {
  const { data, error } = await supabase.from('cashiers').select('*');
  if (error) return res.status(500).json({ success: false, error });
  res.json(data);
});

// ✅ Register a new cashier
router.post('/add', async (req, res) => {
  const { branchName, cashierId } = req.body;
  if (!branchName || !cashierId) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const base = getBranchDigit(branchName);
  const checksum = base - cashierId;
  const ussdCode = `${ussdPrefix}${base}${cashierId}${checksum}#`;

  const newCashier = {
    branchName,
    cashierId,
    ussdCode,
    status: 'active'
  };

  const { error } = await supabase.from('cashiers').insert([newCashier]);
  if (error) return res.status(500).json({ success: false, error });

  res.json({ success: true, cashier: newCashier });
});

// ✅ Delete a cashier
router.post('/delete', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ success: false, message: 'Missing ID' });

  const { error } = await supabase.from('cashiers').delete().eq('id', id);
  if (error) return res.status(500).json({ success: false, error });

  res.json({ success: true });
});

module.exports = router;
