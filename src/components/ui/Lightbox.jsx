'use client';
/**
 * Lightbox.jsx
 * Full-screen image lightbox with:
 * - Previous / Next navigation
 * - Image counter  (e.g. "3 / 24")
 * - Close button
 * - Keyboard: ← → to navigate, Esc to close
 * - Click backdrop to close
 * - Smooth fade transition between images
 * - Accessible (focus-trap, aria labels)
 */
import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Lightbox({ images, startIndex, onClose }) {
  const [current,   setCurrent]   = useState(startIndex ?? 0);
  const [fading,    setFading]    = useState(false);

  const total = images.length;

  /* ── Navigation helpers ──────────────────────────────────────── */
  const goTo = useCallback((idx) => {
    if (idx === current) return;
    setFading(true);
    setTimeout(() => {
      setCurrent((idx + total) % total);
      setFading(false);
    }, 160);
  }, [current, total]);

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  /* ── Keyboard handler ────────────────────────────────────────── */
  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [prev, next, onClose]);

  /* ── Lock body scroll while open ────────────────────────────── */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const img = images[current];

  return (
    /* ── Backdrop ─────────────────────────────────────────────── */
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >

      {/* ── Close button ──────────────────────────────────────── */}
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ backgroundColor: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.35)', color: '#F5C842' }}
      >
        <X size={18} />
      </button>

      {/* ── Counter ───────────────────────────────────────────── */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full text-sm font-semibold font-mono"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}
      >
        {current + 1} <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span> {total}
      </div>

      {/* ── Prev button ───────────────────────────────────────── */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        aria-label="Previous image"
        className="absolute left-3 sm:left-5 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
      >
        <ChevronLeft size={22} />
      </button>

      {/* ── Next button ───────────────────────────────────────── */}
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        aria-label="Next image"
        className="absolute right-3 sm:right-5 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
      >
        <ChevronRight size={22} />
      </button>

      {/* ── Image container ───────────────────────────────────── */}
      <div
        className="relative w-full h-full flex items-center justify-center px-16 sm:px-20 py-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image wrapper — fades during transition */}
        <div
          className="relative max-w-5xl w-full"
          style={{
            maxHeight: 'calc(100vh - 128px)',
            transition: 'opacity 0.16s ease',
            opacity: fading ? 0 : 1,
          }}
        >
          <Image
            src={img.src}
            alt={img.alt || `GCI Gallery image ${current + 1}`}
            width={1400}
            height={900}
            quality={88}
            priority
            className="w-full h-auto rounded-xl"
            style={{
              maxHeight: 'calc(100vh - 128px)',
              objectFit: 'contain',
              display: 'block',
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
        </div>

        {/* Caption bar */}
        {img.alt && (
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap"
            style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(212,160,23,0.25)',
              color: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {img.alt}
          </div>
        )}
      </div>

      {/* ── Thumbnail dots strip ──────────────────────────────── */}
      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-2 rounded-full"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to image ${i + 1}`}
            className="transition-all"
            style={{
              width:  i === current ? 20 : 6,
              height: 6,
              borderRadius: 99,
              backgroundColor: i === current ? '#D4A017' : 'rgba(255,255,255,0.28)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
}
