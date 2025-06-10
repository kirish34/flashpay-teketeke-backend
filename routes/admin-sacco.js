const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

//
// ========== SACCOs ==========
//

router.post('/register-sacco', async (req, res) => {
  const newSacco = { ...req.body, timestamp: Date.now() };
  const { data, error } = await supabase.from('saccos').insert([newSacco]).select();

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, sacco: data[0] });
});

router.post('/update-sacco', async (req, res) => {
  const { id, ...fields } = req.body;
  const { error } = await supabase.from('saccos').update(fields).eq('id', id);

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true });
});

router.delete('/delete-sacco/:id', async (req, res) => {
  const { error } = await supabase.from('saccos').delete().eq('id', req.params.id);

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true });
});

//
// ========== MATATUS ==========
//

router.post('/register-matatu', async (req, res) => {
  const newMatatu = { ...req.body, timestamp: Date.now() };
  const { data, error } = await supabase.from('matatus').insert([newMatatu]).select();

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, matatu: data[0] });
});

router.post('/update-matatu', async (req, res) => {
  const { id, ...fields } = req.body;
  const { error } = await supabase.from('matatus').update(fields).eq('id', id);

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true });
});

router.delete('/delete-matatu/:id', async (req, res) => {
  const { error } = await supabase.from('matatus').delete().eq('id', req.params.id);

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true });
});

//
// ========== TRANSACTIONS ==========
//

router.get('/transactions/fees', async (req, res) => {
  const { data, error } = await supabase.from('sacco_tx_fees').select('*');

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json(data);
});

router.get('/transactions/loans', async (req, res) => {
  const { data, error } = await supabase.from('sacco_tx_loans').select('*');

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json(data);
});

module.exports = router;
