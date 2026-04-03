const express = require('express');
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const otpStore = new Map();

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  return (
    /^https:\/\/(www\.)?ecellsoa\.in$/.test(origin) ||
    /^https:\/\/email\.ecellsoa\.in$/.test(origin) ||
    /^http:\/\/localhost:\d+$/.test(origin) ||
    /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
  );
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  return next();
});
app.use(bodyParser.json());

require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });


const SES_REGION = process.env.AWS_SES_REGION || process.env.AWS_REGION || 'ap-south-1';
const SENDER_EMAIL = process.env.AWS_SES_FROM_EMAIL || process.env.SENDER_EMAIL;
const SENDER_FROM_NAME = process.env.AWS_SES_FROM_NAME || process.env.SENDER_FROM_NAME || 'E-Cell SOA';

// Check if required environment variables are set.
if (!SENDER_EMAIL) {
  console.error('❌ Missing required environment variables:');
  console.error('  - AWS_SES_FROM_EMAIL (or SENDER_EMAIL) is required');
  console.error('  - AWS credentials should be available via env or IAM role');
  console.error('  - AWS_SES_REGION/AWS_REGION should be set if not using default ap-south-1');
  process.exit(1);
}

const sesClient = new SESv2Client({
  region: SES_REGION,
});

const sendEmailViaSes = async ({ to, subject, html }) => {
  const toAddresses = String(to || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (!toAddresses.length) {
    throw new Error('Recipient email is required.');
  }

  const command = new SendEmailCommand({
    FromEmailAddress: `${SENDER_FROM_NAME} <${SENDER_EMAIL}>`,
    Destination: {
      ToAddresses: toAddresses,
    },
    Content: {
      Simple: {
        Subject: {
          Data: String(subject || ''),
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: String(html || ''),
            Charset: 'UTF-8',
          },
        },
      },
    },
  });

  return sesClient.send(command);
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const buildOtpEmail = ({ name, otp, purpose }) => {
  const safeName = name && String(name).trim() ? String(name).trim() : 'Participant';
  const safePurpose = purpose && String(purpose).trim() ? String(purpose).trim() : 'Audience Poll';

  return `
    <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f4f5fb;padding:32px 0;">
      <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.08);">
        <div style="background:#121212;padding:20px 24px;color:#c8ff00;text-align:center;">
          <h2 style="margin:0;font-size:22px;letter-spacing:.3px;">E-Cell SOA ${safePurpose} Verification</h2>
        </div>
        <div style="padding:28px 24px;">
          <p style="margin:0 0 12px;color:#222;font-size:15px;">Hello <strong>${safeName}</strong>,</p>
          <p style="margin:0 0 16px;color:#444;font-size:14px;line-height:1.6;">Use the OTP below to verify your email and continue to voting.</p>
          <div style="margin:18px 0;padding:16px;border:1px solid #ecf5be;background:#f8fddf;border-radius:10px;text-align:center;">
            <div style="font-size:28px;letter-spacing:8px;font-weight:700;color:#111111;">${otp}</div>
          </div>
          <p style="margin:0;color:#666;font-size:13px;line-height:1.5;">This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
        </div>
        <div style="padding:14px 24px;background:#fafafa;border-top:1px solid #eee;color:#888;font-size:12px;text-align:center;">
          © ${new Date().getFullYear()} E-Cell SOA
        </div>
      </div>
    </div>
  `;
};

app.post('/api/send-otp', async (req, res) => {
  const { email, name, purpose } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + OTP_TTL_MS;

  try {
    await sendEmailViaSes({
      to: normalizedEmail,
      subject: 'Email Verification OTP - Audience Poll',
      html: buildOtpEmail({ name, otp, purpose: purpose || 'Audience Poll' }),
    });

    otpStore.set(normalizedEmail, {
      otp,
      expiresAt,
      attempts: 0,
    });

    return res.json({
      success: true,
      expiresInSeconds: Math.floor(OTP_TTL_MS / 1000),
    });
  } catch (err) {
    console.error('❌ OTP email send failed:', err.message);
    return res.status(500).json({ error: 'Failed to send OTP email.' });
  }
});

app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedOtp = String(otp || '').trim();

  if (!isValidEmail(normalizedEmail) || normalizedOtp.length !== 6) {
    return res.status(400).json({ error: 'Invalid verification payload.' });
  }

  const record = otpStore.get(normalizedEmail);
  if (!record) {
    return res.status(400).json({ error: 'OTP not found. Please request a new one.' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
  }

  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    otpStore.delete(normalizedEmail);
    return res.status(429).json({ error: 'Maximum OTP attempts exceeded. Request a new OTP.' });
  }

  if (record.otp !== normalizedOtp) {
    record.attempts += 1;
    otpStore.set(normalizedEmail, record);
    return res.status(400).json({ error: 'Incorrect OTP. Please try again.' });
  }

  otpStore.delete(normalizedEmail);
  return res.json({ success: true, verified: true });
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
    await sendEmailViaSes({
      to: to,
      subject: subject,
      html: html,
    });
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
