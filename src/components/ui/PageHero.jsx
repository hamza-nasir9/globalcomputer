'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { ChevronRight } from 'lucide-react';

/* KCA inner page hero: image bg, dark overlay, breadcrumb, title + orange underline */
export default function PageHero({ title, highlight, subtitle, image, badge, breadcrumb }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll('[data-h]');
    gsap.fromTo(els, { y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.55, ease: 'power3.out', delay: 0.1 });
  }, []);

  return (
    <section style={{ position:'relative', height:'clamp(280px,35vh,400px)', display:'flex', alignItems:'center', overflow:'hidden' }}>
      <Image src={image} alt={title} fill priority quality={85} className="object-cover object-center" sizes="100vw" />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(8,28,46,0.88) 0%, rgba(8,28,46,0.70) 60%, rgba(8,28,46,0.45) 100%)' }} />

      <div ref={ref} style={{ position:'relative', zIndex:10, maxWidth:1200, margin:'0 auto', padding:'0 24px', width:'100%' }}>
        {/* Breadcrumb — KCA shows "Home / Page Name" */}
        <div data-h className="flex items-center gap-2 mb-4 gsap-hidden" style={{ fontSize:12, color:'rgba(255,255,255,0.55)' }}>
          <Link href="/" style={{ color:'rgba(255,255,255,0.55)', textDecoration:'none', transition:'color 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.color='#f7941d'}
            onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.55)'}>
            Home
          </Link>
          <ChevronRight size={12} />
          <span style={{ color:'#f7941d', fontWeight:600 }}>{badge || title}</span>
        </div>

        <h1 data-h className="gsap-hidden" style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(28px,4.5vw,52px)', fontWeight:800, color:'#fff', lineHeight:1.15, marginBottom:8 }}>
          {title}
          {highlight && <span style={{ color:'#f7941d', display:'block' }}>{highlight}</span>}
        </h1>
        {subtitle && (
          <p data-h className="gsap-hidden" style={{ fontSize:14, color:'rgba(255,255,255,0.60)', maxWidth:560, lineHeight:1.70, marginTop:8 }}>{subtitle}</p>
        )}
        {/* Orange underline — KCA signature */}
        <div data-h className="gsap-hidden" style={{ marginTop:16, width:48, height:3, background:'linear-gradient(90deg,#e07a00,#f7941d)', borderRadius:3 }} />
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:50, background:'linear-gradient(to top, var(--bg), transparent)' }} />
    </section>
  );
}
