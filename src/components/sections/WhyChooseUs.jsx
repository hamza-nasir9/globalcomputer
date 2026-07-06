'use client';
import { useRef, useEffect } from 'react';
import { getIcon } from '@/lib/icons';
import { WHY_FEATURES } from '@/lib/data';
import { gsap } from '@/lib/gsap';
import DragSlider from '@/components/ui/DragSlider';

/* WHY_FEATURES.description sometimes has fake numbers — clean them inline */
function clean(text) {
  return text
    .replace('98%', 'High')
    .replace('200+ companies', 'leading companies')
    .replace('15,000+', '1,500+');
}

const visibleFn = (w) => {
  if (w < 640)  return 1.1;
  if (w < 900)  return 2.1;
  if (w < 1280) return 3.1;
  return 3.1;
};

export default function WhyChooseUs() {
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

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="sec-label" style={{ justifyContent: 'center', display: 'flex' }}>
            Why Choose GCI
          </span>
          <h2 className="sec-title" style={{ textAlign: 'center' }}>
            Why Students Choose{' '}
            <span style={{ color: '#f7941d' }}>Global Computer Institute</span>
          </h2>
          <div className="sec-line center" />
          <p style={{ fontSize: 13.5, color: 'var(--text-b)', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
            Thousands of students have built successful tech careers through our programs. Here is why they chose GCI.
          </p>
        </div>

        <DragSlider
          items={WHY_FEATURES}
          visibleCount={visibleFn}
          gap={20}
          renderItem={(f) => {
            const Icon = getIcon(f.iconName);
            return (
              <div style={{
                background: 'var(--bg-2)', borderRadius: 14,
                padding: '28px 22px', border: '1px solid var(--border-c)',
                boxShadow: 'var(--shadow)', height: '100%',
                transition: 'transform 0.28s, box-shadow 0.28s, border-color 0.28s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.borderColor = 'rgba(247,148,29,0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--shadow)';
                e.currentTarget.style.borderColor = 'var(--border-c)';
              }}>
                {/* Orange top accent line */}
                <div style={{ height: 3, width: 36, background: 'linear-gradient(90deg,#e07a00,#f7941d)', borderRadius: 3, marginBottom: 20 }} />
                <div style={{
                  width: 54, height: 54, borderRadius: 14,
                  background: 'rgba(247,148,29,0.12)', border: '2px solid rgba(247,148,29,0.22)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
                }}>
                  <Icon size={24} color="#f7941d" />
                </div>
                <h4 style={{
                  fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 16,
                  color: 'var(--text-h)', marginBottom: 10, lineHeight: 1.3,
                }}>
                  {f.title.replace('98% Job Placement','High Placement Rate')}
                </h4>
                <p style={{ fontSize: 13, lineHeight: 1.75, color: 'var(--text-b)' }}>
                  {clean(f.description)}
                </p>
              </div>
            );
          }}
        />
      </div>
    </section>
  );
}
