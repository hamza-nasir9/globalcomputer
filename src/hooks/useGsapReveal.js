'use client';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Attach to any container ref.
 * All children with data-gsap="fade-up" (or other variants) animate in on scroll.
 * variants: "fade-up" | "fade-left" | "fade-right" | "scale-in" | "stagger"
 */
export function useGsapReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;

    const ctx = gsap.context(() => {
      // Generic fade-up for any element with data-gsap
      const els = ref.current.querySelectorAll('[data-gsap]');
      els.forEach((el) => {
        const variant = el.dataset.gsap || 'fade-up';
        const delay   = parseFloat(el.dataset.delay  || '0');
        const dur     = parseFloat(el.dataset.dur    || '0.7');

        const fromVars = {
          'fade-up':    { opacity: 0, y: 40 },
          'fade-down':  { opacity: 0, y: -40 },
          'fade-left':  { opacity: 0, x: -50 },
          'fade-right': { opacity: 0, x: 50 },
          'scale-in':   { opacity: 0, scale: 0.88 },
          'fade':       { opacity: 0 },
        }[variant] || { opacity: 0, y: 30 };

        gsap.fromTo(el,
          fromVars,
          {
            opacity: 1, y: 0, x: 0, scale: 1,
            duration: dur,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: options.start || 'top 88%',
              once: true,
            },
          }
        );
      });

      // Stagger groups
      const staggerGroups = ref.current.querySelectorAll('[data-gsap-stagger]');
      staggerGroups.forEach((group) => {
        const children = Array.from(group.children);
        const staggerDelay = parseFloat(group.dataset.gsapStagger || '0.08');
        gsap.fromTo(children,
          { opacity: 0, y: 35 },
          {
            opacity: 1, y: 0,
            duration: 0.65,
            stagger: staggerDelay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 86%',
              once: true,
            },
          }
        );
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return ref;
}

/** Simple one-shot animate-in for page heroes (runs immediately, no scroll) */
export function useGsapEntrance(deps = []) {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;
    const ctx = gsap.context(() => {
      const els = ref.current.querySelectorAll('[data-entrance]');
      els.forEach((el) => {
        const delay = parseFloat(el.dataset.delay || '0');
        const from  = el.dataset.entrance || 'up';
        const fromVars = {
          up:    { opacity: 0, y: 35 },
          down:  { opacity: 0, y: -35 },
          left:  { opacity: 0, x: -40 },
          right: { opacity: 0, x: 40 },
          scale: { opacity: 0, scale: 0.85 },
          fade:  { opacity: 0 },
        }[from] || { opacity: 0, y: 30 };
        gsap.fromTo(el, fromVars, {
          opacity: 1, y: 0, x: 0, scale: 1,
          duration: 0.7, delay, ease: 'power3.out',
        });
      });
    }, ref);
    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
