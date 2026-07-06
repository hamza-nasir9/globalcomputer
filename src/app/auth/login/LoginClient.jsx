'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, AlertCircle, LogIn, GraduationCap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const IS = {
  width:'100%', padding:'12px 14px 12px 42px',
  borderRadius:'12px', fontSize:'14px', outline:'none',
  transition:'border-color 0.2s',
  backgroundColor:'var(--bg-input)', border:'1px solid var(--border-medium)',
  color:'var(--text-primary)',
};

export default function LoginClient() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { login, user, loading: authLoading } = useAuth();
  const redirect     = searchParams.get('redirect') || null;

  const [form, setForm]     = useState({ email:'', password:'' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Already logged in → redirect
  useEffect(() => {
    if (!authLoading && user) {
      if (redirect) { router.replace(redirect); return; }
      router.replace(user.role === 'admin' ? '/dashboard/admin' : '/');
    }
  }, [user, authLoading, redirect, router]);

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
    if (errors.general) setErrors(p => ({ ...p, general: '' }));
  }

  function validate() {
    const e = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const u = await login({ email: form.email, password: form.password });
      if (redirect) { router.replace(redirect); return; }
      router.replace(u.role === 'admin' ? '/dashboard/admin' : '/');
    } catch (err) {
      // Surface setup instructions for the most common deployment mistake
      if (err.message?.includes('MONGODB_URI') || err.message?.includes('not configured')) {
        setErrors({ general: '⚙️ Database not configured. Create .env.local with MONGODB_URI. See SETUP.md.' });
      } else {
        setErrors({ general: err.message });
      }
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ backgroundColor:'var(--bg-primary)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse at center,rgba(212,160,23,0.06) 0%,transparent 60%)' }} />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-gold-gradient flex items-center justify-center font-display font-black text-black text-xl" style={{ boxShadow:'var(--shadow-gold-sm)' }}>G</div>
            <div className="text-left">
              <div className="font-display font-bold text-xl" style={{ color:'var(--text-primary)' }}>GCI<span className="text-[#F5C842]"> Institute</span></div>
              <div className="text-[10px] tracking-widest uppercase" style={{ color:'var(--text-muted)' }}>Global Computer Institute</div>
            </div>
          </Link>
          <h1 className="font-display font-bold text-2xl mb-1" style={{ color:'var(--text-primary)' }}>Welcome Back</h1>
          <p className="text-sm" style={{ color:'var(--text-secondary)' }}>
            {redirect ? 'Please sign in to continue.' : 'Sign in to your GCI account.'}
          </p>
        </div>

        <div className="rounded-3xl border p-8" style={{ backgroundColor:'var(--bg-card)', borderColor:'var(--border-gold)', boxShadow:'var(--shadow-card)' }}>
          {errors.general && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-5 text-xs" style={{ backgroundColor:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171' }}>
              <AlertCircle size={14} />{errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--text-secondary)' }}>Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4A017] pointer-events-none" />
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com"
                  style={{ ...IS, ...(errors.email ? { borderColor:'#ef4444' } : {}) }}
                  onFocus={e => e.currentTarget.style.borderColor='#D4A017'}
                  onBlur={e => e.currentTarget.style.borderColor=errors.email?'#ef4444':'var(--border-medium)'} />
              </div>
              {errors.email && <p className="flex items-center gap-1 text-xs mt-1 text-red-400"><AlertCircle size={11}/>{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold" style={{ color:'var(--text-secondary)' }}>Password</label>
                <a href="#" onClick={e=>e.preventDefault()} className="text-xs text-[#D4A017] hover:text-[#F5C842] transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4A017] pointer-events-none" />
                <input type={showPw?'text':'password'} name="password" value={form.password} onChange={handleChange} placeholder="Enter your password"
                  style={{ ...IS, paddingRight:'40px', ...(errors.password?{borderColor:'#ef4444'}:{}) }}
                  onFocus={e=>e.currentTarget.style.borderColor='#D4A017'}
                  onBlur={e=>e.currentTarget.style.borderColor=errors.password?'#ef4444':'var(--border-medium)'} />
                <button type="button" onClick={()=>setShowPw(p=>!p)} className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-[#F5C842] transition-colors" style={{ color:'var(--text-muted)' }}>
                  {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
                </button>
              </div>
              {errors.password && <p className="flex items-center gap-1 text-xs mt-1 text-red-400"><AlertCircle size={11}/>{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-black font-bold py-3.5 rounded-xl text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{ boxShadow:'var(--shadow-gold)' }}>
              {loading ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><LogIn size={16}/>Sign In</>}
            </button>
          </form>

          <div className="mt-6 pt-5 text-center border-t" style={{ borderColor:'var(--border-subtle)' }}>
            <p className="text-sm" style={{ color:'var(--text-secondary)' }}>
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-[#D4A017] hover:text-[#F5C842] font-semibold transition-colors">Register here</Link>
            </p>
          </div>

          {/* Admin hint + Setup instructions */}
          <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor:'var(--bg-input)', border:'1px solid var(--border-subtle)' }}>
            <p className="text-[11px] text-center mb-1.5 font-semibold" style={{ color:'var(--text-muted)' }}>Admin credentials</p>
            <div className="space-y-1">
              <p className="text-[11px] text-center" style={{ color:'var(--text-muted)' }}>
                Email: <span className="text-[#D4A017] font-mono">admin@gmail.com</span>
              </p>
              <p className="text-[11px] text-center" style={{ color:'var(--text-muted)' }}>
                Password: <span className="text-[#D4A017] font-mono">Admin@123</span>
              </p>
            </div>
            <div className="mt-2 pt-2 border-t" style={{ borderColor:'var(--border-subtle)' }}>
              <p className="text-[10px] text-center" style={{ color:'var(--text-muted)' }}>
                Getting errors? Check{' '}
                <a href="/api/test-db" target="_blank" className="text-[#D4A017] hover:underline">
                  /api/test-db
                </a>{' '}and read{' '}
                <span className="text-[#D4A017]">SETUP.md</span>
              </p>
            </div>
          </div>
        </div>
        <p className="text-center text-xs mt-5">
          <Link href="/" className="hover:text-[#D4A017] transition-colors" style={{ color:'var(--text-muted)' }}>← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
