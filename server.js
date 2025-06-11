require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve Static Files from "public"
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Session Middleware for Login Protection
app.use(session({
  secret: 'flashpay-session-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 2 * 60 * 60 * 1000 } // 2 hours
}));

// ✅ Import Login Routes and Admin Middleware
const { loginRouter, isAdmin } = require('./routes/login');
app.use('/api/login', loginRouter);

// ✅ Protected Admin Routes
app.use('/api/admin', isAdmin, require('./routes/admin'));
app.use('/api/sacco-admin', isAdmin, require('./routes/admin-sacco'));
app.use('/api/conductor', isAdmin, require('./routes/conductor'));
app.use('/api/pos', isAdmin, require('./routes/pos'));
app.use('/api/summary', isAdmin, require('./routes/summary'));

// ✅ Public Routes
app.use('/api/saccos', require('./routes/saccos'));
app.use('/api/matatus', require('./routes/matatus'));
app.use('/api/flashpay', require('./routes/flashpay'));
app.use('/api/callback', require('./routes/callback'));
app.use('/api/cashiers', require('./routes/cashiers'));
app.use('/api/branches', require('./routes/branches'));

// ✅ Admin Login Check
app.get('/api/admin/check', isAdmin, (req, res) => {
  res.json({ message: '✅ You are logged in as admin' });
});

// ✅ Root Login Selector Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// ✅ Supermarket Role Selector Page
app.get('/super', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/super/super.html'));
});

// ✅ SACCO Role Selector Page
app.get('/sacco', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/sacco/sacco.html'));
});

// ✅ Serve Supermarket Cashier POS
app.get('/super-cashier', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/super/super-cashier.html'));
});

// ✅ Catch-all for 404 HTML
app.use((req, res, next) => {
  res.status(404).send('🔍 Page not found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 FlashPay-TekeTeke backend running on port ${PORT}`);
});
