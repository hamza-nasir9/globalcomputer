'use client';
import { useRef, useEffect } from 'react';
import { GraduationCap, Phone } from 'lucide-react';
import { gsap } from '@/lib/gsap';

/* KCA CTA: "Grow Your Skills To Advance Your Career Path" 
   Dark green bg, centered text, 2 CTA buttons */
export default function CtaSection() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current.querySelectorAll('[data-el]'), { y: 24, opacity: 0 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} style={{ background:'linear-gradient(135deg, #00242B 0%, #003d30 50%, #00242B 100%)', padding:'80px 24px', position:'relative', overflow:'hidden' }}>
      {/* Decorative circles (KCA bg shapes) */}
      <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(247,148,29,0.15),transparent 65%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-60, left:-60, width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle,rgba(247,148,29,0.10),transparent 65%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,transparent,#f7941d,transparent)' }} />

      <div style={{ maxWidth:800, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>
        <span data-el className="gsap-hidden" style={{ fontSize:11, fontWeight:800, letterSpacing:'0.18em', textTransform:'uppercase', color:'#f7941d', display:'block', marginBottom:12 }}>
          Our Achievement
        </span>
        <h2 data-el className="gsap-hidden" style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(28px,4.5vw,50px)', fontWeight:800, color:'#fff', lineHeight:1.18, marginBottom:16 }}>
          Grow Your Skills To<br /><span style={{ color:'#f7941d' }}>Advance Your Career Path</span>
        </h2>
        <p data-el className="gsap-hidden" style={{ fontSize:14, lineHeight:1.80, color:'rgba(255,255,255,0.60)', marginBottom:36, maxWidth:540, margin:'0 auto 36px' }}>
          Join our growing community of graduates who built real careers in technology. Admissions for the next batch are open now.
        </p>
        <div data-el className="flex flex-col sm:flex-row gap-3 justify-center gsap-hidden">
          <a href="/admission-form" className="btn-orange px-10 py-3.5 rounded-lg text-sm">
            <GraduationCap size={17} />Apply Now
          </a>
          <a href="tel:+923333580212" className="btn-white px-10 py-3.5 rounded-lg text-sm">
            <Phone size={16} />0333-3580212
          </a>
        </div>
      </div>
    </section>
  );
}
