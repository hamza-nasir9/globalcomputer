/**
 * GET /api/admin/seed-admin
 *
 * Creates the GCI admin account in MongoDB if it doesn't exist.
 * Visit this URL ONCE after starting the server:
 *   http://localhost:3000/api/admin/seed-admin
 *
 * Admin credentials:
 *   Email:    admin@gmail.com
 *   Password: Admin@123
 */
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/db';
import User from '@/models/User';

const ADMIN_EMAIL    = 'admin@gmail.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_NAME     = 'GCI Admin';

export async function GET() {
  try {
    let conn;
    try {
      conn = await dbConnect();
    } catch (dbErr) {
      return NextResponse.json(
        { error: `Database connection failed: ${dbErr.message}` },
        { status: 503 }
      );
    }

    if (!conn) {
      return NextResponse.json(
        { error: 'MONGODB_URI not set in .env.local' },
        { status: 503 }
      );
    }

    // Check if admin already exists
    const existing = await User.findOne({ email: ADMIN_EMAIL }).lean();
    if (existing) {
      return NextResponse.json({
        message: '✓ Admin already exists — no changes made.',
        admin: {
          email: existing.email,
          role:  existing.role,
          id:    existing._id.toString(),
        },
      });
    }

    // Create admin — password is hashed by the User model's pre-save hook
    const admin = await User.create({
      name:     ADMIN_NAME,
      email:    ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      phone:    '',
      role:     'admin',
    });

    console.log(`[seed-admin] ✓ Admin created: ${admin.email}`);

    return NextResponse.json({
      message: '✅ Admin account created successfully!',
      admin: {
        email: admin.email,
        role:  admin.role,
        id:    admin._id.toString(),
      },
      login: {
        email:    ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        note:     'Please change this password after first login.',
      },
    }, { status: 201 });

  } catch (err) {
    console.error('[GET /api/admin/seed-admin]', err.message);
    return NextResponse.json({ error: `Error: ${err.message}` }, { status: 500 });
  }
}
