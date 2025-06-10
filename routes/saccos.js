// routes/saccos.js
const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

// Create SACCO
router.post('/register', async (req, res) => {
  const { data, error } = await supabase.from('saccos').insert([req.body]);
  if (error) return res.status(400).json({ success: false, error });
  res.json({ success: true, data });
});

// Update SACCO
router.post('/update', async (req, res) => {
  const { id, ...fields } = req.body;
  const { error } = await supabase.from('saccos').update(fields).eq('id', id);
  if (error) return res.status(400).json({ success: false, error });
  res.json({ success: true });
});

module.exports = router;
