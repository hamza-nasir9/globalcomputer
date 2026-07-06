/**
 * POST /api/auth/login
 * Verifies credentials against MongoDB and returns safe user object.
 */
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Connect to MongoDB
    let conn;
    try {
      conn = await dbConnect();
    } catch (dbErr) {
      console.error('[POST /api/auth/login] DB connection failed:', dbErr.message);
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

    // Find user — must explicitly select password (hidden by default)
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password
    const match = await user.comparePassword(password);
    if (!match) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Return safe user object (no password)
    const safe = user.toSafeObject();
    console.log(`[login] ✓ User logged in: ${safe.email} (${safe.role})`);

    return NextResponse.json({ user: safe });
  } catch (err) {
    console.error('[POST /api/auth/login] Unexpected error:', err.message, err.stack);
    return NextResponse.json({ error: 'Server error — please try again.' }, { status: 500 });
  }
}
