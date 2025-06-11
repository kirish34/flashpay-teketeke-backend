// routes/login.js
const express = require('express');
const router = express.Router();

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'flashpay123'; // You can later load from env

// ✅ Login endpoint
router.post('/', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.admin = true;
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// ✅ Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// ✅ Session check
router.get('/session', (req, res) => {
  res.json({ loggedIn: !!req.session.admin });
});

// ✅ Middleware to protect admin routes
function isAdmin(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  }
  return res.status(401).json({ success: false, message: 'Unauthorized' });
}

module.exports = { loginRouter: router, isAdmin };
