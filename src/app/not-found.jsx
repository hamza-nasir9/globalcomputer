'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { gsap } from '@/lib/gsap';

export default function NotFound() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current.children, {y:30 }, { opacity:1, y:0, stagger:0.1, duration:0.6, ease:'power3.out', delay:0.2 });
  }, []);
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor:'var(--bg-primary)' }}>
        <div ref={ref} className="text-center max-w-md">
          <div className="font-display text-8xl font-black text-gold-gradient mb-4 gsap-hidden">404</div>
          <h1 className="font-display text-2xl font-bold mb-3" style={{ color:'var(--text-primary)'}}>Page Not Found</h1>
          <p className="text-sm mb-8" style={{ color:'var(--text-secondary)'}}>The page you are looking for doesn&apos;t exist or has been moved.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center gsap-hidden">
            <Link href="/" className="inline-flex items-center gap-2 bg-gold-gradient text-black font-bold px-8 py-3 rounded-full text-sm transition-transform duration-200 hover:scale-105" style={{ boxShadow:'var(--shadow-gold-sm)' }}>
              Back to Home <ArrowRight size={15} />
            </Link>
            <Link href="/courses" className="inline-flex items-center gap-2 border font-semibold px-8 py-3 rounded-full text-sm transition-colors"
              style={{ borderColor:'var(--border-gold)', color:'var(--text-primary)' }}>Browse Courses</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
