/**
 * src/lib/mailer.js
 * Nodemailer + Gmail SMTP — admission notification emails
 *
 * Required .env.local variables:
 *   EMAIL_USER=your_gmail@gmail.com
 *   EMAIL_PASS=xxxx xxxx xxxx xxxx    ← 16-char Gmail App Password (NOT your regular password)
 *   NOTIFICATION_EMAIL=gcisbte11@gmail.com
 *
 * How to create a Gmail App Password:
 *   1. myaccount.google.com → Security → Enable 2-Step Verification (MUST be on)
 *   2. Search "App passwords" → Other → name "GCI" → Generate
 *   3. Copy the 16-char code → paste as EMAIL_PASS in .env.local
 */
import nodemailer from 'nodemailer';

let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();
  if (!user || !pass) return null;
  _transporter = nodemailer.createTransport({
    host:   'smtp.gmail.com',
    port:   465,
    secure: true,
    auth:   { user, pass },
    tls:    { rejectUnauthorized: false },
  });
  return _transporter;
}

/**
 * Send a new-admission notification to the configured NOTIFICATION_EMAIL.
 * @param {object} admission  Saved admission record (plain object from MongoDB or local)
 * @returns {Promise<{ok:boolean, error?:string}>}
 */
export async function sendAdmissionNotification(admission) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('[mailer] Skipping email — EMAIL_USER/EMAIL_PASS not set in .env.local');
    return { ok: false, error: 'Email not configured' };
  }

  const to      = process.env.NOTIFICATION_EMAIL || 'gcisbte11@gmail.com';
  const from    = `"GCI Admissions" <${process.env.EMAIL_USER}>`;
  const subject = 'New Admission Form Submitted — GCI Global Computer Institute';
  const id      = String(admission._id || admission.id || 'N/A');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const time    = new Date().toLocaleString('en-PK', { dateStyle: 'full', timeStyle: 'short' });

  /* Resolve selected courses — can be array or comma-separated string */
  const courses = Array.isArray(admission.selectedCourses)
    ? admission.selectedCourses.join(', ')
    : (admission.selectedCourses || admission.course || '—');

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Arial,sans-serif;background:#f0f0f0;padding:20px;color:#111}
  .wrap{max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.1)}
  .hdr{background:linear-gradient(135deg,#0a0a0a,#1a1a1a);padding:22px 28px}
  .hdr h1{color:#F5C842;font-size:22px;font-weight:800;margin:0}
  .hdr p{color:rgba(255,255,255,.45);font-size:11px;margin:3px 0 0;text-transform:uppercase;letter-spacing:1px}
  .bar{height:3px;background:linear-gradient(90deg,#D4A017,#F5C842)}
  .body{padding:24px 28px}
  .appid{font-size:11px;color:#888;margin-bottom:16px;font-family:monospace;background:#f9f9f9;padding:6px 10px;border-radius:4px;display:inline-block}
  .course-box{background:#fffbf0;border:1.5px solid rgba(212,160,23,.35);border-radius:7px;padding:10px 14px;margin-bottom:18px}
  .course-box .lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#A07810;margin-bottom:4px}
  .course-box .val{font-size:15px;font-weight:800;color:#0a0a0a}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:16px}
  .fld{background:#f9f9f9;border:1px solid #eee;border-radius:6px;padding:9px 12px}
  .lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:#999;margin-bottom:3px}
  .val{font-size:12.5px;font-weight:600;color:#111;word-break:break-word}
  .full{grid-column:1/-1}
  .btn{display:inline-block;margin-top:18px;background:linear-gradient(135deg,#D4A017,#F5C842);color:#000;font-weight:700;font-size:13px;padding:11px 24px;border-radius:50px;text-decoration:none}
  .ftr{background:#f7f7f7;border-top:1px solid #eee;padding:14px 28px;font-size:10px;color:#aaa}
</style>
</head>
<body>
<div class="wrap">
  <div class="hdr">
    <h1>GCI Global Computer Institute</h1>
    <p>New Admission Application Received</p>
  </div>
  <div class="bar"></div>
  <div class="body">
    <div class="appid">Application ID: GCI-${id}</div>
    <div class="course-box">
      <div class="lbl">Applied For</div>
      <div class="val">${courses || admission.course || '—'}</div>
    </div>
    <div class="grid">
      <div class="fld"><div class="lbl">Student Name</div><div class="val">${admission.fullName || '—'}</div></div>
      <div class="fld"><div class="lbl">Father's Name</div><div class="val">${admission.fatherName || '—'}</div></div>
      <div class="fld"><div class="lbl">Student Phone</div><div class="val">${admission.phone || '—'}</div></div>
      <div class="fld"><div class="lbl">Guardian Phone</div><div class="val">${admission.guardianPhone || '—'}</div></div>
      <div class="fld"><div class="lbl">WhatsApp</div><div class="val">${admission.whatsapp || '—'}</div></div>
      <div class="fld"><div class="lbl">Email</div><div class="val">${admission.email || admission.userEmail || '—'}</div></div>
      <div class="fld"><div class="lbl">Qualification</div><div class="val">${admission.qualification || '—'}</div></div>
      <div class="fld"><div class="lbl">Profession</div><div class="val">${admission.profession || '—'}</div></div>
      <div class="fld"><div class="lbl">Timing</div><div class="val">${admission.timing || '—'}</div></div>
      <div class="fld"><div class="lbl">How Did They Know</div><div class="val">${admission.howKnew || '—'}</div></div>
      <div class="fld full"><div class="lbl">Address</div><div class="val">${admission.address || '—'}</div></div>
      <div class="fld"><div class="lbl">Admission Fee</div><div class="val">${admission.admissionFee || '—'}</div></div>
      <div class="fld"><div class="lbl">Monthly Fee</div><div class="val">${admission.monthlyFee || '—'}</div></div>
      <div class="fld"><div class="lbl">Total Fee</div><div class="val">${admission.totalFee || '—'}</div></div>
      <div class="fld"><div class="lbl">Date of Admission</div><div class="val">${admission.dateOfAdmission || '—'}</div></div>
      <div class="fld full"><div class="lbl">Submitted At</div><div class="val">${time}</div></div>
    </div>
    <a href="${siteUrl}/dashboard/admin?tab=admissions" class="btn">View in Admin Dashboard →</a>
  </div>
  <div class="ftr">GCI Global Computer Institute — Karachi, Pakistan | gcisbte11@gmail.com</div>
</div>
</body></html>`;

  const text = [
    'NEW ADMISSION — GCI GLOBAL COMPUTER INSTITUTE', '='.repeat(50),
    `ID:              GCI-${id}`,
    `Student Name:    ${admission.fullName     || '—'}`,
    `Father's Name:   ${admission.fatherName   || '—'}`,
    `Phone:           ${admission.phone        || '—'}`,
    `Guardian Phone:  ${admission.guardianPhone|| '—'}`,
    `WhatsApp:        ${admission.whatsapp     || '—'}`,
    `Email:           ${admission.email        || admission.userEmail || '—'}`,
    `Qualification:   ${admission.qualification|| '—'}`,
    `Profession:      ${admission.profession   || '—'}`,
    `Address:         ${admission.address      || '—'}`,
    `Course(s):       ${courses}`,
    `Timing:          ${admission.timing       || '—'}`,
    `How They Knew:   ${admission.howKnew      || '—'}`,
    `Admission Fee:   ${admission.admissionFee || '—'}`,
    `Monthly Fee:     ${admission.monthlyFee   || '—'}`,
    `Total Fee:       ${admission.totalFee     || '—'}`,
    `Date:            ${admission.dateOfAdmission || '—'}`,
    `Submitted At:    ${time}`,
    '',
    `Dashboard: ${siteUrl}/dashboard/admin?tab=admissions`,
  ].join('\n');

  try {
    const info = await transporter.sendMail({ from, to, subject, html, text });
    console.log(`[mailer] ✓ Notification sent to ${to} — ${info.messageId}`);
    return { ok: true };
  } catch (err) {
    console.error('[mailer] ✗ Send failed:', err.message);
    // Never throw — email failure must NOT break form submission
    return { ok: false, error: err.message };
  }
}
