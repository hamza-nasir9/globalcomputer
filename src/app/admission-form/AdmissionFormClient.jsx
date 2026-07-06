'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { saveStudent } from '@/lib/studentStore';
import { AlertCircle, CheckCircle, ArrowRight, Camera, Upload } from 'lucide-react';
import Link from 'next/link';

/* ─────────────────────────────────────────────────────────────────────────────
   Course lists — exactly matching the physical GCI form
──────────────────────────────────────────────────────────────────────────────*/
const LEFT_COURSES = [
  'Diploma Information Technology (DIT)',
  'Certificate Information Technology (CIT)',
  'Microsoft Office',
  'Multimedia & Graphics',
  'Web Design & Development',
  'English Language / IELTS Preparation',
  'Job Package',
  'Auto Cad 2D & 3D',
];
const RIGHT_COURSES = [
  'Social Media Marketing',
  'Computerized Accounting',
  'Computer Hardware & Networking',
  'Computer Languages C++ PHP',
  'Freelancing Career',
  'School Teaching Course / Summer Camp',
];
const HOW_OPTIONS = ["By Advertising", "By Global's Student", "By Friend", "Other"];
const TIMINGS = ['Morning (8AM–12PM)', 'Afternoon (12PM–4PM)', 'Evening (4PM–8PM)'];

/* ─── Shared input style tokens ──────────────────────────────────────────── */
const S = {
  underline: {
    width: '100%', padding: '8px 10px', fontSize: 14, outline: 'none',
    backgroundColor: 'transparent', border: 'none',
    borderBottom: '1px solid var(--border-medium)',
    color: 'var(--text-primary)', transition: 'border-color 0.15s',
  },
};

/* ─── InlineField — label + underline input ─────────────────────────────── */
function InlineField({ label, name, value, onChange, type = 'text', placeholder = '', style = {} }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2" style={{ minWidth: 0, ...style }}>
      <span className="text-sm font-semibold sm:whitespace-nowrap flex-shrink-0"
        style={{ color: 'var(--text-primary)' }}>{label}</span>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder}
        className="flex-1 min-w-0"
        style={S.underline}
        onFocus={e => (e.target.style.borderBottomColor = '#D4A017')}
        onBlur={e => (e.target.style.borderBottomColor = 'var(--border-medium)')}
      />
    </div>
  );
}

