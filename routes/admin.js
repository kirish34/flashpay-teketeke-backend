// routes/admin.js
const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

//
// ========== SUPERMARKETS ==========
//
router.post('/register-supermarket', async (req, res) => {
  const { name } = req.body;

  const { data: existing, error: findErr } = await supabase
    .from('supermarkets')
    .select('id')
    .eq('name', name);

  if (findErr) return res.status(500).json({ error: findErr.message });
  if (existing.length > 0) return res.json({ message: 'Supermarket already exists' });

  const { error } = await supabase.from('supermarkets').insert([{ name }]);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Supermarket registered' });
});

router.get('/supermarkets', async (_, res) => {
  const { data, error } = await supabase.from('supermarkets').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/delete-supermarket', async (req, res) => {
  const { name } = req.body;
  const { error } = await supabase.from('supermarkets').delete().eq('name', name);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Supermarket deleted' });
});

router.post('/edit-supermarket', async (req, res) => {
  const { original, newName } = req.body;
  const { error } = await supabase
    .from('supermarkets')
    .update({ name: newName })
    .eq('name', original);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Supermarket updated' });
});

//
// ========== BRANCHES ==========
//
router.post('/register-branch', async (req, res) => {
  const { supermarket, name, tillNumber } = req.body;
  const { error } = await supabase
    .from('branches')
    .insert([{ supermarket, name, tillNumber }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Branch registered' });
});

router.get('/branches', async (req, res) => {
  const { supermarket } = req.query;
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .eq('supermarket', supermarket);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/delete-branch', async (req, res) => {
  const { supermarket, name } = req.body;
  const { error } = await supabase
    .from('branches')
    .delete()
    .eq('supermarket', supermarket)
    .eq('name', name);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Branch deleted' });
});

router.post('/edit-branch', async (req, res) => {
  const { supermarket, original, newName } = req.body;
  const { error } = await supabase
    .from('branches')
    .update({ name: newName })
    .eq('supermarket', supermarket)
    .eq('name', original);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Branch updated' });
});

//
// ========== CASHIERS ==========
//
router.post('/register-cashier', async (req, res) => {
  const { branch, cashierId, ussdCode } = req.body;
  const { error } = await supabase
    .from('cashiers')
    .insert([{ branch, cashierId, ussdCode }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Cashier registered' });
});

router.get('/cashiers', async (req, res) => {
  const { branch } = req.query;
  const { data, error } = await supabase
    .from('cashiers')
    .select('*')
    .eq('branch', branch);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/delete-cashier', async (req, res) => {
  const { branch, cashierId } = req.body;
  const { error } = await supabase
    .from('cashiers')
    .delete()
    .eq('branch', branch)
    .eq('cashierId', cashierId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Cashier deleted' });
});

router.post('/edit-cashier', async (req, res) => {
  const { branch, cashierId, newUssd } = req.body;
  const { error } = await supabase
    .from('cashiers')
    .update({ ussdCode: newUssd })
    .eq('branch', branch)
    .eq('cashierId', cashierId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Cashier updated' });
});

module.exports = router;
