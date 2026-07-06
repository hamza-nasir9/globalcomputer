'use client';
/**
 * /gallery  —  Full gallery page
 *
 * Layout:  3-col desktop  |  2-col tablet  |  1-col mobile
 * Features:
 *   - Filter by category tabs
 *   - Click → fullscreen Lightbox
 *   - Lightbox: prev/next/close, keyboard (←→ Esc), click-outside, counter
 *   - Next.js <Image> for every photo
 *   - No design changes — matches the existing GCI premium gold/black theme
 */
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';
import Lightbox from '@/components/ui/Lightbox';
import { ALL_GALLERY_IMAGES } from '@/lib/data';
import { Images, ChevronRight } from 'lucide-react';

/* ── Build category list from data ──────────────────────────────── */
const ALL_CATS = ['All', ...Array.from(new Set(ALL_GALLERY_IMAGES.map(i => i.category)))];

export default function GalleryClient() {
  const [activeCat, setActiveCat] = useState('All');
  const [lightbox,  setLightbox]  = useState(null); // { images, startIndex }

  /* Filtered image list */
  const filtered = useMemo(() =>
    activeCat === 'All'
      ? ALL_GALLERY_IMAGES
      : ALL_GALLERY_IMAGES.filter(i => i.category === activeCat),
    [activeCat]
  );

  function openLightbox(index) {
    setLightbox({ images: filtered, startIndex: index });
  }

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="pt-[80px] md:pt-[123px] pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>

        {/* ── Page hero ──────────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-card) 100%)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {/* Gold glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(212,160,23,0.07), transparent)' }}
          />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-16 relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
              <Link href="/" className="hover:text-[#D4A017] transition-colors">Home</Link>
              <ChevronRight size={12} />
              <span style={{ color: '#D4A017' }}>Gallery</span>
            </nav>

            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex-shrink-0 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#D4A017,#F5C842)', boxShadow: '0 4px 20px rgba(212,160,23,0.3)' }}
              >
                <Images size={22} className="text-black" />
              </div>
              <div>
                <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: '#D4A017' }}>
                  Our Campus in Pictures
                </span>
                <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl leading-tight" style={{ color: 'var(--text-primary)' }}>
                  Photo{' '}
                  <span style={{ background: 'linear-gradient(135deg,#D4A017,#F5C842)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Gallery
                  </span>
                </h1>
                <p className="mt-2 text-sm md:text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                  A look inside GCI — our labs, classrooms, student activities, and campus life.
                  Click any image to view it full screen.
                </p>
              </div>
            </div>

            {/* Stats strip */}
            <div className="flex items-center gap-6 mt-8 flex-wrap">
              {[
                { label: 'Photos',     value: ALL_GALLERY_IMAGES.length },
                { label: 'Categories', value: ALL_CATS.length - 1 },
                { label: 'Campuses',   value: 3 },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="font-display font-black text-xl" style={{ color: '#D4A017' }}>{value}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Category filter tabs ───────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 mt-8 mb-6">
          <div className="flex flex-wrap gap-2">
            {ALL_CATS.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className="px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200"
                style={
                  activeCat === cat
                    ? { background: 'linear-gradient(135deg,#D4A017,#F5C842)', color: '#000', borderColor: 'transparent', boxShadow: '0 2px 12px rgba(212,160,23,0.3)' }
                    : { backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', borderColor: 'var(--border-medium)' }
                }
              >
                {cat}
                {cat === 'All' ? (
                  <span className="ml-1.5 opacity-60">({ALL_GALLERY_IMAGES.length})</span>
                ) : (
                  <span className="ml-1.5 opacity-60">({ALL_GALLERY_IMAGES.filter(i => i.category === cat).length})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ──────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <Images size={40} className="mx-auto mb-4 opacity-20" style={{ color: '#D4A017' }} />
              <p style={{ color: 'var(--text-muted)' }}>No photos in this category.</p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
            >
              {filtered.map((img, idx) => (
                <GalleryCard
                  key={img.src}
                  img={img}
                  index={idx}
                  onClick={() => openLightbox(idx)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* ── Lightbox ──────────────────────────────────────────────── */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.startIndex}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}

/* ── Individual gallery card ─────────────────────────────────────── */
function GalleryCard({ img, index, onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${img.alt} in fullscreen`}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
      style={{
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-card)',
        aspectRatio: '4/3',
        // Subtle entrance stagger via CSS custom property
        animationDelay: `${index * 30}ms`,
      }}
    >
      {/* Image */}
      <Image
        src={img.src}
        alt={img.alt || 'GCI Gallery'}
        fill
        quality={80}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ willChange: 'transform' }}
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }}
      >
        {/* Zoom icon */}
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
          style={{ backgroundColor: 'rgba(212,160,23,0.9)', color: '#000' }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
          </svg>
        </div>

        {/* Caption */}
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-[30ms]"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', backdropFilter: 'blur(4px)' }}
        >
          {img.alt}
        </span>
      </div>

      {/* Category badge */}
      <div
        className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ backgroundColor: 'rgba(212,160,23,0.9)', color: '#000' }}
      >
        {img.category}
      </div>
    </div>
  );
}
