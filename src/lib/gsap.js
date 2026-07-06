/**
 * GSAP singleton — centralises imports so plugins only register once.
 * Import { gsap, ScrollTrigger } from '@/lib/gsap' everywhere.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
