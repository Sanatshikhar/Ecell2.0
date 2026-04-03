const express = require('express');
const nodemailer = require('nodemailer');
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

const shouldHandleCorsInApp = (origin) => {
  if (!origin) return false;

  // Production traffic is expected to be handled by the edge proxy CORS rules.
  if (/^https:\/\/(www\.)?ecellsoa\.in$/.test(origin) || /^https:\/\/email\.ecellsoa\.in$/.test(origin)) {
    return false;
  }

  return /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(origin) && shouldHandleCorsInApp(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
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
const SENDER_FROM_NAME = process.env.SENDER_FROM_NAME || 'E-Cell SOA';
const SMTP_HOST = process.env.SENDER_SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SENDER_SMTP_PORT || 465);
const SMTP_SECURE = String(process.env.SENDER_SMTP_SECURE || 'true').toLowerCase() !== 'false';
const POCKETBASE_URL = (process.env.REACT_APP_DB_URL || process.env.POCKETBASE_URL || process.env.PB_URL || '').replace(/\/$/, '');

// Check if required environment variables are set.
if (!SENDER_EMAIL || !SENDER_PASSWORD) {
  console.error('❌ Missing required environment variables:');
  if (!SENDER_EMAIL) console.error('  - SENDER_EMAIL is required');
  if (!SENDER_PASSWORD) console.error('  - SENDER_PASSWORD (Gmail app password) is required');
  console.error('  - Optional: SENDER_SMTP_HOST, SENDER_SMTP_PORT, SENDER_SMTP_SECURE');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_PASSWORD,
  },
});

const sendEmailViaSmtp = async ({ to, subject, html }) => {
  const toAddresses = String(to || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (!toAddresses.length) {
    throw new Error('Recipient email is required.');
  }

  await transporter.sendMail({
    from: `"${SENDER_FROM_NAME}" <${SENDER_EMAIL}>`,
    to: toAddresses,
    subject: String(subject || ''),
    html: String(html || ''),
  });
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());

const escapeFilterValue = (value) => String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const findVerifiedVoterByEmail = async (email) => {
  if (!POCKETBASE_URL) {
    return null;
  }

  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail) {
    return null;
  }

  const filter = `email="${escapeFilterValue(normalizedEmail)}" && verified=true`;
  const response = await fetch(
    `${POCKETBASE_URL}/api/collections/voters/records?${new URLSearchParams({
      filter,
      page: '1',
      perPage: '1',
    }).toString()}`
  );

  if (!response.ok) {
    return null;
  }

  const payload = await response.json().catch(() => ({}));
  return payload?.items?.[0] || null;
};

const findVotedVoterByEmail = async (email) => {
  if (!POCKETBASE_URL) {
    return null;
  }

  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail) {
    return null;
  }

  const filter = `email="${escapeFilterValue(normalizedEmail)}"`;
  const response = await fetch(
    `${POCKETBASE_URL}/api/collections/voters/records?${new URLSearchParams({
      filter,
      page: '1',
      perPage: '50',
    }).toString()}`
  );

  if (!response.ok) {
    return null;
  }

  const payload = await response.json().catch(() => ({}));
  const items = Array.isArray(payload?.items) ? payload.items : [];

  const hasVote = (record) => {
    if (!record) {
      return false;
    }

    const selectedProductId = String(record.selectedProductId || '').trim();
    if (selectedProductId) {
      return true;
    }

    const selectedProductName = String(record.selectedProductName || '').trim();
    if (selectedProductName) {
      return true;
    }

    const votedFor = record.votedFor;
    if (Array.isArray(votedFor)) {
      return votedFor.some((entry) => String(entry || '').trim());
    }

    return Boolean(String(votedFor || '').trim());
  };

  return items.find(hasVote) || null;
};

const getVotedProductName = async (voter) => {
  if (!voter) {
    return '';
  }

  const directName = String(voter.selectedProductName || '').trim();
  if (directName) {
    return directName;
  }

  const productId = String(voter.selectedProductId || voter.votedFor || '').trim();
  if (!POCKETBASE_URL || !productId) {
    return '';
  }

  try {
    const response = await fetch(`${POCKETBASE_URL}/api/collections/products/records/${encodeURIComponent(productId)}`);
    if (!response.ok) {
      return '';
    }

    const payload = await response.json().catch(() => ({}));
    return String(payload?.name || '').trim();
  } catch (error) {
    return '';
  }
};

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

const buildAudiencePollConfirmationEmail = ({ name, registrationNumber }) => {
  const safeName = name && String(name).trim() ? String(name).trim() : 'Participant';
  const safeRegNo = registrationNumber && String(registrationNumber).trim()
    ? String(registrationNumber).trim().toUpperCase()
    : 'N/A';

  return `
    <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f4f5fb;padding:32px 0;">
      <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.08);">
        <div style="background:#121212;padding:20px 24px;color:#c8ff00;text-align:center;">
          <h2 style="margin:0;font-size:22px;letter-spacing:.3px;">E-Cell SOA Audience Poll</h2>
        </div>
        <div style="padding:28px 24px;">
          <p style="margin:0 0 12px;color:#222;font-size:15px;">Hello <strong>${safeName}</strong>,</p>
          <p style="margin:0 0 14px;color:#444;font-size:14px;line-height:1.6;">Your details were verified successfully. You can now vote in the audience poll.</p>
          <div style="margin:18px 0;padding:14px;border:1px solid #ecf5be;background:#f8fddf;border-radius:10px;">
            <p style="margin:0;color:#333;font-size:13px;">Registration Number: <strong>${safeRegNo}</strong></p>
          </div>
          <p style="margin:0;color:#666;font-size:13px;line-height:1.5;">You are allowed only one vote.</p>
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

  if (!POCKETBASE_URL) {
    return res.status(503).json({
      success: false,
      error: 'OTP service is temporarily unavailable. Please try again shortly.',
    });
  }

  try {
    const alreadyVotedVoter = await findVotedVoterByEmail(normalizedEmail);
    if (alreadyVotedVoter) {
      const votedProductName = await getVotedProductName(alreadyVotedVoter);
      return res.status(409).json({
        success: false,
        already_voted: true,
        error: `This email has already voted${votedProductName ? ` for ${votedProductName}` : ''}.`,
      });
    }

    const alreadyVerifiedVoter = await findVerifiedVoterByEmail(normalizedEmail);
    if (alreadyVerifiedVoter) {
      return res.status(409).json({
        success: false,
        already_verified: true,
        error: 'Email already verified. Choose a product to vote.',
      });
    }
  } catch (lookupError) {
    console.error('❌ Verified email lookup failed:', lookupError.message);
    return res.status(503).json({
      success: false,
      error: 'Unable to validate voter status right now. Please try again shortly.',
    });
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + OTP_TTL_MS;

  try {
    await sendEmailViaSmtp({
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
    await sendEmailViaSmtp({
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

app.post('/api/audience-poll/send-confirmation', async (req, res) => {
  const { email, name, registrationNumber } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  try {
    await sendEmailViaSmtp({
      to: normalizedEmail,
      subject: 'Audience Poll Entry Confirmed',
      html: buildAudiencePollConfirmationEmail({
        name,
        registrationNumber,
      }),
    });

    console.log(`✅ AUDIENCE POLL CONFIRMATION SENT TO ${normalizedEmail}`);
    return res.json({ success: true });
  } catch (err) {
    console.error('❌ Audience poll confirmation email failed:', err.message);
    return res.status(500).json({ error: 'Failed to send confirmation email.' });
  }
});

app.listen(5000, () => {
  console.log('✅ Email server running on port 5000');
});
