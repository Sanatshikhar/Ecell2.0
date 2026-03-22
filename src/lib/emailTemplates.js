/**
 * Email template generation for frontend
 * These templates are built on the client side before sending to backend
 */

export const buildWorkshopConfirmationEmail = (input) => {
  const details = typeof input === "string" ? { name: input } : (input || {});
  const {
    name,
    workshopTitle,
    date,
    time,
    subtitle,
    tag,
    venue,
    organiser,
  } = details;

  const currentDate = new Date();
  const monthYear = currentDate
    .toLocaleString("en-US", { month: "long", year: "numeric" })
    .toUpperCase();

  const eventName      = workshopTitle || "WORKSHOP";
  const eventSubtitle  = subtitle      || "Foundation Series — The ultimate master class";
  const eventTrack     = tag           || "INNOVATION SPRINT 2026";
  const eventDate      = date          || "Mar 23-24, 2026";
  const eventTime      = time          || "4:30 - 6:30 PM";
  const eventVenue     = venue         || "Bansuri Guru Auditorium, ITER";
  const eventOrganiser = organiser     || "Innovation &amp; Entrepreneurship Cell, SOA";
  const year           = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Share+Tech+Mono&family=Barlow:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
html,body{margin:0;padding:0;background:#0a0a0a;}
*{box-sizing:border-box;}
@keyframes ripple{0%{transform:scale(1);opacity:.7}100%{transform:scale(3.4);opacity:0}}
@keyframes livepulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.65)}}
.pulse-ring{animation:ripple 1.7s ease-out infinite;}
.live-dot{animation:livepulse 1.4s ease-in-out infinite;}
@media only screen and (max-width:520px){
  .wrap{padding:10px 8px 20px!important;}
  .card{padding:20px 16px 24px!important;border-radius:10px!important;}
  .big-title{font-size:42px!important;}
  .subtitle{font-size:12px!important;margin-bottom:12px!important;}
  .col-td{display:block!important;width:100%!important;}
  .ftxt{font-size:9px!important;letter-spacing:.06em!important;}
}
</style>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;"><div class="wrap" style="background:#0a0a0a;padding:14px 14px 22px;font-family:'Barlow',Helvetica,Arial,sans-serif;color:#e0e0e0;"><div style="max-width:620px;margin:0 auto;">

<!-- Top bar -->
<div style="text-align:center;font-family:'Share Tech Mono','Courier New',monospace;font-size:11px;letter-spacing:.2em;color:#666;padding-bottom:12px;"><span style="color:#e0007a;font-size:7px;">◆</span>&nbsp;ITER BHUBANESWAR&nbsp;<span style="color:#e0007a;font-size:7px;">◆</span>&nbsp;${monthYear}</div>

