import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/db';
import User from '@/models/User';

const isObjectId = (s) => /^[a-f\d]{24}$/i.test(String(s ?? ''));

export async function GET(req) {
  try {
    const conn = await dbConnect();
    if (!conn) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });

    const uid = req.headers.get('x-user-id');
    if (!uid || !isObjectId(uid)) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const requester = await User.findById(uid).select('role').lean();
    if (!requester || requester.role !== 'admin')
      return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });

    const users = await User.find({}).select('-password -__v').sort({ createdAt: -1 }).lean();
    return NextResponse.json({ users });
  } catch (err) {
    console.error('[GET /api/users]', err.message);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
