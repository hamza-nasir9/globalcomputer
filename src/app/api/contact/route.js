/**
 * POST /api/contact
 * Saves contact query to MongoDB and sends email notification.
 */
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

/* ── Inline Contact model (kept local to avoid extra file) ────── */
const ContactSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, lowercase: true, trim: true },
    phone:   { type: String, default: '', trim: true },
    subject: { type: String, default: '', trim: true },
    message: { type: String, required: true, trim: true },
    read:    { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'contact_queries' }
);

const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

/* ── Mailer ────────────────────────────────────────────────────── */
function getTransporter() {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

export async function POST(req) {
  try {
    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { name, email, phone, subject, message } = body;
    if (!name?.trim())    return NextResponse.json({ error: 'Name is required.'    }, { status: 400 });
    if (!email?.trim())   return NextResponse.json({ error: 'Email is required.'   }, { status: 400 });
    if (!message?.trim()) return NextResponse.json({ error: 'Message is required.' }, { status: 400 });

    /* Save to MongoDB */
    let saved = null;
    try {
      await dbConnect();
      saved = await Contact.create({ name: name.trim(), email: email.trim().toLowerCase(), phone: (phone || '').trim(), subject: (subject || '').trim(), message: message.trim() });
      console.log(`[contact] ✓ Saved query: ${saved._id} from ${email}`);
    } catch (dbErr) {
      console.error('[contact] DB save failed (non-fatal):', dbErr.message);
    }

    /* Send email notification */
    const transporter = getTransporter();
    if (transporter) {
      const to   = process.env.NOTIFICATION_EMAIL || 'gcisbte11@gmail.com';
      const time = new Date().toLocaleString('en-PK', { dateStyle: 'full', timeStyle: 'short' });
      try {
        await transporter.sendMail({
          from: `"GCI Website" <${process.env.EMAIL_USER}>`,
          to,
          subject: `New Contact Query: ${subject || 'General Inquiry'} — GCI`,
          html: `
<div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.1)">
  <div style="background:linear-gradient(135deg,#0a0a0a,#1a1a1a);padding:20px 28px">
    <h1 style="color:#F5C842;font-size:20px;margin:0">New Contact Query</h1>
    <p style="color:rgba(255,255,255,.4);font-size:10px;margin:4px 0 0;text-transform:uppercase;letter-spacing:1px">Global Computer Institute Website</p>
  </div>
  <div style="height:3px;background:linear-gradient(90deg,#D4A017,#F5C842)"></div>
  <div style="padding:24px 28px">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 0;font-size:12px;font-weight:700;color:#555;width:110px">Name:</td><td style="padding:8px 0;font-size:13px;color:#111">${name}</td></tr>
      <tr><td style="padding:8px 0;font-size:12px;font-weight:700;color:#555">Email:</td><td style="padding:8px 0;font-size:13px;color:#111">${email}</td></tr>
      ${phone ? `<tr><td style="padding:8px 0;font-size:12px;font-weight:700;color:#555">Phone:</td><td style="padding:8px 0;font-size:13px;color:#111">${phone}</td></tr>` : ''}
      <tr><td style="padding:8px 0;font-size:12px;font-weight:700;color:#555">Subject:</td><td style="padding:8px 0;font-size:13px;color:#111">${subject || '—'}</td></tr>
      <tr><td style="padding:8px 0;font-size:12px;font-weight:700;color:#555;vertical-align:top">Message:</td><td style="padding:8px 0;font-size:13px;color:#111;line-height:1.6">${message.replace(/\n/g, '<br>')}</td></tr>
      <tr><td style="padding:8px 0;font-size:12px;font-weight:700;color:#555">Received:</td><td style="padding:8px 0;font-size:12px;color:#888">${time}</td></tr>
    </table>
  </div>
  <div style="background:#f7f7f7;border-top:1px solid #eee;padding:12px 28px;font-size:10px;color:#aaa">GCI Global Computer Institute — gcisbte11@gmail.com</div>
</div>`,
          text: `Contact Query\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '—'}\nSubject: ${subject || '—'}\nMessage:\n${message}\n\nReceived: ${time}`,
        });
        console.log(`[contact] ✓ Email sent to ${to}`);
      } catch (mailErr) {
        console.warn('[contact] Email send failed (non-fatal):', mailErr.message);
      }
    } else {
      console.warn('[contact] Email not configured — skipping notification');
    }

    return NextResponse.json({ ok: true, id: saved?._id?.toString() || null }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/contact] Unexpected error:', err.message);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
