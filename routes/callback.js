// routes/callback.js
const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

router.post('/api/mpesa/callback', async (req, res) => {
  const body = req.body;
  const stkCallback = body.Body?.stkCallback;

  if (!stkCallback) return res.status(400).send('Invalid callback');

  const txId = stkCallback.CheckoutRequestID;
  const resultCode = stkCallback.ResultCode;
  const resultDesc = stkCallback.ResultDesc;
  const status = resultCode === 0 ? 'Paid' : 'Failed';
  const mpesaReceipt = stkCallback.CallbackMetadata?.Item?.find(i => i.Name === 'MpesaReceiptNumber')?.Value || null;
  const updatedAt = Date.now();

  try {
    const { error } = await supabase.from('pos_bills')
      .update({ status, updatedAt, mpesaReceipt, resultDesc })
      .eq('txId', txId);

    if (error) throw error;

    console.log(`✅ M-PESA Callback received: ${txId} → ${status}`);
    res.sendStatus(200);
  } catch (err) {
    console.error('🔥 Supabase Callback error:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
