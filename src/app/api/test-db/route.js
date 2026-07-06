/**
 * GET /api/test-db
 * Test MongoDB connection — visit in browser to verify setup
 */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return NextResponse.json({
      status: 'ERROR',
      message: '❌ MONGODB_URI is not set',
      fix: 'Add MONGODB_URI to .env.local (local) or Vercel Environment Variables (production)',
    }, { status: 503 });
  }

  const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');

  let conn;
  try {
    conn = await dbConnect();
  } catch (err) {
    return NextResponse.json({
      status: 'CONNECTION_FAILED',
      message: err.message,
      uri: maskedUri,
      fix: '1) Check Atlas password  2) Atlas Network Access → 0.0.0.0/0  3) Cluster not paused',
    }, { status: 503 });
  }

  let userCount = 0, admissionCount = 0;
  try {
    const { default: User }      = await import('@/models/User');
    const { default: Admission } = await import('@/models/Admission');
    [userCount, admissionCount]  = await Promise.all([
      User.countDocuments(),
      Admission.countDocuments(),
    ]);
  } catch (e) {
    return NextResponse.json({ status: 'QUERY_ERROR', message: e.message }, { status: 500 });
  }

  return NextResponse.json({
    status: 'OK',
    message: '✅ MongoDB connected successfully',
    uri: maskedUri,
    collections: { users: userCount, admissions: admissionCount },
    next_step: userCount === 0
      ? '👉 Visit /api/admin/seed-admin to create admin account'
      : '✅ Admin exists. Login at /auth/login with admin@gmail.com / Admin@123',
  });
}
