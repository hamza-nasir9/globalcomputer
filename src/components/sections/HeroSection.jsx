'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronRight, Phone, Sparkles } from 'lucide-react';
import { gsap } from '@/lib/gsap';

export default function HeroSection() {
  const leftRef  = useRef(null);
  const rightRef = useRef(null);
  const blob1    = useRef(null);
  const blob2    = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = leftRef.current?.querySelectorAll('[data-el]');
      if (els) gsap.fromTo(els, { y:28, opacity:0 }, { opacity:1, y:0, stagger:0.1, duration:0.6, ease:'power3.out', delay:0.1 });
      if (rightRef.current) gsap.fromTo(rightRef.current, { x:50, opacity:0 }, { opacity:1, x:0, duration:0.75, ease:'power3.out', delay:0.3 });
      if (blob1.current) gsap.to(blob1.current, { y:-22, x:12, duration:7, ease:'sine.inOut', yoyo:true, repeat:-1 });
      if (blob2.current) gsap.to(blob2.current, { y:18, x:-8, duration:9, ease:'sine.inOut', yoyo:true, repeat:-1 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="kca-hero">
      {/* Ambient blobs — subtle, not orange everywhere */}
      <div ref={blob1} style={{ position:'absolute', top:'-8%', right:'0%', width:480, height:480, borderRadius:'50%', background:'radial-gradient(circle, rgba(247,148,29,0.10) 0%, transparent 65%)', filter:'blur(6px)', pointerEvents:'none', zIndex:0 }} />
      <div ref={blob2} style={{ position:'absolute', bottom:'-14%', left:'-5%', width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle, rgba(15,45,37,0.08) 0%, transparent 65%)', filter:'blur(6px)', pointerEvents:'none', zIndex:0 }} />
      {/* Dot grid accent */}
      <div style={{ position:'absolute', top:'22%', left:'4%', width:100, height:100, opacity:0.22, pointerEvents:'none', zIndex:0, backgroundImage:'radial-gradient(circle, var(--acc) 1.5px, transparent 1.5px)', backgroundSize:'14px 14px' }} />

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'52px 24px', width:'100%', position:'relative', zIndex:2 }}>
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">

          {/* LEFT */}
          <div ref={leftRef} className="w-full lg:w-[52%]">
            {/* Badge */}
            <div data-el className="gsap-hidden" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(247,148,29,0.10)', border:'1.5px solid rgba(247,148,29,0.28)', borderRadius:100, padding:'6px 16px', marginBottom:20 }}>
              <Sparkles size={12} color="var(--acc)" />
              <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--acc-dark)' }}>
                Admissions Open — 2025 Batch
              </span>
            </div>

            {/* Heading */}
            <h1 data-el className="gsap-hidden" style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(32px,4.8vw,58px)', fontWeight:800, lineHeight:1.1, color:'var(--text-h)', marginBottom:18 }}>
              Learn Skills From Our<br />
              <span style={{ color:'var(--acc)' }}>Top Instructors</span>
            </h1>

            <p data-el className="gsap-hidden" style={{ fontSize:15, lineHeight:1.8, color:'var(--text-b)', maxWidth:470, marginBottom:28 }}>
              Global Computer Institute is one of the most trusted computer institutes in Karachi, offering career-focused IT education across 3 campuses. Empowering students with in-demand digital skills since 2005.
            </p>

            <div data-el className="flex flex-col sm:flex-row gap-3 gsap-hidden" style={{ marginBottom:24 }}>
              <a href="/courses" className="btn-orange px-8 py-3 rounded-lg text-sm">
                Explore Courses <ChevronRight size={15}/>
              </a>
              <a href="/about" className="btn-border px-8 py-3 rounded-lg text-sm">
                About Us
              </a>
            </div>

            {/* Phone */}
            <div data-el className="flex items-center gap-3 gsap-hidden">
              <div style={{ width:42, height:42, borderRadius:'50%', background:'linear-gradient(135deg,var(--acc-dark),var(--acc))', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'var(--acc-shadow)' }}>
                <Phone size={15} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize:11, color:'var(--text-m)', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase' }}>Have any Question?</p>
                <a href="tel:+923333580212" style={{ fontSize:15.5, fontWeight:800, color:'var(--text-h)', textDecoration:'none' }}>0333-3580212</a>
              </div>
            </div>
          </div>

          {/* RIGHT — image stack */}
          <div ref={rightRef} className="w-full lg:w-[48%] relative flex justify-center gsap-hidden">
            <div className="relative w-full max-w-[450px]">
              {/* Offset shadow card */}
              <div style={{ position:'absolute', top:20, right:-20, bottom:-20, left:20, borderRadius:20, background:'linear-gradient(135deg, rgba(247,148,29,0.12), rgba(15,45,37,0.08))', zIndex:0 }} />

              {/* Main image */}
              <div style={{ position:'relative', borderRadius:18, overflow:'hidden', boxShadow:'var(--shadow-l)', aspectRatio:'4/3.2', zIndex:1 }}>
                <Image src="/images/campus/class-05.jpg" alt="GCI Students" fill quality={88} className="object-cover object-center" sizes="(max-width:768px) 100vw, 50vw" priority />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(13,27,42,0.28) 0%, transparent 50%)' }} />
              </div>

              {/* Badge bottom-left */}
              <div style={{ position:'absolute', bottom:-18, left:-14, zIndex:10, borderRadius:14, padding:'12px 18px', minWidth:122, background:'var(--bg-2)', border:'1px solid var(--border-c)', boxShadow:'var(--shadow-m)' }}>
                <div style={{ fontSize:10, color:'var(--text-m)', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:2 }}>Established</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:800, color:'var(--acc)', lineHeight:1 }}>2005</div>
              </div>

              {/* Badge top-right */}
              <div style={{ position:'absolute', top:-14, right:-12, zIndex:10, borderRadius:14, padding:'12px 16px', minWidth:102, background:'linear-gradient(135deg,var(--acc-dark),var(--acc))', boxShadow:'var(--acc-shadow)' }}>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.75)', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:2 }}>Programs</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:800, color:'#fff', lineHeight:1 }}>20+</div>
              </div>

              {/* Dot accent */}
              <div style={{ position:'absolute', bottom:-32, right:16, width:70, height:70, pointerEvents:'none', opacity:0.35, backgroundImage:'radial-gradient(circle, var(--acc) 1.5px, transparent 1.5px)', backgroundSize:'10px 10px' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
