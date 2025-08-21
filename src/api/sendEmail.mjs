import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/send-email', async (req, res) => {
  const { to, name } = req.body;
  const apiKey = process.env.REACT_APP_RESEND_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Resend API key missing' });

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'IEC Registration <ecell@studentvault.xyz>', // Use a verified sender
        to,
        subject: 'IEC Registration Successful',
        html: `<p>Hi ${name},<br/>Thank you for registering! Here are the details of your registration:</p>`
      })
    });
    const result = await response.json();
    if (!response.ok) {
      return res.status(400).json({ error: result });
    }
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});
