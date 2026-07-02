'use client';
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { useCounter } from '@/hooks/useCounter';
import { getIcon } from '@/lib/icons';
import { STATS } from '@/lib/data';

/* Stats — always 1 horizontal line, responsive via font-size not wrapping */
function StatItem({ value, suffix, label, iconName, isLast }) {
  const Icon = getIcon(iconName);
  const { count, ref } = useCounter(value, 1800);
  return (
    <div ref={ref} style={{ textAlign:'center', padding:'36px 12px', position:'relative', flex:1, minWidth:0 }}>
      {/* Divider */}
      {!isLast && (
        <div style={{ position:'absolute', right:0, top:'28%', bottom:'28%', width:1, background:'rgba(255,255,255,0.10)' }} />
      )}
      {/* Icon */}
      <div style={{ width:44, height:44, borderRadius:12, background:'rgba(247,148,29,0.18)', border:'1.5px solid rgba(247,148,29,0.30)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
        <Icon size={19} color="var(--acc)" />
      </div>
      {/* Number */}
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(20px,2.2vw,32px)', fontWeight:700, color:'#fff', lineHeight:1, marginBottom:5 }}>
        {count.toLocaleString()}{suffix}
      </div>
      {/* Label */}
      <div style={{ fontSize:'clamp(9px,1vw,11px)', fontWeight:700, color:'rgba(255,255,255,0.52)', textTransform:'uppercase', letterSpacing:'0.08em', whiteSpace:'nowrap' }}>
        {label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current.querySelectorAll('[data-s]'), { y:20, opacity:0 },
        { opacity:1, y:0, stagger:0.08, duration:0.5, ease:'power3.out',
          scrollTrigger:{ trigger:ref.current, start:'top 85%', once:true } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="kca-stats-section" style={{ position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, rgba(247,148,29,0.07) 0%, transparent 60%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,rgba(247,148,29,0.55),transparent)' }} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,rgba(247,148,29,0.55),transparent)' }} />

      {/* Single horizontal row — flex, no wrap, no grid-cols breakpoints */}
      <div ref={ref} style={{ maxWidth:1200, margin:'0 auto', padding:'0 16px' }}>
        <div style={{ display:'flex', alignItems:'stretch' }}>
          {STATS.map((s, i) => (
            <div key={i} data-s style={{ flex:1, minWidth:0 }}>
              <StatItem {...s} isLast={i === STATS.length - 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
