'use client';
import Image from 'next/image';
import { useRef, useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { ABOUT_IMAGE } from '@/lib/data';

/* KCA About section:
   LEFT: stacked images (main + small overlay) + floating "+" badge  
   RIGHT: small label, big heading, body text, 4-column inline stats, CTA */
const INLINE_STATS = [
  { value: '45',    label: 'Expert Tutors' },
  { value: '20+',   label: 'Job-Oriented Courses' },
  { value: '1,500', label: 'Students Placed' },
  { value: '3',     label: 'Campus Locations' },
];

const CHECKS = [
  'SBTE Registered Programs',
  'Microsoft Authorized Partner',
  'Google Digital Garage Affiliate',
  'Skill Development Council Certified',
  'Adobe Education Partner',
  'AWS Educate Institution Member',
];

export default function AboutSection() {
  const imgRef  = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (imgRef.current)  gsap.fromTo(imgRef.current,  { x: -40, opacity: 0 }, { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out', scrollTrigger: { trigger: imgRef.current,  start: 'top 85%', once: true } });
      if (textRef.current) gsap.fromTo(textRef.current, { x:  40, opacity: 0 }, { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out', scrollTrigger: { trigger: textRef.current, start: 'top 85%', once: true } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section style={{ background: 'var(--bg)', padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">

          {/* LEFT: image block (KCA has stacked images + floating element) */}
          <div ref={imgRef} className="w-full lg:w-[45%] relative gsap-hidden">
            <div className="about-img-wrap">
              {/* Main large image */}
              <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', aspectRatio: '4/3.2', boxShadow: '0 20px 56px rgba(0,0,0,0.13)' }}>
                <Image src={ABOUT_IMAGE} alt="GCI Students in class" fill quality={85}
                  className="object-cover object-center" sizes="(max-width:1024px) 100vw, 45vw" />
              </div>

              {/* KCA: small secondary image overlay — bottom left */}
              <div style={{ position:'absolute', bottom: -18, left: -12, width:'42%', borderRadius:12, overflow:'hidden', border:'4px solid var(--bg)', boxShadow:'0 8px 28px rgba(0,0,0,0.15)', aspectRatio:'1/1' }}>
                <Image src="/images/campus/reception-01.jpg" alt="GCI Campus" fill quality={80} className="object-cover" sizes="25vw" />
              </div>

              {/* KCA: floating orange "Unleash Your Potential" badge */}
              <div className="floating-badge" style={{ position:'absolute', bottom:-18, right:-10, zIndex:10 }}>
                <div style={{ fontSize:11, fontWeight:700, opacity:0.85, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:2 }}>Est.</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, lineHeight:1 }}>2005</div>
                <div style={{ fontSize:10, fontWeight:600, opacity:0.80 }}>20 Years Strong</div>
              </div>
            </div>
          </div>

          {/* RIGHT: text content */}
          <div ref={textRef} className="w-full lg:w-[55%] gsap-hidden">
            <span className="sec-label">Get To Know About Us</span>
            <h2 className="sec-title">
              Transforming Futures<br />
              <span style={{ color: '#f7941d' }}>Defining Excellence</span><br />
              Welcome to the Best Computer Institute
            </h2>
            <div className="sec-line" />

            <p style={{ fontSize: 14, lineHeight: 1.80, color: 'var(--text-b)', marginBottom: 16 }}>
              Global Computer Institute is one of the most trusted computer institutes in Karachi, offering high-quality education in digital skills. Established in 2005, GCI has over 20 years of experience delivering IT education to students across the city.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.80, color: 'var(--text-b)', marginBottom: 24 }}>
              We offer the most in-demand courses in web development, graphic design, AI, digital marketing, cybersecurity and more — from three modern campuses across Karachi. Our certifications are recognized by SBTE, Microsoft, Google and other leading organizations.
            </p>

            {/* KCA: 4-column inline stats (key selling points) */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:12, marginBottom:24 }}>
              {INLINE_STATS.map((s, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderRadius:10, border:'1px solid var(--border-c)', background:'var(--bg-3)' }}>
                  <div style={{ width:44, height:44, borderRadius:10, background:'rgba(247,148,29,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:800, fontSize:16, color:'#f7941d' }}>{s.value}</span>
                  </div>
                  <span style={{ fontSize:13, fontWeight:600, color:'var(--text-b)', lineHeight:1.3 }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Checklist */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'6px 12px', marginBottom:28 }}>
              {CHECKS.map((c, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <CheckCircle size={14} color="#f7941d" style={{ flexShrink:0 }} />
                  <span style={{ fontSize:12, color:'var(--text-b)', fontWeight:500 }}>{c}</span>
                </div>
              ))}
            </div>

            <a href="/about" className="btn-orange px-8 py-3 rounded-lg text-sm">
              Discover More <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
