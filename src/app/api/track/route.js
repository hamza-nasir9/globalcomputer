/**
 * GET /api/track?id=GCI-2026-XXXXXX
 * Public endpoint — fetch application status by tracking ID
 */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admission from '@/models/Admission';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const trackingId = (searchParams.get('id') || '').trim().toUpperCase();

    if (!trackingId) {
      return NextResponse.json({ error: 'Tracking ID is required.' }, { status: 400 });
    }

    let conn;
    try {
      conn = await dbConnect();
    } catch (dbErr) {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again.' },
        { status: 503 }
      );
    }

    if (!conn) {
      return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });
    }

    const admission = await Admission.findOne({ trackingId })
      .select('trackingId fullName course status createdAt')
      .lean();

    if (!admission) {
      return NextResponse.json({ error: 'No application found with this Tracking ID. Please check and try again.' }, { status: 404 });
    }

    return NextResponse.json({
      trackingId:    admission.trackingId,
      fullName:      admission.fullName,
      course:        admission.course,
      status:        admission.status,
      dateSubmitted: admission.createdAt,
    });

  } catch (err) {
    console.error('[GET /api/track] Error:', err.message);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
