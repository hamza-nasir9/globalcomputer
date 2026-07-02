'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ZoomIn, X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { GALLERY_ITEMS } from '@/lib/data';

const HOME_ITEMS = GALLERY_ITEMS.slice(0, 7);

/* Grid layout map — first card spans 2 rows, creates visual hierarchy */
const SPAN_MAP = { 0: 'md:row-span-2', 3: 'md:row-span-2' };

export default function GallerySection() {
  const [lightbox, setLightbox] = useState(null);

  const open  = (idx) => setLightbox(idx);
  const close = () => setLightbox(null);
  const goPrev = useCallback(() => setLightbox(i => (i - 1 + HOME_ITEMS.length) % HOME_ITEMS.length), []);
  const goNext = useCallback(() => setLightbox(i => (i + 1) % HOME_ITEMS.length), []);

  useEffect(() => {
    if (lightbox === null) return;
    const fn = (e) => {
      if (e.key === 'ArrowLeft')  goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape')     close();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [lightbox, goPrev, goNext]);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 md:px-16" style={{ backgroundColor: 'var(--bg-section)' }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader label="Campus Life" title="Life at" highlight="GCI"
          subtitle="A glimpse into our labs, classrooms, and the community that makes GCI a great place to learn."
          center />

        {/* Masonry-feel grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[160px] md:auto-rows-[180px]">
          {HOME_ITEMS.map((item, i) => (
            <div key={item.id ?? i}
              onClick={() => open(i)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 hover:-translate-y-1 ${SPAN_MAP[i] || ''}`}
              style={{ borderColor: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,160,23,0.35)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>

              {/* Image */}
              <Image
                src={item.image}
                alt={item.label}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                sizes="(max-width:640px) 50vw,(max-width:768px) 50vw,25vw"
              />

              {/* Gradient base overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 scale-75 group-hover:scale-100"
                  style={{ background: 'linear-gradient(135deg, #D4A017, #F5C842)' }}>
                  <ZoomIn size={17} className="text-black" />
                </div>
              </div>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-8 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-[10px] md:text-xs font-medium truncate">{item.label}</p>
              </div>

              {/* Gold top accent on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(90deg, transparent, #D4A017, transparent)' }} />
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="mt-8 md:mt-10 text-center">
          <Link href="/gallery"
            className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl border transition-all duration-300 hover:-translate-y-0.5"
            style={{ borderColor: 'rgba(212,160,23,0.35)', color: '#F5C842', background: 'rgba(212,160,23,0.06)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,160,23,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,160,23,0.06)'}>
            View Full Gallery <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(4,8,20,0.97)', backdropFilter: 'blur(16px)' }}
          onClick={close}>

          {/* Close */}
          <button onClick={close}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', color: 'white' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(212,160,23,0.50)'; e.currentTarget.style.color='#F5C842'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.14)'; e.currentTarget.style.color='white'; }}>
            <X size={18} />
          </button>

          {/* Prev */}
          <button onClick={e => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 z-10 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(212,160,23,0.50)'; e.currentTarget.style.color='#F5C842'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'; e.currentTarget.style.color='white'; }}>
            <ChevronLeft size={22} />
          </button>

          {/* Next */}
          <button onClick={e => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 z-10 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(212,160,23,0.50)'; e.currentTarget.style.color='#F5C842'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'; e.currentTarget.style.color='white'; }}>
            <ChevronRight size={22} />
          </button>

          {/* Image */}
          <div className="relative w-[90vw] max-w-4xl h-[75vh]" onClick={e => e.stopPropagation()}>
            <Image
              src={HOME_ITEMS[lightbox].image}
              alt={HOME_ITEMS[lightbox].label}
              fill
              className="object-contain"
              sizes="90vw"
              quality={100}
            />
          </div>

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 py-4 px-6 flex items-center justify-between"
            style={{ background: 'linear-gradient(to top, rgba(4,8,20,0.90), transparent)' }}>
            <p className="text-white/80 text-sm">{HOME_ITEMS[lightbox].label}</p>
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(212,160,23,0.12)', color: '#D4A017', border: '1px solid rgba(212,160,23,0.25)' }}>
              {lightbox + 1} / {HOME_ITEMS.length}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
