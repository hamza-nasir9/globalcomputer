'use client';
import { useRef, useEffect } from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { FACULTY } from '@/lib/data';
import DragSlider from '@/components/ui/DragSlider';

const visibleFn = (w) => {
  if (w < 480)  return 1.2;
  if (w < 768)  return 2.15;
  if (w < 1024) return 3.15;
  if (w < 1280) return 4.15;
  return 5.15;
};

const SOCIALS = [Facebook, Instagram, Twitter, Linkedin];

export default function FacultySection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current, { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="gsap-hidden" style={{ background: 'var(--bg-3)', padding: '64px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="sec-label" style={{ justifyContent: 'center', display: 'flex' }}>
            Our Qualified People Matter
          </span>
          <h2 className="sec-title" style={{ textAlign: 'center' }}>
            Top Class{' '}
            <span style={{ color: '#f7941d' }}>Mentors</span>
          </h2>
          <div className="sec-line center" />
        </div>

        <DragSlider
          items={FACULTY}
          visibleCount={visibleFn}
          gap={18}
          autoPlay={4800}
          renderItem={(f) => (
            <div className="kca-faculty-card" style={{ height: '100%', cursor: 'grab' }}>
              {/* Orange top line handled by CSS .kca-faculty-card::before */}
              <div className="f-photo">
                {f.image ? <img src={f.image} alt={f.name} /> : f.initials}
              </div>
              <div className="f-role">{f.role}</div>
              <div className="f-name">{f.name}</div>

              {/* Experience tag */}
              <div style={{ fontSize: 10.5, color: 'var(--text-sm)', marginBottom: 14, fontWeight: 600 }}>
                {f.exp}
              </div>

              <div className="f-socials">
                {SOCIALS.map((Icon, i) => (
                  <div key={i} className="f-social-btn">
                    <Icon size={12} />
                  </div>
                ))}
              </div>
            </div>
          )}
        />

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <a href="/about" className="btn-border px-8 py-3 rounded-lg text-sm">
            All Instructors
          </a>
        </div>
      </div>
    </section>
  );
}
