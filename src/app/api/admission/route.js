/**
 * POST /api/admission  — submit admission form → save to MongoDB
 * GET  /api/admission  — admin only → fetch all submissions from MongoDB
 */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admission from '@/models/Admission';
import { sendAdmissionNotification } from '@/lib/mailer';

const isObjectId = (s) => /^[a-f\d]{24}$/i.test(String(s ?? ''));

/** Generate a unique tracking ID: GCI-YYYY-XXXXXX */
function generateTrackingId() {
  const year   = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `GCI-${year}-${random}`;
}

/**
 * Get requester role from request headers.
 */
async function getRole(req) {
  const uid  = req.headers.get('x-user-id')  || '';
  const role = req.headers.get('x-user-role') || '';

  if (role === 'admin') {
    if (isObjectId(uid)) {
      try {
        const conn = await dbConnect();
        if (conn) {
          const { default: User } = await import('@/models/User');
          const u = await User.findById(uid).select('role').lean();
          return u?.role || null;
        }
      } catch { /* DB verify failed — trust header */ }
    }
    return 'admin';
  }

  if (isObjectId(uid)) {
    try {
      const conn = await dbConnect();
      if (!conn) return null;
      const { default: User } = await import('@/models/User');
      const u = await User.findById(uid).select('role').lean();
      return u?.role || null;
    } catch { return null; }
  }

  return null;
}

/* ── POST: Submit admission form ─────────────────────────────── */
export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body — expected JSON.' }, { status: 400 });
    }

    const {
      regNo,
      fullName, fatherName, address, qualification, profession,
      phone, guardianPhone, whatsapp, email,
      course, courseToJoin, selectedCourses,
      timing, howKnew,
      dateOfAdmission, monthlyFee, admissionFee, totalFee,
      image,
      userId: bodyUserId,
      cnic, gender, dob,
    } = body;

    if (!fullName?.trim()) {
      return NextResponse.json({ error: 'Student name (fullName) is required.' }, { status: 400 });
    }
    if (!phone?.trim()) {
      return NextResponse.json({ error: 'Student mobile (phone) is required.' }, { status: 400 });
    }

    let primaryCourse = '';
    if (Array.isArray(selectedCourses) && selectedCourses.length > 0) {
      primaryCourse = selectedCourses[0];
    } else if (typeof selectedCourses === 'string' && selectedCourses.trim()) {
      primaryCourse = selectedCourses.trim().split(',')[0].trim();
    }
    if (!primaryCourse) primaryCourse = (courseToJoin || course || 'Not specified').trim();

    const howKnewStr = Array.isArray(howKnew)
      ? howKnew.join(', ')
      : (howKnew || '');

    const selectedCoursesStr = Array.isArray(selectedCourses)
      ? selectedCourses.join(', ')
      : (selectedCourses || '');

    const headerUid   = req.headers.get('x-user-id') || '';
    const resolvedUid = isObjectId(headerUid)  ? headerUid
                      : isObjectId(bodyUserId) ? String(bodyUserId)
                      : null;

    const cleanEmail = (email || '').trim().toLowerCase();

    // Generate unique tracking ID
    const trackingId = generateTrackingId();

    const admissionPayload = {
      trackingId,
      userId:    resolvedUid,
      userEmail: cleanEmail,
      fullName:      fullName.trim(),
      fatherName:    (fatherName    || '').trim(),
      course:        primaryCourse,
      phone:         phone.trim(),
      email:         cleanEmail,
      regNo:         (regNo || cnic || '').trim(),
      cnic:          (cnic  || regNo || '').trim(),
      address:       (address       || '').trim(),
      qualification: (qualification || '').trim(),
      gender:        gender  || '',
      dob:           dob     || '',
      profession:      (profession    || '').trim(),
      guardianPhone:   (guardianPhone || '').trim(),
      whatsapp:        (whatsapp      || '').trim(),
      timing:          timing         || '',
      courseToJoin:    (courseToJoin  || '').trim(),
      howKnew:         howKnewStr,
      selectedCourses: selectedCoursesStr,
      dateOfAdmission: dateOfAdmission || '',
      monthlyFee:      monthlyFee      || '',
      admissionFee:    admissionFee    || '',
      totalFee:        totalFee        || '',
      image: image || '',
      status: 'Pending',
    };

    let conn;
    try {
      conn = await dbConnect();
    } catch (dbErr) {
      console.error('[POST /api/admission] DB connection error:', dbErr.message);
      return NextResponse.json(
        { error: 'Database connection failed. Your data was not saved. Please try again.' },
        { status: 503 }
      );
    }

    let savedAdmission;

    if (conn) {
      try {
        const doc = await Admission.create(admissionPayload);
        savedAdmission = {
          ...doc.toObject(),
          id:          doc._id.toString(),
          _id:         doc._id.toString(),
          submittedAt: doc.createdAt,
        };
        console.log(`[admission] ✓ Saved to MongoDB: ${doc._id} — ${fullName} — Tracking: ${trackingId}`);
      } catch (saveErr) {
        console.error('[POST /api/admission] Mongoose save error:', saveErr.message, saveErr.errors);
        return NextResponse.json(
          { error: `Failed to save: ${saveErr.message}` },
          { status: 500 }
        );
      }
    } else {
      const localId = `local-${Date.now()}`;
      savedAdmission = {
        ...admissionPayload,
        id:          localId,
        _id:         localId,
        submittedAt: new Date().toISOString(),
        createdAt:   new Date().toISOString(),
      };
      console.warn('[admission] ⚠ Saved locally only — MongoDB not connected');
    }

    sendAdmissionNotification(savedAdmission).catch(err =>
      console.warn('[admission] Email notification failed (non-fatal):', err.message)
    );

    return NextResponse.json({ admission: savedAdmission }, { status: 201 });

  } catch (err) {
    console.error('[POST /api/admission] Unexpected error:', err.message, err.stack);
    return NextResponse.json(
      { error: 'Unexpected server error. Please try again.' },
      { status: 500 }
    );
  }
}

/* ── GET: Admin fetch all admissions ─────────────────────────── */
export async function GET(req) {
  try {
    const role = await getRole(req);
    if (!role) {
      return NextResponse.json({ error: 'Unauthorized — please log in.' }, { status: 401 });
    }
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const course = searchParams.get('course') || '';
    const q      = searchParams.get('q')      || '';
    const page   = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    const limit  = Math.min(500, parseInt(searchParams.get('limit') || '200'));

    const filter = {};
    if (status && status !== 'All') filter.status = status;
    if (course && course !== 'All') filter.course = course;
    if (q.trim()) {
      const re = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { fullName: re },
        { email: re },
        { phone: re },
        { cnic: re },
        { regNo: re },
        { course: re },
        { trackingId: re },
      ];
    }

    const [admissions, total] = await Promise.all([
      Admission.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Admission.countDocuments(filter),
    ]);

    const normalised = admissions.map(a => ({
      ...a,
      id:          a._id.toString(),
      _id:         a._id.toString(),
      submittedAt: a.createdAt || new Date(),
    }));

    return NextResponse.json({ admissions: normalised, total, page, limit });

  } catch (err) {
    console.error('[GET /api/admission] Unexpected error:', err.message, err.stack);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
