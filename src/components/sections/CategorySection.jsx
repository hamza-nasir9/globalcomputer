'use client';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { COURSE_DETAILS } from '@/lib/data';

/* Real course categories pulled from actual COURSE_DETAILS data — counts computed live */
const COURSE_CATS = ['Development', 'Creative Design', 'IT Fundamentals', 'Data Analytics', 'Office Skills', 'Marketing', 'Accounting', 'Language', 'AI & Future Skills', 'E-Commerce', 'Kids Programs'];

function getCounts() {
  const counts = {};
  COURSE_DETAILS.forEach(c => { counts[c.category] = (counts[c.category] || 0) + 1; });
  return counts;
}

export default function CategorySection() {
  const sectionRef = useRef(null);
  const counts = getCounts();
  const cats = COURSE_CATS.filter(c => counts[c]).map(c => ({ label: c, count: counts[c] }));

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current.querySelectorAll('[data-pill]'), { x: -16, opacity: 0 },
        { opacity: 1, x: 0, stagger: 0.05, duration: 0.4, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="kca-cat-section" style={{ padding: '64px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div className="flex flex-col lg:flex-row gap-10 items-center">

          <div style={{ flexShrink: 0, maxWidth: 360 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#f7941d', display: 'block', marginBottom: 8 }}>
              Find Your Path
            </span>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(24px,3.2vw,34px)', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 14 }}>
              Browse By<br /><span style={{ color: '#f7941d' }}>Categories</span>
            </h2>
            <div style={{ width: 48, height: 3, background: 'linear-gradient(90deg,#f7941d,#ffa940)', borderRadius: 3, marginBottom: 18 }} />
            <p style={{ fontSize: 13.5, lineHeight: 1.75, color: 'rgba(255,255,255,0.58)', marginBottom: 26 }}>
              From web development to accounting, explore our full range of SBTE-registered diploma and certificate programs.
            </p>
            <Link href="/courses" className="btn-white px-7 py-3 rounded-lg text-sm">
              All Categories <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {cats.map((cat, i) => (
              <Link key={i} href="/courses" data-pill className="kca-cat-pill gsap-hidden">
                <span>{cat.label}</span>
                <span>{cat.count} {cat.count === 1 ? 'Course' : 'Courses'}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
