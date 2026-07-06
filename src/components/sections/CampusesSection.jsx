'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { MapPin, Users, Phone, ArrowRight, Clock } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { CAMPUSES } from '@/lib/data';

export default function CampusesSection() {
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(Array.from(gridRef.current.children),
        { y: 40, opacity: 0 },
        { opacity: 1, y: 0, stagger: 0.14, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 85%', once: true } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="campuses" className="py-14 md:py-20 px-4 sm:px-6 md:px-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader label="Our Locations" title="Three Campuses," highlight="One Vision"
          subtitle="Strategically located across Karachi — same world-class faculty, same proven curriculum."
          center />

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {CAMPUSES.map((campus) => (
            <div key={campus.id}
              className="group rounded-2xl overflow-hidden border cursor-pointer transition-all duration-350 hover:-translate-y-2 flex flex-col"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(212,160,23,0.38)'; e.currentTarget.style.boxShadow='0 16px 48px rgba(0,0,0,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.boxShadow='none'; }}>

              {/* Campus image */}
              <div className="relative h-48 sm:h-52 overflow-hidden">
                <Image src={campus.image} alt={campus.name} fill quality={80}
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.05]"
                  sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw,33vw" />
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                {/* Gold top accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(90deg, transparent, #D4A017, #F5C842, transparent)' }} />

                {/* Established badge */}
                <div className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg"
                  style={{ background: 'rgba(212,160,23,0.18)', border: '1px solid rgba(212,160,23,0.35)', color: '#F5C842', backdropFilter: 'blur(8px)' }}>
                  {campus.established}
                </div>

                {/* Students count */}
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-lg text-white/85"
                  style={{ background: 'rgba(10,18,36,0.60)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
                  <Users size={11} />{campus.students}
                </div>

                {/* Campus name on image bottom */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="font-display font-bold text-lg text-white leading-tight group-hover:text-[#F5C842] transition-colors duration-300">
                    {campus.name}
                  </h3>
                </div>
              </div>

              {/* Card body */}
              <div className="p-5 flex flex-col flex-1">
                {/* Location */}
                <div className="flex items-start gap-2 mb-3">
                  <MapPin size={13} className="text-[#D4A017] flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{campus.area}</span>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-secondary)' }}>
                  {campus.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {campus.tags.map(tag => (
                    <span key={tag} className="text-[9px] sm:text-[10px] px-2.5 py-1 rounded-full font-medium border"
                      style={{ background: 'rgba(212,160,23,0.08)', color: '#D4A017', borderColor: 'rgba(212,160,23,0.18)' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Clock size={11} className="text-[#D4A017]" />Mon–Sat, 9AM–9PM
                  </div>
                  <Link href="/campuses"
                    className="flex items-center gap-1 text-xs font-semibold text-[#D4A017] hover:text-[#F5C842] hover:gap-1.5 transition-all duration-200">
                    Details <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/campuses"
            className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl border transition-all duration-300 hover:-translate-y-0.5"
            style={{ borderColor: 'rgba(212,160,23,0.35)', color: '#F5C842', background: 'rgba(212,160,23,0.06)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,160,23,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,160,23,0.06)'}>
            <MapPin size={14} />View All Campuses
          </Link>
        </div>
      </div>
    </section>
  );
}
