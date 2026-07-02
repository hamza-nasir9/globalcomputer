/**
 * POST /api/auth/register
 * Creates a new student account in MongoDB.
 */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, password, phone } = body;

    // Validation
    if (!name?.trim())
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
    if (!password || password.length < 6)
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });

    // Connect to MongoDB
    let conn;
    try {
      conn = await dbConnect();
    } catch (dbErr) {
      console.error('[POST /api/auth/register] DB connection failed:', dbErr.message);
      return NextResponse.json(
        { error: 'Database connection failed. Please try again in a moment.' },
        { status: 503 }
      );
    }

    if (!conn) {
      return NextResponse.json(
        { error: 'Database not configured. Please create .env.local with your MONGODB_URI. See SETUP.md for instructions.' },
        { status: 503 }
      );
    }

    // Check for duplicate email
    const existing = await User.findOne({ email: email.trim().toLowerCase() }).lean();
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    // Create user — password hashed by pre-save hook
    const user = await User.create({
      name:  name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: (phone || '').trim(),
      role:  'student',
    });

    const safe = user.toSafeObject();
    console.log(`[register] ✓ New student: ${safe.email}`);

    return NextResponse.json({ user: safe }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/auth/register] Unexpected error:', err.message, err.stack);
    if (err.code === 11000) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error — please try again.' }, { status: 500 });
  }
}
