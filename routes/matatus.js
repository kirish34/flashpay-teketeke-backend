// routes/matatus.js
const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

// ✅ Register Matatu
router.post('/register', async (req, res) => {
  const { data, error } = await supabase.from('matatus').insert([req.body]);
  if (error) return res.status(400).json({ success: false, error });
  res.json({ success: true, matatu: data[0] });
});

// ✅ Update Matatu
router.post('/update', async (req, res) => {
  const { id, ...fields } = req.body;
  if (!id) return res.status(400).json({ success: false, message: 'Missing Matatu ID' });

  const { error } = await supabase.from('matatus').update(fields).eq('id', id);
  if (error) return res.status(400).json({ success: false, error });
  res.json({ success: true });
});

module.exports = router;
