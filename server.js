const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Allow inline scripts for development
}));
app.use(cors({
  origin: true,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware
app.use(session({
  secret: 'buynexa-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files
app.use(express.static('public'));

// In-memory storage (replace with database in production)
const users = [];
const orders = [];

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Helper function to send emails
async function sendOrderEmail(orderData) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: 'techmedicalbro@gmail.com',
      subject: `New Order #${orderData.orderId} - BuyNexa`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
        <p><strong>Customer:</strong> ${orderData.customerName}</p>
        <p><strong>Email:</strong> ${orderData.email}</p>
        <p><strong>Phone:</strong> ${orderData.phone}</p>
        <p><strong>Address:</strong> ${orderData.address}</p>
        <p><strong>Total:</strong> ${orderData.total}</p>
        <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
        <h3>Items:</h3>
        <ul>
          ${orderData.items.map(item => `<li>${item.name} - Qty: ${item.quantity} - ${item.price}</li>`).join('')}
        </ul>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Order email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// API Routes

// User registration
app.post('/api/signup', [
  body('fullName').trim().isLength({ min: 2 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('phone').trim().isLength({ min: 10 }).escape(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { fullName, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.phone === phone);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      fullName,
      email,
      phone,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(newUser);

    // Set session
    req.session.userId = newUser.id;
    req.session.user = { id: newUser.id, fullName, email, phone };

    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// User login
app.post('/api/login', [
  body('emailOrPhone').trim().escape(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { emailOrPhone, password } = req.body;

    // Find user
    const user = users.find(u => u.email === emailOrPhone || u.phone === emailOrPhone);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Set session
    req.session.userId = user.id;
    req.session.user = { 
      id: user.id, 
      fullName: user.fullName, 
      email: user.email, 
      phone: user.phone 
    };

    res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Check authentication status
app.get('/api/auth/status', (req, res) => {
  if (req.session.userId) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.json({ authenticated: false });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Could not log out' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Protected route middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  next();
};

// Submit order (protected route)
app.post('/api/orders', requireAuth, [
  body('customerName').trim().isLength({ min: 2 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('phone').trim().isLength({ min: 10 }).escape(),
  body('address').trim().isLength({ min: 10 }).escape(),
  body('paymentMethod').trim().escape(),
  body('total').isNumeric(),
  body('items').isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { customerName, email, phone, country, address, paymentMethod, total, items, currency } = req.body;

    const order = {
      orderId: `BN${Date.now()}`,
      userId: req.session.userId,
      customerName,
      email,
      phone,
      country,
      address,
      paymentMethod,
      total,
      currency,
      items,
      status: 'pending',
      createdAt: new Date()
    };

    orders.push(order);

    // Send email notification
    await sendOrderEmail(order);

    res.json({ 
      success: true, 
      message: 'Order submitted successfully',
      orderId: order.orderId
    });
  } catch (error) {
    console.error('Order submission error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user orders
app.get('/api/orders', requireAuth, (req, res) => {
  const userOrders = orders.filter(order => order.userId === req.session.userId);
  res.json({ success: true, orders: userOrders });
});

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,  'index.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname,  'checkout.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname,  'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname,  'signup.html'));
});

// Catch all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`BuyNexa server running on port ${PORT}`);
});