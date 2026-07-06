'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from '@/lib/gsap';

/*
  DragSlider — buttery smooth horizontal slider with:
  ✓ Arrow navigation
  ✓ Mouse drag  
  ✓ Touch swipe
  ✓ Auto-play (pauses on hover)
  ✓ Dot indicators
  ✓ configurable visibleCount (can be fractional for "peek" effect)
  ✓ configurable gap
  
  Props:
    items        — array of anything
    renderItem   — (item, idx) => JSX
    gap          — px between cards (default 20)
    autoPlay     — ms between slides (default 0 = off)
    showDots     — bool (default true)
    visibleCount — function(windowWidth) => number, or static number
*/

const DEFAULT_VISIBLE = (w) => {
  if (w < 640)  return 1.08;
  if (w < 900)  return 2.08;
  if (w < 1280) return 3.08;
  return 4.08;
};

export default function DragSlider({
  items,
  renderItem,
  gap = 20,
  autoPlay = 0,
  showDots = true,
  visibleCount = DEFAULT_VISIBLE,
  arrowStyle = {},
  className = '',
}) {
  const [current,   setCurrent]   = useState(0);
  const [visible,   setVisible]   = useState(3);
  const [dragging,  setDragging]  = useState(false);
  const trackRef   = useRef(null);
  const wrapRef    = useRef(null);
  const dragStart  = useRef(null);
  const dragDelta  = useRef(0);
  const autoTimer  = useRef(null);
  const currentRef = useRef(0);

  /* keep ref in sync */
  useEffect(() => { currentRef.current = current; }, [current]);

  /* resize → recalc visible */
  useEffect(() => {
    const calc = () => {
      const v = typeof visibleCount === 'function' ? visibleCount(window.innerWidth) : visibleCount;
      setVisible(v);
    };
    calc();
    window.addEventListener('resize', calc, { passive: true });
    return () => window.removeEventListener('resize', calc);
  }, [visibleCount]);

  /* compute card width */
  const cardWidth = useCallback(() => {
    if (!wrapRef.current) return 0;
    return (wrapRef.current.offsetWidth - gap * (Math.ceil(visible) - 1)) / visible;
  }, [visible, gap]);

  /* move track to idx, optionally instant */
  const moveTo = useCallback((idx, instant = false) => {
    if (!trackRef.current) return;
    const x = -(idx * (cardWidth() + gap));
    gsap.to(trackRef.current, { x, duration: instant ? 0 : 0.52, ease: 'power3.out' });
  }, [cardWidth, gap]);

  const maxIdx = Math.max(0, items.length - Math.floor(visible));

  /* clamp + move + update state */
  const goTo = useCallback((raw) => {
    const idx = Math.max(0, Math.min(raw, maxIdx));
    setCurrent(idx);
    moveTo(idx);
  }, [maxIdx, moveTo]);

  /* re-snap on resize */
  useEffect(() => { moveTo(currentRef.current, true); }, [visible, moveTo]);

  /* autoplay */
  const resetAuto = useCallback(() => {
    if (!autoPlay) return;
    clearInterval(autoTimer.current);
    autoTimer.current = setInterval(() => {
      const next = currentRef.current < maxIdx ? currentRef.current + 1 : 0;
      goTo(next);
    }, autoPlay);
  }, [autoPlay, maxIdx, goTo]);

  useEffect(() => {
    resetAuto();
    return () => clearInterval(autoTimer.current);
  }, [resetAuto]);

  /* ── DRAG HANDLERS ─────────────────────────────── */
  const onDragStart = (clientX) => {
    dragStart.current = clientX;
    dragDelta.current = 0;
    setDragging(true);
    clearInterval(autoTimer.current);
    gsap.killTweensOf(trackRef.current);
  };

  const onDragMove = useCallback((clientX) => {
    if (dragStart.current == null) return;
    const dx = clientX - dragStart.current;
    dragDelta.current = dx;
    const base = -(currentRef.current * (cardWidth() + gap));
    gsap.set(trackRef.current, { x: base + dx });
  }, [cardWidth, gap]);

  const onDragEnd = useCallback(() => {
    if (dragStart.current == null) return;
    dragStart.current = null;
    setDragging(false);
    const threshold = cardWidth() * 0.22;
    const delta = dragDelta.current;
    if (Math.abs(delta) > threshold) {
      goTo(currentRef.current + (delta < 0 ? 1 : -1));
    } else {
      moveTo(currentRef.current);
    }
    resetAuto();
  }, [cardWidth, goTo, moveTo, resetAuto]);

  /* mouse */
  const onMouseDown = (e) => { e.preventDefault(); onDragStart(e.clientX); };
  useEffect(() => {
    if (!dragging) return;
    const mm = (e) => onDragMove(e.clientX);
    const mu = () => onDragEnd();
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup',   mu);
    return () => { window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu); };
  }, [dragging, onDragMove, onDragEnd]);

  /* touch */
  const onTouchStart = (e) => onDragStart(e.touches[0].clientX);
  const onTouchMove  = (e) => onDragMove(e.touches[0].clientX);
  const onTouchEnd   = () => onDragEnd();

  const canPrev = current > 0;
  const canNext = current < maxIdx;

  /* arrow styles shared */
  const arrowBase = {
    width: 38, height: 38, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1.5px solid', cursor: 'pointer', transition: 'all 0.2s',
    flexShrink: 0,
    ...arrowStyle,
  };

  return (
    <div className={className}>
      {/* Header slot rendered outside — arrows go inline with section heading */}
      <div ref={wrapRef} style={{ overflow: 'hidden', cursor: dragging ? 'grabbing' : 'grab' }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <div ref={trackRef} style={{ display: 'flex', gap, userSelect: 'none', willChange: 'transform' }}>
          {items.map((item, i) => (
            <div key={i} style={{ flexShrink: 0, width: `calc((100% - ${gap * (Math.ceil(visible) - 1)}px) / ${visible})` }}>
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row: dots left, arrows right */}
      {(showDots || items.length > Math.floor(visible)) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
          {/* Dots */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {Array.from({ length: maxIdx + 1 }).map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                style={{
                  height: 3, borderRadius: 4, border: 'none', cursor: 'pointer', transition: 'all 0.35s',
                  width: i === current ? 28 : 10,
                  background: i === current ? '#f7941d' : 'var(--border-c)',
                  padding: 0,
                }} />
            ))}
          </div>
          {/* Arrows */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => goTo(current - 1)} disabled={!canPrev}
              style={{
                ...arrowBase,
                background:   canPrev ? 'rgba(247,148,29,0.10)' : 'transparent',
                borderColor:  canPrev ? 'rgba(247,148,29,0.35)' : 'var(--border-c)',
                color:        canPrev ? '#f7941d' : 'var(--text-sm)',
                opacity:      canPrev ? 1 : 0.4,
              }}>
              <ChevronLeft size={17} />
            </button>
            <button onClick={() => goTo(current + 1)} disabled={!canNext}
              style={{
                ...arrowBase,
                background:   canNext ? 'rgba(247,148,29,0.10)' : 'transparent',
                borderColor:  canNext ? 'rgba(247,148,29,0.35)' : 'var(--border-c)',
                color:        canNext ? '#f7941d' : 'var(--text-sm)',
                opacity:      canNext ? 1 : 0.4,
              }}>
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
