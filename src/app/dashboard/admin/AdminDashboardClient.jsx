'use client';
/**
 * AdminDashboardClient — with Under Review status, Tracking ID display,
 * and full status filter/dropdown support.
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashLayout from '@/components/dashboard/DashLayout';
import { useAuth } from '@/context/AuthContext';
import { getAllStudents, deleteStudent, updateStudentStatus } from '@/lib/studentStore';
import {
  Users, FileText, CheckCircle, Clock, XCircle, Search,
  ChevronDown, Printer, Trash2, Eye, Download, X,
  Mail, Phone, MapPin, CreditCard, Calendar, BookOpen,
  RefreshCw, GraduationCap, ArrowRight, AlertCircle, Hash,
} from 'lucide-react';

const SS = {
  Pending:       { bg:'rgba(251,146,60,0.15)',  text:'#FB923C', border:'rgba(251,146,60,0.3)'  },
  'Under Review':{ bg:'rgba(96,165,250,0.15)',  text:'#60A5FA', border:'rgba(96,165,250,0.3)'  },
  Approved:      { bg:'rgba(74,222,128,0.15)',  text:'#4ADE80', border:'rgba(74,222,128,0.3)'  },
  Rejected:      { bg:'rgba(248,113,113,0.15)', text:'#F87171', border:'rgba(248,113,113,0.3)' },
};

const ALL_STATUSES = ['Pending', 'Under Review', 'Approved', 'Rejected'];

const isMongoId = (s) => /^[a-f0-9]{24}$/i.test(String(s ?? ''));

function exportCSV(data) {
  if (!data.length) return;
  const H = ['Tracking ID','ID','Name','Father','Email','Phone','CNIC','Gender','DOB','Address','Course','Qualification','Status','Date'];
  const R = data.map(s => [
    s.trackingId || '', s.id, s.fullName, s.fatherName, s.email, s.phone,
    s.cnic, s.gender, s.dob, `"${s.address||''}"`,
    `"${s.course||''}"`, `"${s.qualification||''}"`, s.status,
    new Date(s.submittedAt).toLocaleString('en-PK'),
  ]);
  const blob = new Blob([[H.join(','),...R.map(r=>r.join(','))].join('\n')], { type:'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `gci-admissions-${Date.now()}.csv`;
  a.click();
}

/**
 * StudentAvatar — renders student photo with graceful fallback.
 * Shows initial letter when image is missing, empty, or fails to load.
 */
