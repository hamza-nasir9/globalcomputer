'use client';
import { PARTNERS } from '@/lib/data';
/* KCA: horizontal scrolling brand logos strip — simple, clean */
const ALL = [...PARTNERS, ...PARTNERS];
export default function PartnersSection() {
  return (
    <section style={{ background:'var(--bg-3)', borderTop:'1px solid var(--border-c)', borderBottom:'1px solid var(--border-c)', padding:'18px 0' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>
        <div style={{ overflow:'hidden', position:'relative' }}>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:60, zIndex:2, background:'linear-gradient(90deg,var(--bg-soft),transparent)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', right:0, top:0, bottom:0, width:60, zIndex:2, background:'linear-gradient(-90deg,var(--bg-soft),transparent)', pointerEvents:'none' }} />
          <div style={{ display:'flex', gap:10, width:'max-content', animation:'scroll-x 22s linear infinite' }}>
            {ALL.map((p, i) => (
              <div key={i} style={{
                flexShrink:0, height:38, padding:'0 20px',
                borderRadius:8, border:'1px solid var(--border-c)',
                background:'var(--bg-2)', fontSize:12, fontWeight:700,
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'var(--text-b)', minWidth:110, whiteSpace:'nowrap',
                cursor:'default', transition:'all 0.2s',
              }}
              onMouseEnter={e=>{e.currentTarget.style.color='#f7941d';e.currentTarget.style.borderColor='rgba(247,148,29,0.35)';}}
              onMouseLeave={e=>{e.currentTarget.style.color='var(--text-b)';e.currentTarget.style.borderColor='var(--border-c)';}}>
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
