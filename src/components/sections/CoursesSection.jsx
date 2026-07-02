'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { COURSE_DETAILS } from '@/lib/data';
import { getIcon } from '@/lib/icons';
import { gsap } from '@/lib/gsap';

const FEATURED_SLUGS = [
  'cit-certificate-information-technology',
  'diploma-full-stack-developer',
  'diploma-graphic-designing',
  'advance-excel-power-bi',
  'diploma-digital-media-marketing-freelancing',
  'artificial-intelligence',
  'english-language-course',
  'diploma-computerized-accounting',
];

const GAP = 20;

function getVis() {
  if (typeof window === 'undefined') return 3.15;
  if (window.innerWidth < 580)  return 1.08;
  if (window.innerWidth < 900)  return 2.1;
  if (window.innerWidth < 1260) return 3.1;
  return 3.15;
}

export default function CoursesSection() {
  const router = useRouter();
  const courses = FEATURED_SLUGS
    .map(s => COURSE_DETAILS.find(c => c.slug === s))
    .filter(Boolean);

  const [cur, setCur]   = useState(0);
  const [vis, setVis]   = useState(3.15);
  const trackRef        = useRef(null);
  const wrapRef         = useRef(null);
  const sectionRef      = useRef(null);

  useEffect(() => {
    const fn = () => setVis(getVis());
    fn(); window.addEventListener('resize', fn, { passive:true });
    return () => window.removeEventListener('resize', fn);
  }, []);

  const moveTo = useCallback((idx, instant=false) => {
    if (!trackRef.current || !wrapRef.current) return;
    const cw = (wrapRef.current.offsetWidth - GAP*(Math.ceil(vis)-1)) / vis;
    gsap.to(trackRef.current, { x: -(idx*(cw+GAP)), duration: instant?0:0.52, ease:'power3.out' });
  }, [vis]);

  useEffect(() => { moveTo(cur, true); }, [vis]);

  const max = Math.max(0, courses.length - Math.floor(vis));

  const go = useCallback((n) => {
    const idx = Math.max(0, Math.min(n, max));
    setCur(idx); moveTo(idx);
  }, [max, moveTo]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current, { opacity:0, y:24 },
        { opacity:1, y:0, duration:0.6, ease:'power3.out',
          scrollTrigger:{ trigger:sectionRef.current, start:'top 85%', once:true } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="gsap-hidden" style={{ background:'var(--bg)', padding:'64px 0' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4" style={{ marginBottom:28 }}>
          <div>
            <span className="sec-label">Computer Courses</span>
            <h2 className="sec-title" style={{ marginBottom:0 }}>
              Our Featured <span style={{ color:'var(--acc)' }}>Courses</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 pb-1">
            {[[-1,'prev'],[1,'next']].map(([dir,label]) => {
              const ok = dir < 0 ? cur > 0 : cur < max;
              return (
                <button key={label} onClick={() => go(cur+dir)} disabled={!ok}
                  aria-label={label}
                  style={{
                    width:38, height:38, borderRadius:9, border:'1.5px solid',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    cursor: ok ? 'pointer' : 'default', transition:'all 0.2s',
                    background: ok ? 'rgba(247,148,29,0.09)' : 'transparent',
                    borderColor: ok ? 'rgba(247,148,29,0.38)' : 'var(--border-c)',
                    color: ok ? 'var(--acc)' : 'var(--text-m)',
                    opacity: ok ? 1 : 0.4,
                  }}>
                  {dir < 0 ? <ChevronLeft size={16}/> : <ChevronRight size={16}/>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Slider — NO nested <a> tags. Card is a <div>, buttons are real <button>/<a> */}
        <div ref={wrapRef} style={{ overflow:'hidden' }}>
          <div ref={trackRef} style={{ display:'flex', gap:GAP, willChange:'transform' }}>
            {courses.map(course => {
              const Icon = getIcon(course.iconName);
              return (
                /* div card — not <Link> so inner buttons are not nested <a> */
                <div key={course.slug}
                  className="kca-course-card"
                  style={{
                    flexShrink:0,
                    width:`calc((100% - ${GAP*(Math.ceil(vis)-1)}px) / ${vis})`,
                    cursor:'pointer',
                  }}
                  onClick={() => router.push(`/courses/${course.slug}`)}>

                  {/* Thumbnail image */}
                  <div className="card-img" style={{ height:172 }}>
                    <img src={course.cardImage || course.heroImage || `/images/courses/course-cit.jpg`}
                      alt={course.name} loading="lazy" />
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(13,27,42,0.50) 0%, transparent 55%)' }} />
                    <div style={{ position:'absolute', top:10, left:10, background:'var(--acc)', color:'#fff', fontSize:9.5, fontWeight:800, padding:'3px 9px', borderRadius:4, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                      {course.category}
                    </div>
                    <div style={{ position:'absolute', bottom:10, left:10, width:36, height:36, borderRadius:9, background:'rgba(255,255,255,0.90)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 10px rgba(0,0,0,0.18)' }}>
                      <Icon size={17} color="var(--acc-dark)" />
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="card-title">{course.name}</div>
                    <p style={{ fontSize:12.5, lineHeight:1.65, color:'var(--text-b)', marginBottom:0 }} className="line-clamp-2">
                      {course.description}
                    </p>
                    <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11.5, color:'var(--text-m)', marginTop:10, fontWeight:600 }}>
                      <Clock size={11} color="var(--acc)" />{course.duration}
                    </div>
                    {/* Buttons — plain <a> and <button>, NOT nested Link inside Link */}
                    <div className="card-actions" onClick={e => e.stopPropagation()}>
                      <a href={`/courses/${course.slug}`} className="card-btn-info">More Info</a>
                      <a href="/admission-form" className="card-btn-enroll">Enroll Now</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots + View All */}
        <div className="flex items-center justify-between" style={{ marginTop:24 }}>
          <div className="flex gap-1.5 items-center">
            {Array.from({ length: max+1 }).map((_,i) => (
              <button key={i} onClick={() => go(i)}
                style={{ height:3, borderRadius:4, border:'none', cursor:'pointer', transition:'all 0.35s', width:i===cur?26:10, background:i===cur?'var(--acc)':'var(--border-c)', padding:0 }} />
            ))}
          </div>
          <a href="/courses" className="btn-border px-7 py-2.5 rounded-lg text-sm">
            View All <ArrowRight size={13}/>
          </a>
        </div>
      </div>
    </section>
  );
}
