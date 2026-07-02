/**
 * POST /api/upload
 *
 * Accepts multipart/form-data with field "photo".
 * Saves image to /public/uploads/students/
 * Returns: { url: "/uploads/students/filename.jpg" }
 *
 * Limits: JPG/PNG only, max 2MB
 * Auth: any logged-in user (x-user-id header) OR guest
 */
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const MAX_BYTES  = 2 * 1024 * 1024; // 2 MB
const ALLOWED    = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'students');

export async function POST(req) {
  try {
    let formData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
    }

    const file = formData.get('photo');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No photo file received. Field name must be "photo".' }, { status: 400 });
    }

    // Validate MIME type
    const mimeType = file.type || '';
    if (!ALLOWED.has(mimeType)) {
      return NextResponse.json(
        { error: `File type "${mimeType}" not allowed. Use JPG or PNG.` },
        { status: 400 }
      );
    }

    // Read into buffer and validate size
    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.byteLength > MAX_BYTES) {
      return NextResponse.json(
        { error: `File too large (${(buffer.byteLength / 1024 / 1024).toFixed(1)}MB). Max allowed: 2MB.` },
        { status: 400 }
      );
    }

    // Build safe filename
    const uid      = req.headers.get('x-user-id') || 'guest';
    const ext      = path.extname(file.name || 'photo.jpg').toLowerCase().replace(/[^.a-z]/g, '') || '.jpg';
    const filename = `student-${Date.now()}-${uid.slice(-8).replace(/[^a-z0-9]/gi, '')}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Ensure directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Write file
    await writeFile(filepath, buffer);

    const url = `/uploads/students/${filename}`;
    console.log(`[upload] ✓ Photo saved: ${url} (${buffer.byteLength} bytes)`);

    return NextResponse.json({ url }, { status: 201 });

  } catch (err) {
    console.error('[POST /api/upload] Error:', err.message, err.stack);
    return NextResponse.json({ error: 'Upload failed — server error. Please try again.' }, { status: 500 });
  }
}
