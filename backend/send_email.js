const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const logoPath = path.join(__dirname, '../src/components/Resonance Campus 2 (9 x 5 in) (3).png');

const app = express();
app.use(cors());
app.get('/qr/:token.png', async (req, res) => {
  const token = req.params.token;
  if (!token) {
    return res.status(400).send('Token required');
  }
  const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
  const verificationUrl = `${BACKEND_URL}/verify?token=${token}`;
  try {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="event-qr.png"');
    await QRCode.toFileStream(res, verificationUrl, {
      color: {
        dark: '#2b2b2b',
        light: '#f7f7f7'
      },
      margin: 2,
      width: 300
    });
  } catch (err) {
    res.status(500).send('Failed to generate QR code');
  }
});
app.use(bodyParser.json());
app.use('/qr', express.static(path.join(__dirname, '../../qr')));

require('dotenv').config();
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_PASSWORD = process.env.SENDER_PASSWORD;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_PASSWORD,
  },
});

app.post('/api/send-email', async (req, res) => {
  const { to, name, token } = req.body;
  try {
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
    const verificationUrl = `${BACKEND_URL}/verify?token=${token}`;
    // Generate QR code data URL for email attachment
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      color: {
        dark: '#2b2b2b',
        light: '#f7f7f7'
      },
      margin: 2,
      width: 300
    });

    const downloadUrl = `${BACKEND_URL}/qr/${token}.png`;
    // Read logo file as base64
    let logoBase64 = '';
    try {
      logoBase64 = fs.readFileSync(logoPath).toString('base64');
    } catch (e) {
      logoBase64 = '';
    }
    const mailOptions = {
      from: SENDER_EMAIL,
      to,
      subject: 'Your Event Registration QR Code',
      html: `
        <div style="font-family:Montserrat,sans-serif;background:#f7f7f7;padding:32px;border-radius:16px;text-align:center;max-width:400px;margin:auto;">
          <img src="cid:site-logo" alt="Logo" style="width:140px;height:80px;margin-bottom:16px;object-fit:contain;display:block;margin-left:auto;margin-right:auto;" />
          <h2 style="color:#4b2aad;margin-bottom:16px;">Registration Successful!</h2>
          <p style="font-size:1.1em;color:#222;margin-bottom:24px;">Hello <b>${name}</b>,<br>Thank you for registering.<br><br>
          Please present this QR code for verification at the event.</p>
          <img src="cid:qr-code" alt="QR Code" style="margin:24px auto;display:block;border-radius:12px;box-shadow:0 2px 12px #0002;width:220px;height:220px;" />
          <p style="color:#555;font-size:0.95em;margin-top:24px;">If the QR code is not visible, <a href="${downloadUrl}" style="color:#4b2aad;text-decoration:underline;">click here to download your QR code</a>.</p>
          <p style="color:#555;font-size:0.95em;margin-top:8px;">Keep this email safe. This QR code is unique to your registration.</p>
        </div>
      `,
      attachments: [
        {
          filename: 'logo.png',
          content: logoBase64,
          encoding: 'base64',
          cid: 'site-logo'
        },
        {
          filename: 'event-qr.png',
          content: qrDataUrl.split('base64,')[1],
          encoding: 'base64',
          cid: 'qr-code'
        },
      ],
    };
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log('Email server running on email.ecellsoa.in');
});
