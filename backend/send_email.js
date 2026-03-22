const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const allowedOrigins = [
  'https://www.ecellsoa.in',
  'https://ecellsoa.in',
  'https://email.ecellsoa.in',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests and approved browser origins.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// Ensure CORS headers are consistently present even behind strict proxies.
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  return next();
});
app.use(bodyParser.json());

require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });


const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_PASSWORD = process.env.SENDER_PASSWORD;

// Check if required environment variables are set
if (!SENDER_EMAIL || !SENDER_PASSWORD) {
  console.error('❌ Missing required environment variables:');
  if (!SENDER_EMAIL) console.error('  - SENDER_EMAIL is required');
  if (!SENDER_PASSWORD) console.error('  - SENDER_PASSWORD is required');
  console.error('Please create a .env file with these variables');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_PASSWORD,
  },
});

app.post('/api/send-email', async (req, res) => {
  const { to, subject, html } = req.body;

  // Validate required fields
  if (!to || !subject || !html) {
    return res.status(400).json({ 
      error: 'Missing required fields: to, subject, html' 
    });
  }

  try {
    const mailOptions = {
      from: SENDER_EMAIL,
      to: to,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ EMAIL SENT TO ${to}`);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log('✅ Email server running on port 5000');
});
