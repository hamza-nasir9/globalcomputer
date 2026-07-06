'use client';
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

/* Generic SectionHeader used across inner pages — matches KCA sec-label/sec-title classes */
export default function SectionHeader({ label, title, highlight, subtitle, center = false, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { y: 22 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={`${center ? 'text-center' : ''} ${className} gsap-hidden`}>
      {label && (
        <span className="sec-label" style={{ justifyContent: center ? 'center' : 'flex-start', display: 'flex' }}>
          {label}
        </span>
      )}
      <h2 className="sec-title" style={{ textAlign: center ? 'center' : 'left' }}>
        {title}{' '}
        {highlight && <span style={{ color: '#f7941d' }}>{highlight}</span>}
      </h2>
      <div className={`sec-line ${center ? 'center' : ''}`} />
      {subtitle && (
        <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-b)', maxWidth: 560, margin: center ? '0 auto' : '0' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
