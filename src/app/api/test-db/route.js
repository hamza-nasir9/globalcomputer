/**
 * GET /api/test-db
 * Quick connectivity test — visit in browser to verify MongoDB is working.
 * Returns DB status, connection details, and collection counts.
 */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET() {
  const uri = process.env.MONGODB_URI;
  const mode = process.env.NEXT_PUBLIC_AUTH_MODE;

  if (!uri) {
    return NextResponse.json({
      status: 'ERROR',
      message: 'MONGODB_URI is not set in .env.local',
      authMode: mode || 'not set',
    }, { status: 503 });
  }

  // Mask password in URI for display
  const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');

  let conn;
  try {
    conn = await dbConnect();
  } catch (err) {
    return NextResponse.json({
      status: 'CONNECTION_FAILED',
      message: err.message,
      uri: maskedUri,
      authMode: mode,
      fix: 'Check: 1) Password in .env.local  2) Atlas Network Access → 0.0.0.0/0  3) Cluster is not paused',
    }, { status: 503 });
  }

  if (!conn) {
    return NextResponse.json({
      status: 'NO_CONNECTION',
      message: 'dbConnect returned null',
      uri: maskedUri,
    }, { status: 503 });
  }

  // Count documents in each collection
  let userCount = 0, admissionCount = 0;
  try {
    const { default: User }      = await import('@/models/User');
    const { default: Admission } = await import('@/models/Admission');
    [userCount, admissionCount] = await Promise.all([
      User.countDocuments(),
      Admission.countDocuments(),
    ]);
  } catch (e) {
    return NextResponse.json({
      status: 'QUERY_ERROR',
      message: e.message,
    }, { status: 500 });
  }

  return NextResponse.json({
    status: 'OK',
    message: '✅ MongoDB connected successfully',
    database:   'global',
    uri:        maskedUri,
    authMode:   mode,
    collections: {
      users:      userCount,
      admissions: admissionCount,
    },
    next_step: userCount === 0
      ? 'Visit /api/admin/seed-admin to create the admin account'
      : `Admin exists. Login at /auth/login with admin@gmail.com / Admin@123`,
  });
}
