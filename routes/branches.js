// routes/branches.js
const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

// ✅ Get all branches
router.get('/', async (_, res) => {
  const { data, error } = await supabase.from('branches').select('*');
  if (error) return res.status(500).json({ success: false, error });
  res.json(data);
});

// ✅ Add new branch
router.post('/add', async (req, res) => {
  const { name, till } = req.body;
  if (!name || !till) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const { error } = await supabase.from('branches').insert([{ name, till }]);
  if (error) return res.status(500).json({ success: false, error });
  res.json({ success: true, message: 'Branch added' });
});

// ✅ Edit branch
router.post('/edit', async (req, res) => {
  const { id, field, value } = req.body;
  if (!id || !field || !value) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const updateData = {};
  updateData[field] = value;

  const { error } = await supabase.from('branches').update(updateData).eq('id', id);
  if (error) return res.status(500).json({ success: false, error });
  res.json({ success: true });
});

// ✅ Delete branch
router.post('/delete', async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Missing ID' });
  }

  const { error } = await supabase.from('branches').delete().eq('id', id);
  if (error) return res.status(500).json({ success: false, error });
  res.json({ success: true });
});

module.exports = router;
