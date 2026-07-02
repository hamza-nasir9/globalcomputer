'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';
import { Search, CheckCircle, Clock, XCircle, AlertCircle, FileText, Lock } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const STATUS_CONFIG = {
  'Pending': {
    icon: Clock,
    color: '#F5A623',
    bg: 'rgba(245,166,35,0.12)',
    border: 'rgba(245,166,35,0.35)',
    label: 'Pending',
    description: 'Your application has been received and is awaiting review.',
  },
  'Under Review': {
    icon: AlertCircle,
    color: '#4A90D9',
    bg: 'rgba(74,144,217,0.12)',
    border: 'rgba(74,144,217,0.35)',
    label: 'Under Review',
    description: 'Your application is currently being reviewed by our team.',
  },
  'Approved': {
    icon: CheckCircle,
    color: '#4CAF50',
    bg: 'rgba(76,175,80,0.12)',
    border: 'rgba(76,175,80,0.35)',
    label: 'Approved',
    description: 'Congratulations! Your application has been approved.',
  },
  'Rejected': {
    icon: XCircle,
    color: '#F44336',
    bg: 'rgba(244,67,54,0.12)',
    border: 'rgba(244,67,54,0.35)',
    label: 'Rejected',
    description: 'Your application was not approved at this time. Please contact us for more information.',
  },
};

export default function TrackingPageClient() {
  const { user, loading: authLoading } = useAuth();
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult]         = useState(null);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  /* Auth loading spinner */
  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <span className="w-8 h-8 border-2 border-[#D4A017]/30 border-t-[#D4A017] rounded-full animate-spin" />
    </div>
  );

  /* Guest gate — must be logged in to access tracking */
  if (!user) return (
    <>
      <TopBar />
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 pt-[80px] md:pt-[123px] pb-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'rgba(212,160,23,0.12)', border: '2px solid rgba(212,160,23,0.30)' }}>
            <Lock size={36} className="text-[#D4A017]" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Login Required</h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            You need to be logged in to check your application status. Please sign in with the account you created after submitting your application.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/auth/login?redirect=/track"
              className="inline-flex items-center gap-2 bg-gold-gradient text-black font-bold px-7 py-3 rounded-full text-sm"
              style={{ boxShadow: 'var(--shadow-gold-sm)' }}>
              Sign In
            </Link>
            <Link href="/auth/register"
              className="inline-flex items-center gap-2 border font-semibold px-7 py-3 rounded-full text-sm"
              style={{ borderColor: 'var(--border-gold)', color: 'var(--text-primary)' }}>
              Create Account
            </Link>
          </div>
          <p className="text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
            Haven&apos;t applied yet?{' '}
            <Link href="/admission-form" className="text-[#D4A017] hover:underline font-semibold">Apply Now</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );

  async function handleSearch(e) {
    e.preventDefault();
    const id = trackingId.trim().toUpperCase();
    if (!id) {
      setError('Please enter a Tracking ID.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res  = await fetch(`/api/track?id=${encodeURIComponent(id)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'No application found. Please check your Tracking ID.');
        return;
      }

      setResult(data);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const statusCfg = result ? (STATUS_CONFIG[result.status] || STATUS_CONFIG['Pending']) : null;

  return (
    <>
      <TopBar />
      <Navbar />
      <main className="min-h-screen pt-[80px] md:pt-[123px] pb-16 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-2xl mx-auto">

          {/* Page Header */}
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase mb-3"
              style={{ color: '#D4A017' }}>Application Tracking</span>
            <h1 className="font-display text-3xl md:text-4xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
              Track Your <span className="text-[#F5C842]">Application</span>
            </h1>
            <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Enter your Tracking ID to check the current status of your admission application.
            </p>
          </div>

          {/* Search Card */}
          <div className="rounded-3xl border p-6 md:p-8 mb-6"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
            <form onSubmit={handleSearch}>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Tracking ID
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={trackingId}
                  onChange={e => setTrackingId(e.target.value.toUpperCase())}
                  placeholder="e.g. GCI-2026-ABC123"
                  className="flex-1 px-4 py-3 rounded-xl border text-sm font-mono transition-colors outline-none"
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#D4A017')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border-medium)')}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-gold-gradient text-black font-bold px-5 py-3 rounded-xl text-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
                  style={{ boxShadow: 'var(--shadow-gold-sm)' }}>
                  {loading
                    ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    : <Search size={16} />
                  }
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </form>

            {/* Error */}
            {error && (
              <div className="mt-4 flex items-start gap-3 px-4 py-3 rounded-xl border"
                style={{ backgroundColor: 'rgba(244,67,54,0.08)', borderColor: 'rgba(244,67,54,0.25)' }}>
                <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Result Card */}
          {result && statusCfg && (() => {
            const Icon = statusCfg.icon;
            return (
              <div className="rounded-3xl border overflow-hidden"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
                {/* Status Banner */}
                <div className="px-6 py-4 flex items-center gap-3 border-b"
                  style={{ backgroundColor: statusCfg.bg, borderColor: statusCfg.border }}>
                  <Icon size={20} style={{ color: statusCfg.color }} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: statusCfg.color }}>
                      Application Status
                    </p>
                    <p className="font-display font-black text-lg" style={{ color: statusCfg.color }}>
                      {statusCfg.label}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="px-6 py-6 space-y-4">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{statusCfg.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Detail label="Student Name"    value={result.fullName} />
                    <Detail label="Course"          value={result.course} />
                    <Detail label="Tracking ID"     value={result.trackingId} mono />
                    <Detail label="Date Submitted"  value={result.dateSubmitted
                      ? new Date(result.dateSubmitted).toLocaleDateString('en-PK', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })
                      : '—'} />
                  </div>
                </div>

                {/* Footer note */}
                <div className="px-6 pb-6">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    For enquiries, please contact us with your Tracking ID. Status is updated in real-time by our admissions team.
                  </p>
                  <div className="flex gap-3 mt-4 flex-wrap">
                    <Link href="/contact"
                      className="inline-flex items-center gap-2 border font-semibold px-5 py-2.5 rounded-full text-sm"
                      style={{ borderColor: 'var(--border-gold)', color: 'var(--text-primary)' }}>
                      Contact Us
                    </Link>
                    <Link href="/admissions"
                      className="inline-flex items-center gap-2 bg-gold-gradient text-black font-bold px-5 py-2.5 rounded-full text-sm"
                      style={{ boxShadow: 'var(--shadow-gold-sm)' }}>
                      Admissions Info
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Help text when no search done yet */}
          {!result && !error && (
            <div className="text-center mt-8">
              <FileText size={40} className="mx-auto mb-3 opacity-20" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Your Tracking ID was shown after you submitted your admission form.
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Haven&apos;t applied yet?{' '}
                <Link href="/admission-form" className="text-[#D4A017] hover:underline font-semibold">
                  Apply now
                </Link>
              </p>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

function Detail({ label, value, mono }) {
  return (
    <div className="rounded-xl px-4 py-3 border" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-subtle)' }}>
      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className={`text-sm font-semibold ${mono ? 'font-mono' : ''}`} style={{ color: 'var(--text-primary)' }}>
        {value || '—'}
      </p>
    </div>
  );
}
