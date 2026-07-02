'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { getIcon } from '@/lib/icons';
import { gsap } from '@/lib/gsap';

const BADGE_STYLES = {
  gold:   'bg-[#D4A017]/15 text-[#F5C842] border-[#D4A017]/25',
  blue:   'bg-blue-500/15 text-blue-400 border-blue-500/25',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  green:  'bg-green-500/15 text-green-400 border-green-500/25',
  red:    'bg-red-500/15 text-red-400 border-red-500/25',
  orange: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
  teal:   'bg-teal-500/15 text-teal-400 border-teal-500/25',
  pink:   'bg-pink-500/15 text-pink-400 border-pink-500/25',
};

export default function CourseCard({ course, index = 0 }) {
  const cardRef = useRef(null);
  const Icon = getIcon(course.iconName);

  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current, { y: 40 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: index * 0.07,
          scrollTrigger: { trigger: cardRef.current, start: 'top 88%', once: true } });
    });
    return () => ctx.revert();
  }, [index]);

  /* Show first 3 features as preview on the card */
  const previewFeatures = (course.features || []).slice(0, 3);

  return (
    <div ref={cardRef} className="gsap-hidden h-full">
      <Link
        href={`/courses/${course.slug}`}
        className="group flex flex-col h-full rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-gold)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        {/* ── Thumbnail ── */}
        <div className="relative h-44 overflow-hidden flex-shrink-0">
          <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-[1.05]">
            <Image
              src={course.cardImage}
              alt={course.name}
              fill quality={75}
              className="object-cover object-center"
              sizes="(max-width:640px) 100vw,(max-width:1200px) 50vw,25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>

          {/* Arrow overlay on hover */}
          <div className="absolute inset-0 bg-[#D4A017]/0 group-hover:bg-[#D4A017]/8 transition-colors duration-300 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100"
              style={{ boxShadow: 'var(--shadow-gold-sm)' }}>
              <ArrowRight size={16} className="text-black" />
            </div>
          </div>

          {/* Badge */}
          <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${BADGE_STYLES[course.badgeColor] || BADGE_STYLES.gold}`}>
            {course.badge}
          </span>

          {/* Price tag bottom-right of image */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-black"
            style={{ background: 'linear-gradient(135deg,#D4A017,#F5C842)', color: '#000', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            {course.fee}
          </div>
        </div>

        {/* ── Card body ── */}
        <div className="flex flex-col flex-1 p-5">
          {/* Category + icon row */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(212,160,23,0.12)', border: '1px solid rgba(212,160,23,0.20)' }}>
              <Icon size={15} className="text-[#D4A017]" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: '#D4A017' }}>
              {course.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-base leading-tight mb-2 group-hover:text-[#F5C842] transition-colors duration-300"
            style={{ color: 'var(--text-primary)' }}>
            {course.name}
          </h3>

          {/* Short description */}
          <p className="text-xs leading-relaxed mb-4 line-clamp-2 flex-shrink-0"
            style={{ color: 'var(--text-secondary)' }}>
            {course.description}
          </p>

          {/* Feature preview bullets */}
          {previewFeatures.length > 0 && (
            <div className="space-y-1.5 mb-4">
              {previewFeatures.map(f => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle size={11} className="text-[#D4A017] flex-shrink-0" />
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{f}</span>
                </div>
              ))}
            </div>
          )}

          {/* Footer row */}
          <div className="flex items-center justify-between pt-3 mt-auto border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{course.duration}</span>
            <span className="flex items-center gap-1 text-xs font-semibold text-[#D4A017] group-hover:text-[#F5C842] transition-colors">
              View Details <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
