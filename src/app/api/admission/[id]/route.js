/**
 * GET    /api/admission/[id]  — fetch single record (admin or owner)
 * PATCH  /api/admission/[id]  — update status (admin only)
 * DELETE /api/admission/[id]  — delete record (admin only)
 */
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/db';
import Admission from '@/models/Admission';

const isObjectId = (s) => /^[a-f\d]{24}$/i.test(String(s ?? ''));

async function resolveAuth(req) {
  const uid  = req.headers.get('x-user-id')  || '';
  const role = req.headers.get('x-user-role') || '';

  if (role === 'admin') {
    if (isObjectId(uid)) {
      try {
        const conn = await dbConnect();
        if (conn) {
          const { default: User } = await import('@/models/User');
          const u = await User.findById(uid).select('role _id').lean();
          if (u) return { _id: u._id, role: u.role };
        }
      } catch { /* fall through */ }
    }
    return { _id: uid || 'anon', role: 'admin' };
  }

  if (isObjectId(uid)) {
    try {
      const conn = await dbConnect();
      if (!conn) return null;
      const { default: User } = await import('@/models/User');
      const u = await User.findById(uid).select('role _id').lean();
      return u || null;
    } catch { return null; }
  }

  return null;
}

async function getConn() {
  try {
    return await dbConnect();
  } catch (dbErr) {
    throw new Error(`DB connection failed: ${dbErr.message}`);
  }
}

/* ── GET ─────────────────────────────────────────────────────── */
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    if (!isObjectId(id)) {
      return NextResponse.json({ error: 'Invalid ID format.' }, { status: 400 });
    }

    const conn = await getConn();
    if (!conn) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });

    const auth = await resolveAuth(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const admission = await Admission.findById(id).lean();
    if (!admission) return NextResponse.json({ error: 'Record not found.' }, { status: 404 });

    const isOwner = admission.userId?.toString() === String(auth._id);
    if (auth.role !== 'admin' && !isOwner) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    return NextResponse.json({
      admission: {
        ...admission,
        id:          admission._id.toString(),
        _id:         admission._id.toString(),
        submittedAt: admission.createdAt,
      },
    });
  } catch (err) {
    console.error('[GET /api/admission/:id]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ── PATCH ───────────────────────────────────────────────────── */
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    if (!isObjectId(id)) {
      return NextResponse.json({ error: 'Invalid ID format.' }, { status: 400 });
    }

    const conn = await getConn();
    if (!conn) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });

    const auth = await resolveAuth(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { status } = body;

    if (!['Pending', 'Under Review', 'Approved', 'Rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be Pending, Under Review, Approved, or Rejected.' },
        { status: 400 }
      );
    }

    const doc = await Admission.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!doc) return NextResponse.json({ error: 'Record not found.' }, { status: 404 });

    return NextResponse.json({
      admission: {
        ...doc,
        id:          doc._id.toString(),
        _id:         doc._id.toString(),
        submittedAt: doc.createdAt,
      },
    });
  } catch (err) {
    console.error('[PATCH /api/admission/:id]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ── DELETE ──────────────────────────────────────────────────── */
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    if (!isObjectId(id)) {
      return NextResponse.json({ error: 'Invalid ID format.' }, { status: 400 });
    }

    const conn = await getConn();
    if (!conn) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });

    const auth = await resolveAuth(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const doc = await Admission.findByIdAndDelete(id);
    if (!doc) return NextResponse.json({ error: 'Record not found.' }, { status: 404 });

    return NextResponse.json({ message: 'Record deleted.' });
  } catch (err) {
    console.error('[DELETE /api/admission/:id]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
