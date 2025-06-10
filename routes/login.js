// routes/login.js
const express = require('express');
const session = require('express-session');
const router = express.Router();

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'flashpay123'; // Update this securely later

// Setup express-session
router.use(session({
  secret: 'flashpay-session-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 2 * 60 * 60 * 1000 } // 2 hours
}));

// ✅ Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.admin = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// ✅ Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// ✅ Check session status
router.get('/session', (req, res) => {
  res.json({ loggedIn: !!req.session.admin });
});

// ✅ Admin protection middleware
function isAdmin(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  }
  return res.status(401).json({ success: false, message: 'Unauthorized' });
}

module.exports = router;