function StudentAvatar({ image, name, className = '', size = 'sm' }) {
  const [failed, setFailed] = useState(false);
  const initial = (name || '?')[0].toUpperCase();
  const showImg = image && !failed;
  return showImg ? (
    <img
      src={image}
      alt={name}
      className={`w-full h-full object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center font-bold"
      style={{
        backgroundColor: 'var(--bg-input)',
        color: '#D4A017',
        fontSize: size === 'lg' ? '2rem' : size === 'md' ? '1.1rem' : '0.75rem',
      }}>
      {initial}
    </div>
  );
}

export default function AdminDashboardClient() {
  const { user }     = useAuth();
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [students,   setStudents]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [statusF,    setStatusF]    = useState('All');
  const [courseF,    setCourseF]    = useState('All');
  const [sortBy,     setSortBy]     = useState('newest');
  const [viewS,      setViewS]      = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);

  const tab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.replace('/');
    }
  }, [user, router]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admission', {
        headers: {
          'Content-Type': 'application/json',
          ...(user?.id   ? { 'x-user-id':   String(user.id)   } : {}),
          ...(user?.role ? { 'x-user-role': String(user.role) } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        const records = (data.admissions || []).map(a => ({
          ...a,
          id:          String(a._id || a.id),
          submittedAt: a.submittedAt || a.createdAt || new Date().toISOString(),
        }));
        const localRecords = getAllStudents();
        const mongoIds = new Set(records.map(r => r.id));
        const localOnly = localRecords.filter(r => !mongoIds.has(String(r.id)));
        setStudents([...records, ...localOnly]);
        return;
      }
    } catch {}
    setStudents(getAllStudents());
  }, [user]);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const filtered = useMemo(() => {
    let list = [...students];
    if (statusF !== 'All') list = list.filter(s => s.status === statusF);
    if (courseF !== 'All') list = list.filter(s => s.course === courseF);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        [s.fullName, s.email, s.course, s.cnic, s.phone, s.trackingId].some(v => v?.toLowerCase().includes(q))
      );
    }
    list.sort((a, b) =>
      sortBy === 'newest'
        ? new Date(b.submittedAt) - new Date(a.submittedAt)
        : new Date(a.submittedAt) - new Date(b.submittedAt)
    );
    return list;
  }, [students, statusF, courseF, search, sortBy]);

  const stats = useMemo(() => ({
    total:       students.length,
    pending:     students.filter(s => s.status === 'Pending').length,
    underReview: students.filter(s => s.status === 'Under Review').length,
    approved:    students.filter(s => s.status === 'Approved').length,
    rejected:    students.filter(s => s.status === 'Rejected').length,
  }), [students]);

  const allCourses = useMemo(() =>
    ['All', ...new Set(students.map(s => s.course).filter(Boolean))],
    [students]
  );

  async function handleStatus(id, status) {
    const updater = s => (String(s.id) === String(id) || String(s._id) === String(id)) ? { ...s, status } : s;
    setStudents(prev => prev.map(updater));
    if (viewS) setViewS(v => ({ ...v, status }));

    if (isMongoId(id) && user?.id) {
      try {
        await fetch(`/api/admission/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id':   String(user.id),
            'x-user-role': String(user.role || 'admin'),
          },
          body: JSON.stringify({ status }),
        });
        return;
      } catch {}
    }
    updateStudentStatus(id, status);
  }

  async function handleDelete(id) {
    setStudents(prev => prev.filter(s => String(s.id) !== String(id) && String(s._id) !== String(id)));
    setDelConfirm(null);
    setViewS(null);

    if (isMongoId(id) && user?.id) {
      try {
        await fetch(`/api/admission/${id}`, {
          method: 'DELETE',
          headers: {
            'x-user-id':   String(user.id),
            'x-user-role': String(user.role || 'admin'),
          },
        });
        return;
      } catch {}
    }
    deleteStudent(id);
  }

  if (!user) return null;

  const IS = {
    backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-medium)',
    color: 'var(--text-primary)', borderRadius: 20,
    padding: '9px 14px 9px 36px', fontSize: 13, outline: 'none', width: '100%',
  };

  return (
    <DashLayout activeTab={tab === 'overview' ? null : tab}>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div className="space-y-6 max-w-5xl w-full">
          <div>
            <h1 className="font-display font-bold text-xl md:text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>
              Admin Overview
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Monitor and manage all institute admissions.
            </p>
          </div>

          {/* Stats grid — 5 cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            {[
              { icon: Users,         label: 'Total',        value: stats.total,       color: '#D4A017' },
              { icon: Clock,         label: 'Pending',      value: stats.pending,     color: '#FB923C' },
              { icon: AlertCircle,   label: 'Under Review', value: stats.underReview, color: '#60A5FA' },
              { icon: CheckCircle,   label: 'Approved',     value: stats.approved,    color: '#4ADE80' },
              { icon: XCircle,       label: 'Rejected',     value: stats.rejected,    color: '#F87171' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label}
                className="rounded-2xl p-4 md:p-5 border"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                    <Icon size={15} style={{ color }} />
                  </div>
                  <span className="font-display font-black text-xl md:text-2xl" style={{ color }}>{value}</span>
                </div>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{label}</p>
                {stats.total > 0 && (
                  <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-subtle)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(value / stats.total) * 100}%`, backgroundColor: color }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Recent */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <h2 className="font-display font-bold text-sm md:text-base" style={{ color: 'var(--text-primary)' }}>
                Recent Applications
              </h2>
              <Link href="/dashboard/admin?tab=admissions"
                className="text-xs text-[#D4A017] hover:text-[#F5C842] flex items-center gap-1 transition-colors">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {loading ? (
              <div className="text-center py-10">
                <span className="w-8 h-8 border-2 border-[#D4A017]/30 border-t-[#D4A017] rounded-full animate-spin inline-block" />
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12 px-4">
                <GraduationCap size={36} className="mx-auto mb-3 text-[#D4A017]/30" />
                <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>No applications yet.</p>
                <Link href="/admission-form" className="text-xs text-[#D4A017] hover:text-[#F5C842] transition-colors">
                  Open admission form →
                </Link>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                {[...students]
                  .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                  .slice(0, 6)
                  .map(s => {
                    const sc = SS[s.status] || SS.Pending;
                    return (
                      <div key={s.id}
                        className="flex items-center gap-3 px-4 md:px-5 py-3 cursor-pointer transition-colors"
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => setViewS(s)}>
                        <div className="w-8 h-8 rounded-lg overflow-hidden border flex-shrink-0" style={{ borderColor: 'var(--border-medium)' }}>
                          <StudentAvatar image={s.image} name={s.fullName} size="sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{s.fullName}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                            {s.trackingId ? <span className="font-mono text-[#D4A017]">{s.trackingId}</span> : s.course}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0"
                          style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}>
                          {s.status}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STUDENTS / ADMISSIONS TABLE ── */}
      {(tab === 'students' || tab === 'admissions') && (
        <div className="space-y-4 w-full">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="font-display font-bold text-xl md:text-2xl" style={{ color: 'var(--text-primary)' }}>
              {tab === 'students' ? 'Student Records' : 'Admissions List'}
            </h1>
            <div className="flex gap-2">
              <button onClick={() => exportCSV(filtered)}
                className="flex items-center gap-1.5 text-xs border px-3 md:px-4 py-2 rounded-full transition-all"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-gold)'; e.currentTarget.style.color = '#D4A017'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                <Download size={12} />Export
              </button>
              <button onClick={load}
                className="flex items-center gap-1.5 text-xs border px-3 md:px-4 py-2 rounded-full"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-muted)' }}>
                <RefreshCw size={12} />Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 md:gap-3 items-center">
            <div className="relative w-full sm:flex-1 sm:min-w-[180px] sm:max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4A017] pointer-events-none" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search name, email, tracking ID…"
                style={IS}
                onFocus={e => e.currentTarget.style.borderColor = '#D4A017'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border-medium)'} />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {['All', 'Pending', 'Under Review', 'Approved', 'Rejected'].map(s => (
                <button key={s} onClick={() => setStatusF(s)}
                  className="px-2.5 md:px-3 py-1.5 md:py-2 rounded-full text-xs font-semibold border transition-all"
                  style={statusF === s
                    ? { background: 'linear-gradient(135deg,#D4A017,#F5C842)', color: '#000', borderColor: 'transparent' }
                    : { backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', borderColor: 'var(--border-medium)' }}>
                  {s}
                </button>
              ))}
            </div>
            <div className="relative">
              <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="text-xs pr-6 pl-2.5 py-2 rounded-full border focus:outline-none appearance-none cursor-pointer"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
            <span className="text-xs ml-auto flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
              {filtered.length} record{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Desktop table / Mobile cards */}
          {loading ? (
            <div className="text-center py-16">
              <span className="w-8 h-8 border-2 border-[#D4A017]/30 border-t-[#D4A017] rounded-full animate-spin inline-block" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border text-center py-16 px-4"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
              <GraduationCap size={36} className="mx-auto mb-3 text-[#D4A017]/25" />
              <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {students.length === 0 ? 'No applications yet' : 'No results found'}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {students.length === 0
                  ? <Link href="/admission-form" className="text-[#D4A017] hover:text-[#F5C842]">Open admission form →</Link>
                  : 'Adjust your search or filters.'}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile card view (< md) */}
              <div className="md:hidden space-y-3">
                {filtered.map(s => {
                  const sc = SS[s.status] || SS.Pending;
                  return (
                    <div key={s.id} className="rounded-2xl border overflow-hidden"
                      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                      <div className="flex items-center justify-between px-4 py-3 border-b"
                        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-input)' }}>
                        <span className="text-xs font-mono truncate" style={{ color: '#D4A017' }}>
                          {s.trackingId || `GCI-${s.id?.slice(-8)}`}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0"
                          style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}>{s.status}</span>
                      </div>
                      <div className="p-4 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border flex-shrink-0" style={{ borderColor: 'var(--border-gold)' }}>
                          <StudentAvatar image={s.image} name={s.fullName} size="sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{s.fullName}</p>
                          <p className="text-xs truncate text-[#D4A017]">{s.course}</p>
                          <p className="text-xs mt-1 truncate" style={{ color: 'var(--text-muted)' }}>{s.email}</p>
                        </div>
                      </div>
                      <div className="px-4 pb-4 flex items-center gap-2">
                        <select value={s.status || 'Pending'} onChange={e => handleStatus(s.id, e.target.value)}
                          className="text-[11px] font-bold px-2 py-1.5 rounded-full border cursor-pointer focus:outline-none flex-shrink-0"
                          style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}>
                          {ALL_STATUSES.map(v => <option key={v}>{v}</option>)}
                        </select>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <button onClick={() => setViewS(s)} title="View"
                            className="w-8 h-8 rounded-lg flex items-center justify-center border"
                            style={{ borderColor: 'var(--border-medium)', color: 'var(--text-muted)' }}>
                            <Eye size={13} />
                          </button>
                          <Link href={`/admin/student/${s.id}/print`} target="_blank" title="Print"
                            className="w-8 h-8 rounded-lg flex items-center justify-center border"
                            style={{ borderColor: 'var(--border-medium)', color: 'var(--text-muted)' }}>
                            <Printer size={13} />
                          </Link>
                          <button onClick={() => setDelConfirm(s.id)} title="Delete"
                            className="w-8 h-8 rounded-lg flex items-center justify-center border"
                            style={{ borderColor: 'var(--border-medium)', color: 'var(--text-muted)' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop table view (≥ md) */}
              <div className="hidden md:block rounded-2xl border overflow-hidden"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[900px]">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-input)' }}>
                        {['Photo', 'Name', 'Tracking ID', 'Course', 'Contact', 'Date', 'Status', 'Actions'].map(h => (
                          <th key={h} className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap"
                            style={{ color: 'var(--text-muted)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(s => {
                        const sc = SS[s.status] || SS.Pending;
                        return (
                          <tr key={s.id} className="transition-colors"
                            style={{ borderBottom: '1px solid var(--border-subtle)' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <td className="px-4 py-3">
                              <div className="w-9 h-9 rounded-xl overflow-hidden border cursor-pointer flex-shrink-0"
                                style={{ borderColor: 'var(--border-medium)' }} onClick={() => setViewS(s)}>
                                <StudentAvatar image={s.image} name={s.fullName} size="sm" />
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-semibold text-sm whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>{s.fullName}</p>
                              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.gender}{s.dob ? ` · ${s.dob}` : ''}</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs font-mono px-2 py-1 rounded-lg"
                                style={{ background: 'rgba(212,160,23,0.08)', color: '#D4A017', border: '1px solid rgba(212,160,23,0.15)' }}>
                                {s.trackingId || '—'}
                              </span>
                            </td>
                            <td className="px-4 py-3 max-w-[130px]">
                              <span className="text-xs px-2 py-1 rounded-lg block truncate"
                                style={{ background: 'rgba(212,160,23,0.10)', color: '#D4A017', border: '1px solid rgba(212,160,23,0.20)' }}
                                title={s.course}>{s.course || '—'}</span>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-xs truncate max-w-[130px]" style={{ color: 'var(--text-secondary)' }}>{s.email}</p>
                              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.phone}</p>
                            </td>
                            <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                              {new Date(s.submittedAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: '2-digit' })}
                            </td>
                            <td className="px-4 py-3">
                              <select value={s.status || 'Pending'} onChange={e => handleStatus(s.id, e.target.value)}
                                className="text-[11px] font-bold px-2.5 py-1.5 rounded-full border cursor-pointer focus:outline-none"
                                style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}>
                                {ALL_STATUSES.map(v => <option key={v}>{v}</option>)}
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                {[
                                  { icon: Eye,    fn: () => setViewS(s),         title: 'View',   red: false },
                                  { icon: Trash2, fn: () => setDelConfirm(s.id), title: 'Delete', red: true  },
                                ].map(({ icon: Icon, fn, title, red }) => (
                                  <button key={title} onClick={fn} title={title}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all hover:scale-110"
                                    style={{ borderColor: 'var(--border-medium)', color: 'var(--text-muted)' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = red ? '#ef4444' : 'rgba(212,160,23,0.5)'; e.currentTarget.style.color = red ? '#ef4444' : '#D4A017'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                                    <Icon size={13} />
                                  </button>
                                ))}
                                <Link href={`/admin/student/${s.id}/print`} target="_blank" title="Print"
                                  className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all hover:scale-110"
                                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-muted)' }}
                                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.5)'; e.currentTarget.style.color = '#D4A017'; }}
                                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                                  <Printer size={13} />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── DETAIL MODAL ── */}
      {viewS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-3 md:px-4 py-4 md:py-8"
          onClick={e => e.target === e.currentTarget && setViewS(null)}>
          <div className="rounded-3xl border w-full max-w-2xl max-h-[92vh] overflow-y-auto"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-gold)', boxShadow: 'var(--shadow-card-lg)' }}>
            <div className="flex items-center justify-between p-4 md:p-5 border-b sticky top-0 z-10"
              style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-card)' }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl overflow-hidden border flex-shrink-0" style={{ borderColor: 'var(--border-gold)' }}>
                  <StudentAvatar image={viewS.image} name={viewS.fullName} size="sm" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-sm md:text-base truncate" style={{ color: 'var(--text-primary)' }}>{viewS.fullName}</h3>
                  <p className="text-xs font-mono" style={{ color: '#D4A017' }}>{viewS.trackingId || `GCI-${viewS.id?.slice(-8)}`}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/admin/student/${viewS.id}/print`} target="_blank"
                  className="hidden sm:flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded-full transition-colors"
                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#D4A017'; e.currentTarget.style.borderColor = 'var(--border-gold)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}>
                  <Printer size={12} />Print
                </Link>
                <button onClick={() => setViewS(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center border"
                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-muted)' }}>
                  <X size={15} />
                </button>
              </div>
            </div>

            <div className="p-4 md:p-5 space-y-4">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-16 md:w-24 h-20 md:h-28 rounded-2xl overflow-hidden border flex-shrink-0" style={{ borderColor: 'var(--border-gold)' }}>
                  <StudentAvatar image={viewS.image} name={viewS.fullName} size="lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display font-bold text-lg md:text-xl truncate" style={{ color: 'var(--text-primary)' }}>{viewS.fullName}</h2>
                  <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>S/O {viewS.fatherName || '—'}</p>
                  <div className="flex gap-2 flex-wrap">
                    {(() => { const sc = SS[viewS.status] || SS.Pending; return (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full border"
                        style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}>{viewS.status}</span>
                    ); })()}
                    <span className="text-xs px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(212,160,23,0.10)', color: '#D4A017', border: '1px solid rgba(212,160,23,0.20)' }}>
                      {viewS.course}
                    </span>
                  </div>
                  {viewS.trackingId && (
                    <p className="text-xs mt-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                      Tracking: <span style={{ color: '#D4A017' }}>{viewS.trackingId}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Mail,       label: 'Email',         value: viewS.email },
                  { icon: Phone,      label: 'Phone',         value: viewS.phone },
                  { icon: CreditCard, label: 'CNIC',          value: viewS.cnic },
                  { icon: Calendar,   label: 'Date of Birth', value: viewS.dob },
                  { icon: Users,      label: 'Gender',        value: viewS.gender },
                  { icon: BookOpen,   label: 'Qualification', value: viewS.qualification },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-subtle)' }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon size={11} className="text-[#D4A017]" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</span>
                    </div>
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{value || '—'}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin size={11} className="text-[#D4A017]" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Address</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{viewS.address || '—'}</p>
              </div>

              {/* Extended GCI Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Profession',        value: viewS.profession    },
                  { label: 'Guardian Mob',       value: viewS.guardianPhone },
                  { label: 'WhatsApp #',         value: viewS.whatsapp      },
                  { label: 'Timing',             value: viewS.timing        },
                  { label: 'Date of Admission',  value: viewS.dateOfAdmission },
                  { label: 'Reg No',             value: viewS.regNo || viewS.cnic },
                ].filter(f => f.value).map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-subtle)' }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
                  </div>
                ))}
              </div>

              {viewS.howKnew && (
                <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-subtle)' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>How They Found Us</p>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{viewS.howKnew}</p>
                </div>
              )}

              {viewS.selectedCourses && (
                <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-subtle)' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Selected Courses</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(typeof viewS.selectedCourses === 'string'
                      ? viewS.selectedCourses.split(',')
                      : viewS.selectedCourses
                    ).map(c => c.trim()).filter(Boolean).map(course => (
                      <span key={course} className="text-[11px] px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(212,160,23,0.10)', color: '#D4A017', border: '1px solid rgba(212,160,23,0.20)' }}>
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(viewS.monthlyFee || viewS.admissionFee || viewS.totalFee) && (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Monthly Fee',   value: viewS.monthlyFee   },
                    { label: 'Admission Fee', value: viewS.admissionFee },
                    { label: 'Total Fee',     value: viewS.totalFee     },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-gold)' }}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
                      <p className="text-sm font-bold" style={{ color: '#F5C842' }}>{value || '—'}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Status buttons — all 4 statuses */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-xs font-semibold flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>Update Status:</span>
                {ALL_STATUSES.map(s => {
                  const sc = SS[s];
                  return (
                    <button key={s} onClick={() => handleStatus(viewS.id, s)}
                      className="text-xs font-bold px-3 py-1.5 rounded-full border transition-all"
                      style={viewS.status === s
                        ? { background: sc.bg, color: sc.text, borderColor: sc.border }
                        : { backgroundColor: 'var(--bg-input)', color: 'var(--text-muted)', borderColor: 'var(--border-subtle)' }}>
                      {s}
                    </button>
                  );
                })}
                <button onClick={() => { setViewS(null); setDelConfirm(viewS.id); }}
                  className="ml-auto text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5">
                  <Trash2 size={13} />Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {delConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="rounded-2xl p-6 max-w-sm w-full text-center border"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-gold)' }}>
            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.12)', border: '2px solid rgba(239,68,68,0.3)' }}>
              <Trash2 size={22} className="text-red-400" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Delete Application?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDelConfirm(null)}
                className="px-6 py-2.5 rounded-full text-sm border font-semibold"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}>Cancel</button>
              <button onClick={() => handleDelete(delConfirm)}
                className="px-6 py-2.5 rounded-full text-sm bg-red-500 hover:bg-red-400 text-white font-bold transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashLayout>
  );
}
