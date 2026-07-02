'use client';
import { useRef, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import { getIcon } from '@/lib/icons';
import { ADMISSION_STEPS } from '@/lib/data';
import { gsap } from '@/lib/gsap';

export default function AdmissionsSection() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current.querySelectorAll('[data-s]'), { y: 28, opacity: 0 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.55, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section style={{ background: 'var(--bg)', padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <span className="sec-label" style={{ justifyContent:'center', display:'flex' }}>Enrollment Process</span>
          <h2 className="sec-title" style={{ textAlign:'center' }}>How To <span style={{ color:'#f7941d' }}>Join GCI</span></h2>
          <div className="sec-line center" />
          <p style={{ fontSize:14, color:'var(--text-b)', maxWidth:520, margin:'0 auto', lineHeight:1.75 }}>
            Getting started is simple. Follow these steps to begin your learning journey at Global Computer Institute.
          </p>
        </div>

        <div ref={ref} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:20, marginBottom:40 }}>
          {ADMISSION_STEPS.map((s) => {
            const Icon = getIcon(s.iconName);
            return (
              <div key={s.step} data-s className="gsap-hidden" style={{
                background:'var(--bg-2)', borderRadius:12, padding:'28px 22px', textAlign:'center',
                border:'1px solid var(--border-c)', boxShadow:'var(--shadow)', transition:'all 0.28s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.borderColor='rgba(247,148,29,0.35)'; e.currentTarget.style.boxShadow='var(--shadow-lg)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='var(--border-c)'; e.currentTarget.style.boxShadow='var(--shadow)'; }}>
                {/* Orange circle with step number (KCA style) */}
                <div style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,#e07a00,#f7941d)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontFamily:"'Playfair Display',serif", fontWeight:800, fontSize:20, boxShadow:'0 4px 14px rgba(247,148,29,0.38)' }}>
                  {s.step}
                </div>
                <div style={{ width:36, height:36, borderRadius:10, background:'rgba(247,148,29,0.10)', border:'1px solid rgba(247,148,29,0.20)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                  <Icon size={16} color="#f7941d" />
                </div>
                <h4 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:15, color:'var(--text-h)', marginBottom:8, lineHeight:1.3 }}>{s.title}</h4>
                <p style={{ fontSize:12, lineHeight:1.70, color:'var(--text-b)' }}>{s.description}</p>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign:'center' }}>
          <a href="/admission-form" className="btn-orange px-10 py-3.5 rounded-lg text-sm">
            <GraduationCap size={16} />Start Application
          </a>
        </div>
      </div>
    </section>
  );
}
