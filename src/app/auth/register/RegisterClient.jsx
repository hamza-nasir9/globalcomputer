'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, Phone, AlertCircle, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const IS = {
  width:'100%', padding:'12px 14px 12px 42px', borderRadius:'12px',
  fontSize:'14px', outline:'none', transition:'border-color 0.2s',
  backgroundColor:'var(--bg-input)', border:'1px solid var(--border-medium)',
  color:'var(--text-primary)',
};

export default function RegisterClient() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const fromAdmission = searchParams.get('from') === 'admission';
  const trackingId    = searchParams.get('tid') || '';

  const { register, user, loading: authLoading } = useAuth();
  const [form, setForm]      = useState({ name:'', email:'', phone:'', password:'', confirm:'' });
  const [showPw, setShowPw]  = useState(false);
  const [errors, setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user && !fromAdmission) router.replace('/');
  }, [user, authLoading, router, fromAdmission]);

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]:'' }));
    if (errors.general) setErrors(p => ({ ...p, general:'' }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone || !/^[0-9+\-\s]{10,15}$/.test(form.phone)) e.phone = 'Valid phone required';
    if (!form.password || form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      router.replace(fromAdmission ? '/track' : '/');
    } catch (err) {
      setErrors({ general: err.message });
    } finally { setLoading(false); }
  }

  const fieldErr = (n) => errors[n] ? { borderColor:'#ef4444' } : {};

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ backgroundColor:'var(--bg-primary)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse at center,rgba(212,160,23,0.06) 0%,transparent 60%)' }} />
      <div className="relative w-full max-w-md">

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-gold-gradient flex items-center justify-center font-display font-black text-black text-xl" style={{ boxShadow:'var(--shadow-gold-sm)' }}>G</div>
            <div className="text-left">
              <div className="font-display font-bold text-xl" style={{ color:'var(--text-primary)' }}>GCI<span className="text-[#F5C842]"> Institute</span></div>
              <div className="text-[10px] tracking-widest uppercase" style={{ color:'var(--text-muted)' }}>Global Computer Institute</div>
            </div>
          </Link>
          <h1 className="font-display font-bold text-2xl mb-1" style={{ color:'var(--text-primary)' }}>Create Account</h1>
          <p className="text-sm" style={{ color:'var(--text-secondary)' }}>
            {fromAdmission ? 'Create your account to track your application status' : 'Join GCI — start your tech journey today'}
          </p>
        </div>

        {fromAdmission && trackingId && (
          <div className="mb-5 px-4 py-3 rounded-2xl border flex items-start gap-3"
            style={{ backgroundColor:'rgba(212,160,23,0.08)', borderColor:'rgba(212,160,23,0.30)' }}>
            <div className="w-5 h-5 rounded-full bg-gold-gradient flex-shrink-0 flex items-center justify-center text-black text-xs font-black mt-0.5">✓</div>
            <div>
              <p className="text-xs font-semibold" style={{ color:'var(--text-primary)' }}>Application submitted!</p>
              <p className="text-xs mt-0.5" style={{ color:'var(--text-secondary)' }}>
                Your Tracking ID: <span className="font-mono font-bold text-[#D4A017]">{trackingId}</span>
              </p>
              <p className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>Register below, then use this ID on the Tracking page.</p>
            </div>
          </div>
        )}

        <div className="rounded-3xl border p-8" style={{ backgroundColor:'var(--bg-card)', borderColor:'var(--border-gold)', boxShadow:'var(--shadow-card)' }}>
          {errors.general && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-5 text-xs" style={{ backgroundColor:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171' }}>
              <AlertCircle size={14}/>{errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {[
              { label:'Full Name',    name:'name',  type:'text',  icon:User,  placeholder:'Your full name' },
              { label:'Email',        name:'email', type:'email', icon:Mail,  placeholder:'your@email.com' },
              { label:'Phone Number', name:'phone', type:'tel',   icon:Phone, placeholder:'+92-XXX-XXXXXXX' },
            ].map(({ label, name, type, icon:Icon, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--text-secondary)' }}>{label}</label>
                <div className="relative">
                  <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4A017] pointer-events-none" />
                  <input type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
                    style={{ ...IS, ...fieldErr(name) }}
                    onFocus={e=>e.currentTarget.style.borderColor='#D4A017'}
                    onBlur={e=>e.currentTarget.style.borderColor=errors[name]?'#ef4444':'var(--border-medium)'} />
                </div>
                {errors[name] && <p className="flex items-center gap-1 text-xs mt-1 text-red-400"><AlertCircle size={11}/>{errors[name]}</p>}
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4A017] pointer-events-none" />
                <input type={showPw?'text':'password'} name="password" value={form.password} onChange={handleChange} placeholder="Minimum 6 characters"
                  style={{ ...IS, paddingRight:'40px', ...fieldErr('password') }}
                  onFocus={e=>e.currentTarget.style.borderColor='#D4A017'}
                  onBlur={e=>e.currentTarget.style.borderColor=errors.password?'#ef4444':'var(--border-medium)'} />
                <button type="button" onClick={()=>setShowPw(p=>!p)} className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-[#F5C842] transition-colors" style={{ color:'var(--text-muted)' }}>
                  {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
                </button>
              </div>
              {errors.password && <p className="flex items-center gap-1 text-xs mt-1 text-red-400"><AlertCircle size={11}/>{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--text-secondary)' }}>Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4A017] pointer-events-none" />
                <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="Re-enter password"
                  style={{ ...IS, ...fieldErr('confirm') }}
                  onFocus={e=>e.currentTarget.style.borderColor='#D4A017'}
                  onBlur={e=>e.currentTarget.style.borderColor=errors.confirm?'#ef4444':'var(--border-medium)'} />
              </div>
              {errors.confirm && <p className="flex items-center gap-1 text-xs mt-1 text-red-400"><AlertCircle size={11}/>{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-black font-bold py-3.5 rounded-xl text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{ boxShadow:'var(--shadow-gold)' }}>
              {loading
                ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"/>
                : <><UserPlus size={16}/>{fromAdmission ? 'Create Account & Track' : 'Create Account'}</>}
            </button>
          </form>

          <div className="mt-6 pt-5 text-center border-t" style={{ borderColor:'var(--border-subtle)' }}>
            <p className="text-sm" style={{ color:'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link href={fromAdmission ? '/auth/login?redirect=/track' : '/auth/login'}
                className="text-[#D4A017] hover:text-[#F5C842] font-semibold transition-colors">Sign in</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs mt-5">
          <Link href="/" className="hover:text-[#D4A017] transition-colors" style={{ color:'var(--text-muted)' }}>← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
