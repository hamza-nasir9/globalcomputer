'use client';
import { useRef, useEffect } from 'react';
import { Quote, Star } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { TESTIMONIALS } from '@/lib/data';
import DragSlider from '@/components/ui/DragSlider';

const visibleFn = (w) => {
  if (w < 640)  return 1.08;
  if (w < 1024) return 1.98;
  return 2.98;
};

export default function TestimonialsSection() {
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
    <section ref={sectionRef} className="gsap-hidden" style={{ background: 'var(--bg)', padding: '64px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="sec-label" style={{ justifyContent: 'center', display: 'flex' }}>
            Student Stories
          </span>
          <h2 className="sec-title" style={{ textAlign: 'center' }}>
            What Our Students{' '}
            <span style={{ color: '#f7941d' }}>Say About Us</span>
          </h2>
          <div className="sec-line center" />
        </div>

        <DragSlider
          items={TESTIMONIALS}
          visibleCount={visibleFn}
          gap={22}
          autoPlay={5500}
          renderItem={(t) => (
            <div style={{
              background: 'var(--bg-2)', borderRadius: 14, padding: '28px 24px',
              border: '1px solid var(--border-c)', boxShadow: 'var(--shadow)',
              position: 'relative', height: '100%', display: 'flex', flexDirection: 'column',
              transition: 'box-shadow 0.28s, border-color 0.28s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              e.currentTarget.style.borderColor = 'rgba(247,148,29,0.30)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = 'var(--shadow)';
              e.currentTarget.style.borderColor = 'var(--border-c)';
            }}>

              {/* Orange top border */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderRadius: '14px 14px 0 0', background: 'linear-gradient(90deg,#e07a00,#f7941d,#ffb454)' }} />

              {/* Quote icon — KCA orange box */}
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f7941d', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, flexShrink: 0 }}>
                <Quote size={19} color="#fff" fill="#fff" />
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={13} fill="#f7941d" color="#f7941d" />
                ))}
              </div>

              {/* Review text */}
              <p style={{ fontSize: 13.5, lineHeight: 1.82, color: 'var(--text-b)', fontStyle: 'italic', flex: 1, marginBottom: 20 }}>
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid var(--border-c)' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,#e07a00,#f7941d)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 15, color: '#fff',
                }}>
                  {t.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-h)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.name}
                  </p>
                  <p style={{ fontSize: 11.5, color: '#f7941d', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.role}
                  </p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: 'rgba(247,148,29,0.10)', color: '#f7941d', border: '1px solid rgba(247,148,29,0.22)', flexShrink: 0 }}>
                  {t.batch}
                </span>
              </div>
            </div>
          )}
        />
      </div>
    </section>
  );
}