/* ─── Checkbox component ────────────────────────────────────────────────── */
function Checkbox({ checked, onChange }) {
  return (
    <div
      onClick={onChange}
      className="w-4 h-4 border-2 rounded-sm flex-shrink-0 flex items-center justify-center cursor-pointer transition-colors"
      style={{
        borderColor: checked ? '#D4A017' : 'var(--border-medium)',
        backgroundColor: checked ? '#D4A017' : 'transparent',
      }}>
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="black" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════════════════════════════════ */
export default function AdmissionFormClient() {
  const { user, loading: authLoading } = useAuth();
  const fileRef = useRef(null);

  /* ── State ── */
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);
  const [submittedTrackingId, setSubmittedTrackingId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [othersText, setOthersText] = useState('');
  const [otherHowText, setOtherHowText] = useState('');
  const [imgPreview, setImgPreview] = useState('');
  const [imgPath, setImgPath] = useState('');
  const [imgUploading, setImgUploading] = useState(false);

  const [form, setForm] = useState({
    regNo: '', fullName: '', fatherName: '', address: '',
    profession: '', phone: '', guardianPhone: '',
    qualification: '', whatsapp: '',
    courseToJoin: '', timing: '',
    howKnew: [],
    selectedCourses: [],
    dateOfAdmission: '', monthlyFee: '', admissionFee: '', totalFee: '',
  });

  useEffect(() => {
    if (user?.name) setForm(p => ({ ...p, fullName: p.fullName || user.name }));
    if (user?.phone) setForm(p => ({ ...p, phone: p.phone || user.phone }));
  }, [user]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: '', general: '' }));
  }, []);

  const toggleCourse = useCallback((course) => {
    setForm(p => ({
      ...p,
      selectedCourses: p.selectedCourses.includes(course)
        ? p.selectedCourses.filter(c => c !== course)
        : [...p.selectedCourses, course],
    }));
    setErrors(p => ({ ...p, courses: '' }));
  }, []);

  const toggleHow = useCallback((opt) => {
    setForm(p => ({
      ...p,
      howKnew: p.howKnew.includes(opt)
        ? p.howKnew.filter(x => x !== opt)
        : [...p.howKnew, opt],
    }));
  }, []);

  /**
   * handleImage — resize client-side with canvas → store as base64 in MongoDB.
   *
   * WHY BASE64 (not file upload):
   *   • Vercel serverless: writeFile to public/ is ephemeral — files vanish after the request ends.
   *   • No CDN/cloud storage configured.
   *   • Canvas resize keeps stored value under ~80 KB (well within MongoDB 16 MB doc limit).
   *   • <img src={base64}> works identically to a URL everywhere — admin dashboard, print, etc.
   */
  const handleImage = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors(p => ({ ...p, image: 'Please upload a JPG or PNG image.' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(p => ({ ...p, image: 'Image must be smaller than 5 MB.' }));
      return;
    }

    setErrors(p => ({ ...p, image: '' }));
    setImgUploading(true);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const originalDataUrl = ev.target.result;
      // Resize to max 400×400, JPEG q=0.78 → ~30-100 KB
      const img = new window.Image();
      img.onload = () => {
        const MAX = 400;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
          else                { width  = Math.round(width  * MAX / height); height = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', 0.78);
        setImgPreview(base64);
        setImgPath(base64);
        setImgUploading(false);
      };
      img.onerror = () => {
        setErrors(p => ({ ...p, image: 'Could not read image. Please try another file.' }));
        setImgUploading(false);
      };
      img.src = originalDataUrl;
    };
    reader.onerror = () => {
      setErrors(p => ({ ...p, image: 'Could not read file. Please try again.' }));
      setImgUploading(false);
    };
    reader.readAsDataURL(file);
  }, []);

  function validate() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Student name is required';
    if (!form.fatherName.trim()) e.fatherName = "Father's name is required";
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (form.selectedCourses.length === 0 && !form.courseToJoin.trim() && !othersText.trim())
      e.courses = 'Please select at least one course';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); window.scrollTo({ top: 300, behavior: 'smooth' }); return; }

    setSubmitting(true);
    try {
      const courses = [
        ...form.selectedCourses,
        ...(othersText.trim() ? [`Others: ${othersText.trim()}`] : []),
      ];
      const howKnewFull = [
        ...form.howKnew,
        ...(form.howKnew.includes('Other') && otherHowText.trim()
          ? [`Other: ${otherHowText.trim()}`]
          : []),
      ];

      const primaryCourse = courses[0] || form.courseToJoin.trim() || 'Not specified';

      const payload = {
        fullName: form.fullName.trim(),
        fatherName: form.fatherName.trim(),
        course: primaryCourse,
        phone: form.phone.trim(),
        email: user?.email || '',
        address: form.address.trim(),
        qualification: form.qualification.trim(),
        image: imgPath || '',
        cnic: form.regNo.trim(),
        regNo: form.regNo.trim(),
        profession: form.profession.trim(),
        guardianPhone: form.guardianPhone.trim(),
        whatsapp: form.whatsapp.trim(),
        timing: form.timing,
        courseToJoin: form.courseToJoin.trim(),
        howKnew: howKnewFull,
        selectedCourses: courses,
        dateOfAdmission: form.dateOfAdmission,
        monthlyFee: form.monthlyFee,
        admissionFee: form.admissionFee,
        totalFee: form.totalFee,
        status: 'Pending',
        userId: user?.id || null,
      };

      let apiSuccess = false;
      let savedId = `local-${Date.now()}`;
      try {
        const res = await fetch('/api/admission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(user?.id ? { 'x-user-id': String(user.id) } : {}),
            ...(user?.role ? { 'x-user-role': String(user.role) } : {}),
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (!res.ok) {
          setErrors({ general: data.error || 'Submission failed. Please check your details.' });
          return;
        }

        savedId = data.admission?._id || data.admission?.id || savedId;
        if (data.admission?.trackingId) {
          setSubmittedTrackingId(data.admission.trackingId);
        }
        apiSuccess = true;
      } catch (networkErr) {
        console.warn('[admission] API unavailable, saving locally only:', networkErr.message);
      }

      try {
        saveStudent({
          ...payload,
          image: imgPath || imgPreview || '',
          id: savedId,
          _id: savedId,
        });
      } catch { }

      setSubmittedId(savedId);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('[admission] Unexpected error:', err);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  const lineBorder = '1px solid var(--border-medium)';
  const sectionHeadBg = 'linear-gradient(135deg,#D4A017,#F5C842)';
  const cardBg = 'var(--bg-card)';

  /* Loading spinner while auth resolves — very brief, prevents flash */
  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <span className="w-8 h-8 border-2 border-[#D4A017]/30 border-t-[#D4A017] rounded-full animate-spin" />
    </div>
  );

  /* ── Success screen — shown after form submission ── */
  if (submitted) return (
    <>
      <TopBar />
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 pt-[80px] md:pt-[123px] pb-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-lg w-full rounded-3xl border overflow-hidden"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-gold)', boxShadow: 'var(--shadow-card)' }}>

          {/* ── Step 1: Tracking ID ── */}
          <div className="px-8 pt-8 pb-6 text-center border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{ background: 'rgba(212,160,23,0.15)', border: '2px solid rgba(212,160,23,0.4)' }}>
              <CheckCircle size={40} className="text-[#D4A017]" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Application Submitted!
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Your admission form has been saved successfully.
            </p>
          </div>

          {/* Tracking ID block */}
          <div className="px-8 py-6 text-center" style={{ backgroundColor: 'rgba(212,160,23,0.04)' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
              Your Tracking ID
            </p>
            <div className="inline-block px-6 py-3 rounded-2xl border-2 mb-3"
              style={{ borderColor: 'var(--border-gold)', backgroundColor: 'rgba(212,160,23,0.08)' }}>
              <span className="font-mono font-black text-2xl tracking-widest" style={{ color: '#F5C842' }}>
                {submittedTrackingId || `GCI-${new Date().getFullYear()}-${String(submittedId).slice(-6).toUpperCase()}`}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Please <strong style={{ color: 'var(--text-primary)' }}>save this Tracking ID</strong> — you will use it to check your application status after logging in.
            </p>
          </div>

          {/* ── Step 2: Register / Login prompt (only for guests) ── */}
          {!user ? (
            <div className="px-8 py-6 border-t" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-input)' }}>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gold-gradient flex-shrink-0 flex items-center justify-center text-black font-black text-sm mt-0.5">2</div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Create your account to track status</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    Register with the same email to access the Tracking ID page and monitor your application.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/auth/register?from=admission&tid=${encodeURIComponent(submittedTrackingId || '')}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-gold-gradient text-black font-bold px-5 py-3 rounded-full text-sm"
                  style={{ boxShadow: 'var(--shadow-gold-sm)' }}>
                  <ArrowRight size={15} />Create Account
                </Link>
                <Link
                  href={`/auth/login?redirect=/track`}
                  className="flex-1 flex items-center justify-center gap-2 border font-semibold px-5 py-3 rounded-full text-sm"
                  style={{ borderColor: 'var(--border-gold)', color: 'var(--text-primary)' }}>
                  Already have an account
                </Link>
              </div>
            </div>
          ) : (
            /* Already logged in — go straight to track */
            <div className="px-8 pb-8 pt-5 flex flex-col sm:flex-row gap-3">
              <Link href="/track"
                className="flex-1 flex items-center justify-center gap-2 bg-gold-gradient text-black font-bold px-5 py-3 rounded-full text-sm"
                style={{ boxShadow: 'var(--shadow-gold-sm)' }}>
                Check Application Status
              </Link>
              <Link href="/"
                className="flex-1 flex items-center justify-center gap-2 border font-semibold px-5 py-3 rounded-full text-sm"
                style={{ borderColor: 'var(--border-gold)', color: 'var(--text-primary)' }}>
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <TopBar />
      <Navbar />
      <main className="pt-[80px] md:pt-[123px] pb-16 px-3 sm:px-6 md:px-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-6 md:mb-8">
            <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: '#D4A017' }}>
              Enrollment
            </span>
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Admission{' '}
              <span style={{ background: 'linear-gradient(135deg,#D4A017,#F5C842)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Application Form
              </span>
            </h1>
            <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
              {user
                ? <>Logged in as <span className="text-[#D4A017] font-semibold">{user.name}</span></>
                : 'Fill in the form below — no account required'}
            </p>
          </div>

          {errors.general && (
            <div className="flex items-start gap-2 p-3 rounded-xl mb-4 text-sm"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="rounded-2xl overflow-hidden"
              style={{ border: '2px solid var(--border-gold)', backgroundColor: cardBg, boxShadow: 'var(--shadow-card)' }}>

              <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-8 py-4 gap-3"
                style={{ background: sectionHeadBg }}>
                <div className="text-center sm:text-left">
                  <h2 className="font-display font-black text-lg md:text-2xl text-black leading-tight">Global</h2>
                  <p className="font-bold text-sm md:text-base text-black/90 leading-tight">Computer Institute</p>
                  <p className="text-[10px] md:text-xs text-black/70">Registered by: Sindh Board of Technical Education</p>
                </div>
                <div className="text-right">
                  <div className="bg-black/80 text-[#F5C842] font-black text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg tracking-wider inline-block whitespace-normal text-center">
                    ADMISSION<br />FORM
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-8 space-y-5 md:space-y-6">

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Reg. No.</span>
                      <div className="flex gap-1 flex-wrap">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="w-6 h-7 border rounded flex items-center justify-center text-xs font-bold"
                            style={{ borderColor: 'var(--border-medium)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}>
                            {(form.regNo || '')[i] || ''}
                          </div>
                        ))}
                      </div>
                    </div>
                    <input
                      type="text" name="regNo" value={form.regNo} onChange={handleChange}
                      placeholder="Registration Number (optional)"
                      maxLength={20}
                      className="w-full mt-2 px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: 'var(--bg-input)', border: lineBorder, color: 'var(--text-primary)', outline: 'none' }}
                      onFocus={e => (e.target.style.borderColor = '#D4A017')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border-medium)')}
                    />
                  </div>

                  <div className="flex-shrink-0 text-center w-full sm:w-auto">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleImage}
                      className="hidden"
                    />
                    <div
                      onClick={() => !imgUploading && fileRef.current?.click()}
                      className="w-20 h-24 md:w-24 md:h-28 border-2 rounded-lg flex flex-col items-center justify-center overflow-hidden relative transition-all group mx-auto sm:mx-0"
                      style={{
                        borderColor: errors.image ? '#ef4444' : imgPreview ? '#D4A017' : 'var(--border-gold)',
                        backgroundColor: 'var(--bg-input)',
                        cursor: imgUploading ? 'wait' : 'pointer',
                      }}>
                      {imgUploading ? (
                        <span className="w-6 h-6 border-2 border-[#D4A017]/30 border-t-[#D4A017] rounded-full animate-spin" />
                      ) : imgPreview ? (
                        <>
                          <img src={imgPreview} alt="Student photo" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera size={18} className="text-white" />
                          </div>
                          {imgPath && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <Camera size={20} className="mb-1" style={{ color: errors.image ? '#ef4444' : '#D4A017' }} />
                          <span className="text-[10px] text-center px-1 font-medium leading-tight"
                            style={{ color: errors.image ? '#ef4444' : 'var(--text-muted)' }}>Photo<br />1 × 1</span>
                          <Upload size={12} className="mt-1 opacity-50" style={{ color: 'var(--text-muted)' }} />
                        </>
                      )}
                    </div>
                    {errors.image && (
                      <p className="text-[10px] text-red-400 mt-1 max-w-[96px] mx-auto sm:mx-0">{errors.image}</p>
                    )}
                    <p className="text-[9px] mt-0.5 text-center sm:text-left" style={{ color: 'var(--text-muted)' }}>JPG/PNG ≤2MB</p>
                  </div>
                </div>

                <div>
                  <InlineField label="Student Name" name="fullName" value={form.fullName} onChange={handleChange} />
                  {errors.fullName && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle size={11} />{errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <InlineField label="Father's Name" name="fatherName" value={form.fatherName} onChange={handleChange} />
                  {errors.fatherName && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle size={11} />{errors.fatherName}
                    </p>
                  )}
                </div>

                <InlineField label="Address" name="address" value={form.address} onChange={handleChange} />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <InlineField label="Profession" name="profession" value={form.profession} onChange={handleChange} />
                  <div>
                    <InlineField label="Student Mob #" name="phone" value={form.phone} onChange={handleChange} type="tel" />
                    {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                  </div>
                  <InlineField label="Guardian Mob #" name="guardianPhone" value={form.guardianPhone} onChange={handleChange} type="tel" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InlineField label="Qualification" name="qualification" value={form.qualification} onChange={handleChange} />
                  <InlineField label="WhatsApp #" name="whatsapp" value={form.whatsapp} onChange={handleChange} type="tel" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InlineField label="Course To Be Join" name="courseToJoin" value={form.courseToJoin} onChange={handleChange} />
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="text-sm font-semibold sm:whitespace-nowrap flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                      Timing
                    </span>
                    <select
                      name="timing" value={form.timing} onChange={handleChange}
                      className="flex-1 min-w-0 px-2 py-1 rounded text-sm"
                      style={{ backgroundColor: 'var(--bg-input)', border: lineBorder, color: 'var(--text-primary)', outline: 'none' }}>
                      <option value="">Select</option>
                      {TIMINGS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="rounded-xl p-4" style={{ border: lineBorder, backgroundColor: 'var(--bg-input)' }}>
                  <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    How did you get to know about Global Computer Institute?
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {HOW_OPTIONS.map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                        <Checkbox checked={form.howKnew.includes(opt)} onChange={() => toggleHow(opt)} />
                        <span className="text-xs group-hover:text-[#D4A017] transition-colors select-none"
                          style={{ color: 'var(--text-secondary)' }}>{opt}</span>
                      </label>
                    ))}
                  </div>
                  {form.howKnew.includes('Other') && (
                    <input
                      type="text" value={otherHowText} onChange={e => setOtherHowText(e.target.value)}
                      placeholder="Please specify…"
                      className="mt-3 w-full px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: 'var(--bg-card)', border: lineBorder, color: 'var(--text-primary)', outline: 'none' }}
                      onFocus={e => (e.target.style.borderColor = '#D4A017')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border-medium)')}
                    />
                  )}
                </div>

                <div className="rounded-xl overflow-hidden" style={{ border: '2px solid var(--border-gold)' }}>
                  <div className="text-center py-2.5 font-black text-sm tracking-widest"
                    style={{ background: sectionHeadBg, color: '#000' }}>
                    CHOOSE THE COURSE
                  </div>
                  {errors.courses && (
                    <p className="text-xs text-red-400 px-4 pt-2 flex items-center gap-1">
                      <AlertCircle size={11} />{errors.courses}
                    </p>
                  )}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                    <div className="space-y-2">
                      {LEFT_COURSES.map(course => (
                        <label key={course} className="flex items-center gap-2 cursor-pointer group">
                          <Checkbox
                            checked={form.selectedCourses.includes(course)}
                            onChange={() => toggleCourse(course)}
                          />
                          <span className="text-xs md:text-sm group-hover:text-[#D4A017] transition-colors select-none"
                            style={{ color: 'var(--text-secondary)' }}>{course}</span>
                        </label>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {RIGHT_COURSES.map(course => (
                        <label key={course} className="flex items-center gap-2 cursor-pointer group">
                          <Checkbox
                            checked={form.selectedCourses.includes(course)}
                            onChange={() => toggleCourse(course)}
                          />
                          <span className="text-xs md:text-sm group-hover:text-[#D4A017] transition-colors select-none"
                            style={{ color: 'var(--text-secondary)' }}>{course}</span>
                        </label>
                      ))}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 border-2 rounded-sm flex-shrink-0 transition-colors"
                            style={{
                              borderColor: othersText ? '#D4A017' : 'var(--border-medium)',
                              backgroundColor: othersText ? 'rgba(212,160,23,0.15)' : 'transparent',
                            }}
                          />
                          <span className="text-xs md:text-sm flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>Others</span>
                        </div>
                        <input
                          type="text" value={othersText} onChange={e => setOthersText(e.target.value)}
                          placeholder="specify course…"
                          className="flex-1 min-w-0 px-2 py-0.5 text-xs rounded"
                          style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', outline: 'none' }}
                          onFocus={e => (e.target.style.borderColor = '#D4A017')}
                          onBlur={e => (e.target.style.borderColor = 'var(--border-medium)')}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden" style={{ border: lineBorder }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    <div style={{ borderRight: '1px solid var(--border-medium)' }}>
                      <div className="p-3 flex flex-col sm:flex-row sm:items-baseline gap-2" style={{ borderBottom: lineBorder }}>
                        <span className="text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>Date of Admission:</span>
                        <input
                          type="date" name="dateOfAdmission" value={form.dateOfAdmission} onChange={handleChange}
                          className="flex-1 min-w-0 text-xs px-1 rounded"
                          style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', outline: 'none' }}
                          onFocus={e => (e.target.style.borderColor = '#D4A017')}
                          onBlur={e => (e.target.style.borderColor = 'var(--border-medium)')}
                        />
                      </div>
                      <div className="p-3 flex flex-col sm:flex-row sm:items-baseline gap-2">
                        <span className="text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>Monthly Fee:</span>
                        <input
                          type="text" name="monthlyFee" value={form.monthlyFee} onChange={handleChange}
                          placeholder="PKR"
                          className="flex-1 min-w-0 text-xs px-2 py-0.5 rounded"
                          style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', outline: 'none' }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="p-3 flex flex-col sm:flex-row sm:items-baseline gap-2" style={{ borderBottom: lineBorder }}>
                        <span className="text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>Admission Fee:</span>
                        <input
                          type="text" name="admissionFee" value={form.admissionFee} onChange={handleChange}
                          placeholder="PKR"
                          className="flex-1 min-w-0 text-xs px-2 py-0.5 rounded"
                          style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', outline: 'none' }}
                        />
                      </div>
                      <div className="p-3 flex flex-col sm:flex-row sm:items-baseline gap-2">
                        <span className="text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>Total Fee:</span>
                        <input
                          type="text" name="totalFee" value={form.totalFee} onChange={handleChange}
                          placeholder="PKR"
                          className="flex-1 min-w-0 text-xs px-2 py-0.5 rounded"
                          style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', outline: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-4 space-y-1" style={{ backgroundColor: 'var(--bg-input)', border: lineBorder }}>
                  {[
                    'Admission, Monthly & SBTE fee once paid are non-refundable.',
                    'Monthly Fee must be paid on/before 5th of every month, otherwise late fee Rs. 25/- per day will be charged.',
                    'Examination fee for SBTE should be paid at the time of registration which is not included in course training fee.',
                  ].map((t, i) => (
                    <p key={i} className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span className="font-bold text-[#D4A017] mr-1">{i + 1}.</span>{t}
                    </p>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2">
                  {['Administrator', 'Signature of Applicant'].map(role => (
                    <div key={role} className="text-center">
                      <div className="h-12 border-b mb-2" style={{ borderColor: 'var(--border-medium)' }} />
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{role}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl overflow-hidden" style={{ border: lineBorder }}>
                  {[
                    { num: '1', label: 'Campus 1', address: 'Saudabad Malir Indus Mehran Society A-22, Near 1st P.S.O Petrol Pump, Karachi-75080', contact: '0213-4504816, 0333-3580212 | gcisbte11@gmail.com' },
                    { num: '2', label: 'Campus 2', address: 'Model Colony Near Railway Crossing Rabbani Masjid, Karachi', contact: '0322-2511944, 0318-2511944' },
                    { num: '3', label: 'Campus 3', address: 'Shahfaisal Colony-2 Behind Fauji Foundation Hospital Big Plots A-7, Karachi', contact: '0317-4740335' },
                  ].map(campus => (
                    <div key={campus.num} className="flex flex-col sm:flex-row sm:items-start gap-3 px-4 py-3 border-b last:border-b-0"
                      style={{ borderColor: 'var(--border-subtle)' }}>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-black flex-shrink-0"
                          style={{ background: sectionHeadBg }}>
                          {campus.num}
                        </div>
                        <span className="text-xs font-bold text-[#D4A017] flex-shrink-0">{campus.label}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>{campus.address}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Contact: {campus.contact}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={submitting || imgUploading}
                  className="w-full flex items-center justify-center gap-2 text-black font-bold py-3 md:py-4 px-4 rounded-xl md:rounded-2xl text-sm md:text-base transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: sectionHeadBg, boxShadow: 'var(--shadow-gold)' }}>
                  {submitting
                    ? <span className="w-4 h-4 md:w-5 md:h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    : imgUploading
                      ? <><span className="w-4 h-4 md:w-5 md:h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />Processing photo…</>
                      : <><CheckCircle size={16} className="md:w-[18px] md:h-[18px]" />Submit Admission Application</>}
                </button>

              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}