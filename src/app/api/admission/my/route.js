/**
 * GET /api/admission/my
 * Returns admission records for the currently logged-in student.
 * Admins see all records.
 */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admission from '@/models/Admission';

const isObjectId = (s) => /^[a-f\d]{24}$/i.test(String(s ?? ''));

export async function GET(req) {
  try {
    const uid   = req.headers.get('x-user-id')    || '';
    const role  = req.headers.get('x-user-role')  || '';
    const email = req.headers.get('x-user-email') || '';

    if (!uid && !email) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

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
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
    }

    // Build filter
    let filter = {};
    if (role === 'admin') {
      filter = {}; // admins see everything
    } else {
      // Students see their own records — match by userId OR email
      const conditions = [];
      if (isObjectId(uid)) conditions.push({ userId: uid });
      if (email) conditions.push({ userEmail: email.toLowerCase() });
      if (email) conditions.push({ email: email.toLowerCase() });

      if (conditions.length === 0) {
        return NextResponse.json({ admissions: [] });
      }
      filter = { $or: conditions };
    }

    const admissions = await Admission.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const normalised = admissions.map(a => ({
      ...a,
      id:          a._id.toString(),
      _id:         a._id.toString(),
      submittedAt: a.createdAt || new Date(),
    }));

    return NextResponse.json({ admissions: normalised });

  } catch (err) {
    console.error('[GET /api/admission/my]', err.message);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