<!-- Hero card -->
<div class="card" style="background:linear-gradient(140deg,#190020 0%,#2b0038 35%,#38005c 65%,#190026 100%);border:1px solid rgba(224,0,122,.2);border-radius:14px;padding:24px 24px 28px;position:relative;overflow:hidden;">

  <!-- grid texture -->

  <div style="position:relative;z-index:2;">

    <!-- Row: LIVE badge left | IEC right -->
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-bottom:14px;">
      <tr>
        <td style="vertical-align:middle;">
          <div style="display:inline-flex;align-items:center;gap:7px;border:1px solid #e0007a;border-radius:20px;padding:4px 13px;font-family:'Share Tech Mono','Courier New',monospace;font-size:11px;letter-spacing:.16em;color:#e0007a;">
            <span class="live-dot" style="width:7px;height:7px;background:#e0007a;border-radius:50%;display:inline-block;"></span>LIVE
          </div>
        </td>
        <td style="vertical-align:middle;text-align:right;">
          <span style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:38px;font-weight:900;color:rgba(224,0,122,.32);letter-spacing:-.02em;line-height:1;">IEC</span>
        </td>
      </tr>
    </table>

    <!-- Track -->
    <div style="font-family:'Share Tech Mono','Courier New',monospace;font-size:10px;letter-spacing:.26em;color:rgba(224,0,122,.72);text-transform:uppercase;margin-bottom:5px;">${eventTrack}</div>

    <!-- Title -->
    <div class="big-title" style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:60px;font-weight:900;line-height:.93;text-transform:uppercase;color:#fff;margin-bottom:8px;">${eventName}</div>

    <!-- Subtitle -->
    <div class="subtitle" style="font-size:13px;font-weight:300;color:rgba(255,255,255,.5);letter-spacing:.04em;margin-bottom:20px;">${eventSubtitle}</div>

    <!-- Divider -->
    <div style="height:1px;background:linear-gradient(90deg,rgba(224,0,122,.55),rgba(255,255,255,.08),transparent);margin:18px 0;"></div>

    <!-- Confirmation -->
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-bottom:20px;">
      <tr>
        <td style="width:48px;vertical-align:middle;padding-right:12px;">
          <div style="width:44px;height:44px;border-radius:50%;background:rgba(224,0,122,.15);border:1px solid rgba(224,0,122,.5);text-align:center;line-height:44px;font-size:18px;color:#fff;">&#10003;</div>
        </td>
        <td style="vertical-align:middle;">
          <div style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#fff;line-height:1.1;">You're Registered!</div>
          <div style="font-size:12px;color:rgba(255,255,255,.42);margin-top:3px;">Hello <strong style="color:rgba(255,255,255,.72);">${name || "Participant"}</strong>, your seat has been confirmed. See you there.</div>
        </td>
      </tr>
    </table>

    <!-- Detail cards -->
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-bottom:22px;">
      <tr>
        <td class="col-td" style="padding:4px;width:50%;">
          <div style="background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.09);border-radius:8px;padding:12px 14px;">
            <div style="font-family:'Share Tech Mono','Courier New',monospace;font-size:9px;letter-spacing:.22em;color:#e0007a;text-transform:uppercase;margin-bottom:5px;">Date</div>
            <div style="font-size:13px;font-weight:500;color:#fff;line-height:1.4;">${eventDate}</div>
          </div>
        </td>
        <td class="col-td" style="padding:4px;width:50%;">
          <div style="background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.09);border-radius:8px;padding:12px 14px;">
            <div style="font-family:'Share Tech Mono','Courier New',monospace;font-size:9px;letter-spacing:.22em;color:#e0007a;text-transform:uppercase;margin-bottom:5px;">Time</div>
            <div style="color:#e0007a;font-family:'Barlow Condensed',Arial,sans-serif;font-size:22px;font-weight:700;line-height:1.2;">${eventTime}</div>
          </div>
        </td>
      </tr>
      <tr>
        <td class="col-td" style="padding:4px;width:50%;">
          <div style="background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.09);border-radius:8px;padding:12px 14px;">
            <div style="font-family:'Share Tech Mono','Courier New',monospace;font-size:9px;letter-spacing:.22em;color:#e0007a;text-transform:uppercase;margin-bottom:5px;">Venue</div>
            <div style="font-size:13px;font-weight:500;color:#fff;line-height:1.4;">${eventVenue}</div>
          </div>
        </td>
        <td class="col-td" style="padding:4px;width:50%;">
          <div style="background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.09);border-radius:8px;padding:12px 14px;">
            <div style="font-family:'Share Tech Mono','Courier New',monospace;font-size:9px;letter-spacing:.22em;color:#e0007a;text-transform:uppercase;margin-bottom:5px;">Organiser</div>
            <div style="font-size:13px;font-weight:500;color:#fff;line-height:1.4;">${eventOrganiser}</div>
          </div>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <div style="height:1px;background:linear-gradient(90deg,rgba(224,0,122,.55),rgba(255,255,255,.08),transparent);margin:18px 0;"></div>

    <!-- Notice banner -->
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background:rgba(224,0,122,.1);border:1px solid rgba(224,0,122,.38);border-left:4px solid #e0007a;border-radius:8px;">
      <tr>
        <td style="padding:16px 8px 16px 18px;width:28px;vertical-align:middle;">
          <div style="position:relative;width:18px;height:18px;display:inline-block;vertical-align:middle;">
            <span class="pulse-ring" style="position:absolute;top:4px;left:4px;width:10px;height:10px;border-radius:50%;background:rgba(224,0,122,.45);"></span>
            <span style="position:absolute;top:4px;left:4px;width:10px;height:10px;background:#e0007a;border-radius:50%;display:block;z-index:1;"></span>
          </div>
        </td>
        <td style="padding:16px 18px 16px 6px;vertical-align:middle;">
          <div style="font-size:13.5px;font-weight:500;color:rgba(255,255,255,.9);line-height:1.6;letter-spacing:.02em;">
            Please arrive <strong style="color:#ff3399;">10 minutes early</strong> and carry your <strong style="color:#ff3399;">ID card</strong> for smooth entry.
          </div>
        </td>
      </tr>
    </table>

  </div>
