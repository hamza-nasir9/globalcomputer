'use client';
import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';

function PrintPageClient() {
  const params = useParams();
  const [student,  setStudent]  = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = params?.id;
    if (!id) return;

    async function load() {
      /* Try MongoDB API first */
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('gci_user') : null;
        const user   = stored ? JSON.parse(stored) : null;
        const headers = { 'Content-Type': 'application/json' };
        if (user?.id)   headers['x-user-id']   = String(user.id);
        if (user?.role) headers['x-user-role']  = String(user.role);

        const res = await fetch(`/api/admission/${id}`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.admission) {
            setStudent({ ...data.admission, id: data.admission._id?.toString() || data.admission.id || id });
            setTimeout(() => window.print(), 1200);
            return;
          }
        }
      } catch (err) {
        console.warn('[print] API lookup failed:', err.message);
      }
      setNotFound(true);
    }
    load();
  }, [params?.id]);

  if (notFound) return (
    <div style={{ fontFamily:'Arial,sans-serif', padding:40, textAlign:'center' }}>
      <h2 style={{ color:'#333', marginBottom:8 }}>Record not found.</h2>
      <p style={{ color:'#777', fontSize:13, marginBottom:20 }}>The record may have been deleted or the ID is invalid.</p>
      <button onClick={() => window.close()} style={{ padding:'8px 20px', cursor:'pointer', borderRadius:6, border:'1px solid #ccc' }}>Close</button>
    </div>
  );

  if (!student) return (
    <div style={{ fontFamily:'Arial,sans-serif', padding:40, textAlign:'center' }}>
      <div style={{ width:36, height:36, border:'3px solid #D4A017', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto' }} />
      <p style={{ marginTop:16, color:'#666' }}>Loading…</p>
      <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
    </div>
  );

  const s = student;
  const submittedDate = s.createdAt || s.submittedAt
    ? new Date(s.createdAt || s.submittedAt).toLocaleDateString('en-PK', { day:'2-digit', month:'long', year:'numeric' })
    : '—';

  const coursesArr = Array.isArray(s.selectedCourses)
    ? s.selectedCourses
    : (s.selectedCourses || '').split(',').map(x => x.trim()).filter(Boolean);

  const ALL_LEFT  = ['Diploma Information Technology (DIT)','Certificate Information Technology (CIT)','Microsoft Office','Multimedia & Graphics','Web Design & Development','English Language / IELTS Preparation','Job Package','Auto Cad 2D & 3D'];
  const ALL_RIGHT = ['Social Media Marketing','Computerized Accounting','Computer Hardware & Networking','Computer Languages C++ PHP','Freelancing Career','School Teaching Course / Summer Camp'];

  const isChecked = (course) => coursesArr.some(c => c.toLowerCase().includes(course.toLowerCase().slice(0, 10)));

  return (
    <>
      <style>{`
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body { width:100%; height:100%; }
        body {
          font-family:'Segoe UI',Arial,sans-serif;
          background:#f0f0f0;
          color:#111;
          -webkit-print-color-adjust:exact;
          print-color-adjust:exact;
          color-adjust:exact;
        }

        /* ── Screen wrapper ── */
        .page-wrap {
          background:#fff;
          max-width:800px;
          margin:20px auto;
          border-radius:10px;
          overflow:hidden;
          box-shadow:0 4px 28px rgba(0,0,0,.14);
        }

        /* ── Toolbar (screen only) ── */
        .toolbar {
          background:#0a0a0a;
          padding:10px 20px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          position:sticky;
          top:0;
          z-index:50;
          border-radius:10px 10px 0 0;
        }
        .toolbar-title { color:#fff; font-size:13px; font-weight:600; display:flex; align-items:center; gap:10px; }
        .toolbar-badge { width:30px; height:30px; border-radius:8px; background:linear-gradient(135deg,#D4A017,#F5C842); display:flex; align-items:center; justify-content:center; font-weight:900; color:#000; font-size:16px; }
        .toolbar-btns { display:flex; gap:10px; }
        .btn-print { background:linear-gradient(135deg,#D4A017,#F5C842); color:#000; border:none; padding:7px 18px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; }
        .btn-close { background:transparent; color:rgba(255,255,255,.6); border:1px solid rgba(255,255,255,.15); padding:7px 14px; border-radius:8px; font-size:12px; cursor:pointer; }

        /* ── Document body ── */
        .doc { padding:18px 26px 16px; }

        /* Header */
        .hdr { background:linear-gradient(135deg,#D4A017,#F5C842); padding:13px 24px; display:flex; align-items:center; justify-content:space-between; }
        .hdr-title h1 { font-size:21px; font-weight:900; color:#000; letter-spacing:-.5px; line-height:1.1; }
        .hdr-title p  { font-size:11px; font-weight:700; color:rgba(0,0,0,.65); }
        .admit-badge { background:#000; color:#F5C842; font-weight:900; font-size:11px; padding:6px 12px; border-radius:5px; letter-spacing:.05em; text-align:center; line-height:1.4; }

        /* Tracking ID bar */
        .tracking-bar { background:#0a0a0a; color:#F5C842; padding:5px 24px; font-size:11px; font-weight:700; font-family:monospace; letter-spacing:.08em; display:flex; align-items:center; gap:10px; }
        .tracking-bar span { color:rgba(255,255,255,.45); font-weight:400; }

        /* Photo + reg row */
        .top-row { display:flex; gap:14px; align-items:flex-start; margin-bottom:12px; }
        .reg-sec { flex:1; }
        .reg-lbl { font-size:10px; font-weight:700; color:#555; margin-bottom:3px; }
        .reg-boxes { display:flex; gap:2px; }
        .reg-box { width:24px; height:26px; border:1.5px solid #aaa; border-radius:2px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; background:#f9f9f9; }
        .photo-box { width:80px; height:96px; border:2px solid #D4A017; border-radius:5px; display:flex; flex-direction:column; align-items:center; justify-content:center; overflow:hidden; background:#f9f9f9; flex-shrink:0; }
        .photo-box img { width:100%; height:100%; object-fit:cover; }
        .photo-lbl { font-size:8px; color:#bbb; text-align:center; }

        /* Field rows */
        .f-row { display:flex; align-items:baseline; gap:6px; margin-bottom:7px; padding-bottom:5px; border-bottom:1px solid #e8e8e8; }
        .f-lbl { font-size:11px; font-weight:700; white-space:nowrap; flex-shrink:0; color:#111; min-width:120px; }
        .f-val { font-size:11.5px; color:#333; flex:1; min-width:0; word-break:break-word; }

        .g3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:7px; }
        .g2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:7px; }
        .g-item { border-bottom:1px solid #e8e8e8; padding-bottom:5px; }

        /* Section title */
        .sec-title { background:linear-gradient(90deg,#D4A017,#F5C842); color:#000; font-weight:900; font-size:10.5px; text-align:center; padding:4px; letter-spacing:.1em; margin:10px -2px 8px; border-radius:2px; }

        /* How-knew */
        .how-row { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:9px; }
        .how-item { display:flex; align-items:center; gap:5px; font-size:10px; color:#333; }
        .cb { width:12px; height:12px; border:1.5px solid #aaa; border-radius:2px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
        .cb.on { background:#D4A017; border-color:#D4A017; }
        .ck { color:#000; font-size:8px; font-weight:900; }

        /* Courses */
        .course-grid { display:grid; grid-template-columns:1fr 1fr; border:1.5px solid #ddd; border-radius:3px; overflow:hidden; margin-bottom:9px; }
        .course-col { padding:7px 9px; }
        .course-col:first-child { border-right:1px solid #ddd; }
        .c-item { display:flex; align-items:center; gap:5px; margin-bottom:4px; font-size:10px; color:#333; }

        /* Fee table */
        .fee-tbl { width:100%; border-collapse:collapse; margin-bottom:9px; border:1.5px solid #ddd; border-radius:3px; overflow:hidden; }
        .fee-tbl td { padding:6px 10px; font-size:11px; border:1px solid #eee; }
        .fee-tbl .lbl { font-weight:700; color:#111; }
        .fee-tbl .val { color:#555; }

        /* Terms */
        .terms { font-size:9.5px; color:#555; margin-bottom:10px; line-height:1.5; }
        .terms p { margin-bottom:2px; }
        .terms b { color:#D4A017; }

        /* Sig row */
        .sig-row { display:flex; gap:24px; margin-top:14px; }
        .sig-box { flex:1; border-top:1.5px solid #aaa; padding-top:5px; text-align:center; }
        .sig-lbl { font-size:9.5px; color:#666; font-weight:600; }
        .sig-name { font-size:9px; color:#bbb; margin-top:2px; }

        /* Campus footer */
        .campus-footer { background:#f8f8f8; border-top:1px solid #eee; padding:10px 26px; }
        .campus-row { display:flex; align-items:flex-start; gap:8px; margin-bottom:5px; }
        .campus-dot { width:16px; height:16px; border-radius:50%; background:linear-gradient(135deg,#D4A017,#F5C842); display:flex; align-items:center; justify-content:center; font-size:8px; font-weight:900; color:#000; flex-shrink:0; margin-top:1px; }
        .campus-info { font-size:9.5px; color:#444; line-height:1.4; }
        .campus-info strong { color:#D4A017; font-size:10px; }

        /* ── PRINT STYLES ── */
        @media print {
          html, body { width:210mm; height:297mm; margin:0; padding:0; background:#fff !important; }
          .toolbar { display:none !important; }
          .page-wrap {
            margin:0 !important;
            box-shadow:none !important;
            border-radius:0 !important;
            max-width:100% !important;
            width:100% !important;
          }
          /* Force everything onto one page */
          .doc { padding:10px 20px 8px; }
          @page {
            size: A4 portrait;
            margin: 6mm 8mm;
          }
          /* Prevent any page breaks inside the document */
          .hdr, .doc, .campus-footer { page-break-inside: avoid; break-inside: avoid; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      {/* Screen toolbar */}
      <div className="toolbar">
        <div className="toolbar-title">
          <div className="toolbar-badge">G</div>
          GCI Admission Form — Print Preview
        </div>
        <div className="toolbar-btns">
          <button className="btn-print" onClick={() => window.print()}>🖨 Print / Save PDF</button>
          <button className="btn-close" onClick={() => window.close()}>Close</button>
        </div>
      </div>

      {/* Printable document */}
      <div className="page-wrap">

        {/* Header */}
        <div className="hdr">
          <div className="hdr-title">
            <h1>Global Computer Institute</h1>
            <p>Registered by: Sindh Board of Technical Education</p>
          </div>
          <div className="admit-badge">ADMISSION<br />FORM</div>
        </div>

        {/* Tracking ID bar */}
        {s.trackingId && (
          <div className="tracking-bar">
            <span>Tracking ID:</span> {s.trackingId}
            <span style={{ marginLeft:'auto' }}>Status: {s.status || 'Pending'}</span>
          </div>
        )}

        <div className="doc">

          {/* Reg No + Photo */}
          <div className="top-row">
            <div className="reg-sec">
              <div className="reg-lbl">Reg. No.</div>
              <div className="reg-boxes">
                {(s.regNo || s.cnic || '').padEnd(8, ' ').slice(0, 8).split('').map((ch, i) => (
                  <div key={i} className="reg-box">{ch.trim()}</div>
                ))}
              </div>
            </div>
            <div className="photo-box">
              {s.image
                ? <img src={s.image} alt={s.fullName} />
                : <span className="photo-lbl">Photo<br />1 × 1</span>}
            </div>
          </div>

          {/* Core fields */}
          <div className="f-row"><div className="f-lbl">Student Name:</div><div className="f-val">{s.fullName || '—'}</div></div>
          <div className="f-row"><div className="f-lbl">Father&apos;s Name:</div><div className="f-val">{s.fatherName || '—'}</div></div>
          <div className="f-row"><div className="f-lbl">Address:</div><div className="f-val">{s.address || '—'}</div></div>

          <div className="g3">
            <div className="g-item"><div className="f-lbl">Profession:</div><div className="f-val">{s.profession || '—'}</div></div>
            <div className="g-item"><div className="f-lbl">Student Mob #:</div><div className="f-val">{s.phone || '—'}</div></div>
            <div className="g-item"><div className="f-lbl">Guardian Mob #:</div><div className="f-val">{s.guardianPhone || '—'}</div></div>
          </div>
          <div className="g2">
            <div className="g-item"><div className="f-lbl">Qualification:</div><div className="f-val">{s.qualification || '—'}</div></div>
            <div className="g-item"><div className="f-lbl">WhatsApp #:</div><div className="f-val">{s.whatsapp || s.phone || '—'}</div></div>
          </div>
          <div className="g2">
            <div className="g-item"><div className="f-lbl">Course To Join:</div><div className="f-val">{s.courseToJoin || s.course || '—'}</div></div>
            <div className="g-item"><div className="f-lbl">Timing:</div><div className="f-val">{s.timing || '—'}</div></div>
          </div>

          {/* How did you know */}
          <div style={{ marginBottom:8 }}>
            <div style={{ fontSize:10, fontWeight:700, marginBottom:5 }}>How did you get to know about Global Computer Institute?</div>
            <div className="how-row">
              {["By Advertising", "By Global's Student", "By Friend", "Other"].map(opt => {
                const on = (s.howKnew || '').includes(opt);
                return (
                  <div key={opt} className="how-item">
                    <div className={`cb ${on ? 'on' : ''}`}>{on && <span className="ck">✓</span>}</div>
                    {opt}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courses */}
          <div className="sec-title">CHOOSE THE COURSE</div>
          <div className="course-grid">
            <div className="course-col">
              {ALL_LEFT.map(c => (
                <div key={c} className="c-item">
                  <div className={`cb ${isChecked(c) ? 'on' : ''}`}>{isChecked(c) && <span className="ck">✓</span>}</div>
                  {c}
                </div>
              ))}
            </div>
            <div className="course-col">
              {ALL_RIGHT.map(c => (
                <div key={c} className="c-item">
                  <div className={`cb ${isChecked(c) ? 'on' : ''}`}>{isChecked(c) && <span className="ck">✓</span>}</div>
                  {c}
                </div>
              ))}
              <div className="c-item"><div className="cb" />Others: ___________</div>
            </div>
          </div>

          {/* Fee table */}
          <table className="fee-tbl">
            <tbody>
              <tr>
                <td className="lbl">Date of Admission:</td>
                <td className="val">{s.dateOfAdmission || submittedDate}</td>
                <td className="lbl">Admission Fee:</td>
                <td className="val">{s.admissionFee || '—'}</td>
              </tr>
              <tr>
                <td className="lbl">Monthly Fee:</td>
                <td className="val">{s.monthlyFee || '—'}</td>
                <td className="lbl">Total Fee:</td>
                <td className="val">{s.totalFee || '—'}</td>
              </tr>
            </tbody>
          </table>

          {/* Terms */}
          <div className="terms">
            <p><b>1.</b> Admission, Monthly &amp; SBTE fee once paid are <strong>non-refundable</strong>.</p>
            <p><b>2.</b> Monthly Fee must be paid on/before 5th of every month, otherwise late fee Rs. 25/- per day will be charged.</p>
            <p><b>3.</b> Examination fee for SBTE should be paid at the time of registration which is not included in course training fee.</p>
          </div>

          {/* Signatures */}
          <div className="sig-row">
            <div className="sig-box">
              <div style={{ height:34 }} />
              <div className="sig-lbl">Administrator</div>
            </div>
            <div className="sig-box">
              <div style={{ height:34 }} />
              <div className="sig-lbl">Signature of Applicant</div>
              <div className="sig-name">{s.fullName}</div>
            </div>
          </div>
        </div>

        {/* Campus footer */}
        <div className="campus-footer">
          {[
            { n:'1', addr:'Saudabad Malir — Indus Mehran Society A-22, Near 1st P.S.O Petrol Pump, Karachi-75080', contact:'0213-4504816, 0333-3580212 | gcisbte11@gmail.com' },
            { n:'2', addr:'Model Colony — Near Railway Crossing, Rabbani Masjid, Karachi', contact:'0322-2511944, 0318-2511944' },
            { n:'3', addr:'Shahfaisal Colony-3 — Near Fauji Foundation Hospital, Plot# 3/147, Karachi-75230', contact:'0317-4740335, 0347-2763587' },
          ].map(c => (
            <div key={c.n} className="campus-row">
              <div className="campus-dot">{c.n}</div>
              <div className="campus-info"><strong>Campus {c.n}</strong> — {c.addr} | {c.contact}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function PrintPage() {
  return (
    <Suspense fallback={
      <div style={{ fontFamily:'Arial', padding:40, textAlign:'center' }}>
        <div style={{ width:36, height:36, border:'3px solid #D4A017', borderTopColor:'transparent', borderRadius:'50%', animation:'spin .8s linear infinite', margin:'0 auto' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <PrintPageClient />
    </Suspense>
  );
}
