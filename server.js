require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();
app.use(cors());
app.use(express.json());

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

// ✅ Admin Routes (Protected)
app.use('/api/admin', isAdmin, require('./routes/admin'));

// ✅ Public Routes
app.use('/api/saccos', require('./routes/saccos'));
app.use('/api/matatus', require('./routes/matatus'));
app.use('/api/flashpay', require('./routes/flashpay'));
app.use('/api/callback', require('./routes/callback'));
app.use('/api/cashiers', require('./routes/cashiers'));
app.use('/api/branches', require('./routes/branches'));


// ✅ Optional Admin Check Route
app.get('/api/admin/check', isAdmin, (req, res) => {
  res.json({ message: '✅ You are logged in as admin' });
});

// ✅ Health Check (Optional)
app.get('/', (_, res) => {
  res.send('🚀 FlashPay-TekeTeke backend is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 FlashPay-TekeTeke backend running on port ${PORT}`);
});
