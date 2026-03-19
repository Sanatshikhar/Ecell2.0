const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const logoPath2 = path.join(__dirname, '../src/components/Resonance Campus 2 (9 x 5 in) (3).png');

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

require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });


const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_PASSWORD = process.env.SENDER_PASSWORD;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

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
  const { to, name, token, otp } = req.body;
  
  try {
    // Read logo file as base64
    let logoBase2 = '';
    try {
      if (fs.existsSync(logoPath2)) {
        logoBase2 = fs.readFileSync(logoPath2).toString('base64');
      } else {
        console.log('⚠️ Logo file not found:', logoPath2);
      }
    } catch (e) {
      console.log('⚠️ Error reading logo file:', e.message);
      logoBase2 = '';
    }

  

    let mailOptions;

    // If token is provided, send email with QR code (for ResonanceForm)
    if (token && token !== null && token !== undefined && token !== '') {
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

      mailOptions = {
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
            content: logoBase2,
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
    } else if (otp && otp !== null && otp !== undefined && otp !== '') {
      // OTP email for workshop verification
      mailOptions = {
        from: SENDER_EMAIL,
        to,
        subject: 'Your Workshop Verification OTP - E-Cell SOA',
        html: `
          <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f4f5fb;padding:32px 0;">
            <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.08);">
              <div style="background:#4b2aad;padding:20px 24px;color:#fff;text-align:center;">
                <h2 style="margin:0;font-size:22px;letter-spacing:.3px;">E-Cell SOA Workshop Verification</h2>
              </div>
              <div style="padding:28px 24px;">
                <p style="margin:0 0 12px;color:#222;font-size:15px;">Hello <strong>${name || 'Participant'}</strong>,</p>
                <p style="margin:0 0 16px;color:#444;font-size:14px;line-height:1.6;">Use the OTP below to verify your email and complete workshop registration.</p>
                <div style="margin:18px 0;padding:16px;border:1px solid #e9defc;background:#f8f3ff;border-radius:10px;text-align:center;">
                  <div style="font-size:28px;letter-spacing:8px;font-weight:700;color:#4b2aad;">${otp}</div>
                </div>
                <p style="margin:0;color:#666;font-size:13px;line-height:1.5;">This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
              </div>
              <div style="padding:14px 24px;background:#fafafa;border-top:1px solid #eee;color:#888;font-size:12px;text-align:center;">
                © ${new Date().getFullYear()} E-Cell SOA
              </div>
            </div>
          </div>
        `,
        attachments: [],
      };
    } else {
      // If no token, send simple confirmation email (for RegistrationForm)
      mailOptions = {
      from: SENDER_EMAIL,
      to,
      subject: 'REGISTRATION CONFIRMATION - E-Cell SOA',
      html: `
        <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f4f5fb;padding:40px 0;">
          <div style="background:#fff;max-width:600px;margin:auto;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.05);overflow:hidden;">
            <div style="background:#4b2aad;padding:24px 16px;text-align:center;">
              <img src="https://drive.google.com/uc?export=view&id=1CDMV4krsK4W_n7CSiUmK5GE3V_odFYnf" 
                   alt="E-Cell SOA Logo" 
                   style="width:200px;height:120px;object-fit:contain;margin-bottom:8px;display:block;margin-left:auto;margin-right:auto;">
              <h1 style="color:#ffffff;font-size:22px;font-weight:600;margin:0;">Entrepreneurship Cell, SOA</h1>
            </div>

            <div style="padding:32px 40px;text-align:left;">
              <p style="font-size:16px;color:#333;margin-bottom:20px;">Dear <strong>${name}</strong>,</p>

              <p style="font-size:15px;color:#444;line-height:1.7;margin-bottom:16px;">
                Thank you for your patience. We’re pleased to confirm that your application has been received successfully, 
                and the <strong>hiring process</strong> is scheduled to launch soon.
              </p>

              <p style="font-size:15px;color:#444;line-height:1.7;margin-bottom:16px;">
                You will be notified individually about your specific time slot for the next stage shortly. 
                Please keep an eye on your inbox for further updates.
              </p>

              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">

              <p style="font-size:15px;color:#444;margin-bottom:16px;">
                Stay connected and get the latest updates through our official channels:
              </p>

              <div style="text-align:center;margin:24px 0;">
                <a href="https://chat.whatsapp.com/Hdi79w5UE9Z0UsHlCLZOdf?mode=wwc"
                   style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;
                          padding:12px 28px;border-radius:6px;font-size:15px;font-weight:500;">
                  Join WhatsApp Group
                </a>
              </div>

              <p style="text-align:center;font-size:14px;margin-top:12px;">
                Follow us on Instagram:<br>
                <a href="https://www.instagram.com/ecellsoau/" style="color:#4b2aad;text-decoration:none;font-weight:500;">@ecellsoau</a>
              </p>

              <hr style="border:none;border-top:1px solid #eee;margin:28px 0;">

              <p style="font-size:14px;color:#555;line-height:1.6;margin-bottom:0;">
                We appreciate your enthusiasm and interest in being part of E-Cell SOA. 
                We look forward to collaborating with you soon!
              </p>

              <p style="font-size:14px;color:#555;margin-top:24px;">
                Warm regards,<br>
                <strong>The E-Cell SOA Team</strong>
              </p>
            </div>

            <div style="background:#f9f9f9;text-align:center;padding:16px 0;border-top:1px solid #eee;">
              <p style="font-size:12px;color:#888;margin:0;">
                © ${new Date().getFullYear()} E-Cell SOA. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
      attachments: [],
    };
    }

    await transporter.sendMail(mailOptions);
    console.log('✅ EMAIL SENT SUCCESSFULLY');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log('Email server running on port 5000');
});