</div>

<!-- Footer -->
<div style="padding:18px 0 6px;text-align:center;">
  <div class="ftxt" style="font-family:'Share Tech Mono','Courier New',monospace;font-size:10px;letter-spacing:.13em;color:#3a3a3a;margin-bottom:3px;">INNOVATION AND ENTREPRENEURSHIP CELL · SOA UNIVERSITY</div>
  <div class="ftxt" style="font-family:'Share Tech Mono','Courier New',monospace;font-size:10px;letter-spacing:.13em;color:#3a3a3a;margin-bottom:6px;">ITER, BHUBANESWAR, ODISHA</div>
  <div class="ftxt" style="font-family:'Share Tech Mono','Courier New',monospace;font-size:10px;letter-spacing:.1em;color:#484848;"><span style="color:rgba(224,0,122,.5);">©</span> ${year} E-CELL SOA · ALL RIGHTS RESERVED</div>
</div>

</div></div></body>
</html>`;
};

export const buildOTPVerificationEmail = (name, otp) => {
  return `
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
  `;
};

export const TIME_CHANGE_SUBJECT = "Important Update: Foundation Series Session Timings Revised";

export const buildFoundationSeriesTimeChangeEmail = (input) => {
  const details = typeof input === "string" ? { name: input } : (input || {});
  const name = details.name || "Participant";
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Session Timing Update</title>
</head>
<body style="margin:0;padding:0;background:#f3f5f8;font-family:'Segoe UI',Roboto,Arial,sans-serif;color:#1f2937;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f5f8;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;box-shadow:0 10px 28px rgba(0,0,0,0.07);">
          <tr>
            <td style="background:linear-gradient(90deg,#0f172a,#1e3a8a);padding:20px 24px;">
              <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#bfdbfe;font-weight:600;">Innovation &amp; Entrepreneurship Cell</div>
              <div style="font-size:22px;line-height:1.3;color:#ffffff;font-weight:700;margin-top:6px;">Foundation Series - The Ultimate Masterclass</div>
            </td>
          </tr>
          <tr>
            <td style="padding:26px 24px 10px;">
              <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#1f2937;">Dear ${name},</p>
              <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#374151;">A slight update has been made to the schedule for the Foundation Series - The Ultimate Masterclass.</p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:14px 0 18px;border:1px solid #dbeafe;border-radius:10px;background:#f8fbff;">
                <tr>
                  <td style="padding:16px 18px;border-bottom:1px solid #e5e7eb;">
                    <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#1e40af;font-weight:700;">Updated Session Time</div>
                    <div style="margin-top:6px;font-size:20px;font-weight:700;color:#0f172a;">4:30 PM - 6:30 PM</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;border-bottom:1px solid #e5e7eb;">
                    <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#1e40af;font-weight:700;">Venue (Unchanged)</div>
                    <div style="margin-top:6px;font-size:15px;font-weight:600;color:#111827;">Bansuri Guru Auditorium, ITER</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;">
                    <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#1e40af;font-weight:700;">Date (Unchanged)</div>
                    <div style="margin-top:6px;font-size:15px;font-weight:600;color:#111827;">23rd &amp; 24th March</div>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#374151;">Everything else remains as planned. We understand this change may cause minor inconvenience and truly appreciate your flexibility.</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#374151;">We look forward to having you with us.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 24px;">
              <div style="border-top:1px solid #e5e7eb;padding-top:18px;">
                <p style="margin:0;font-size:14px;color:#1f2937;font-weight:600;">Warm regards,</p>
                <p style="margin:6px 0 0;font-size:14px;color:#374151;line-height:1.6;">Innovation &amp; Entrepreneurship Cell<br/>SOA University</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:14px 24px;text-align:center;">
              <span style="font-size:12px;color:#6b7280;">© ${year} Innovation &amp; Entrepreneurship Cell, SOA University</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const WORKSHOP_CONFIRMATION_SUBJECT = "Workshop Registration Confirmed";

export const buildWorkshopConfirmationMailPayload = ({ to, details }) => {
  return {
    to,
    subject: WORKSHOP_CONFIRMATION_SUBJECT,
    html: buildWorkshopConfirmationEmail(details),
  };
};

export const buildFoundationSeriesTimeChangeMailPayload = ({ to, details }) => {
  return {
    to,
    subject: TIME_CHANGE_SUBJECT,
    html: buildFoundationSeriesTimeChangeEmail(details),
  };
};