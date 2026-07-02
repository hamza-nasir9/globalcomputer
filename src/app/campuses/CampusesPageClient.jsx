'use client';
import Image from 'next/image';
import { useRef, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import { MapPin, Users, ArrowRight, Wifi, Monitor, BookOpen, Coffee, FlaskConical, Shield } from 'lucide-react';
import { CAMPUSES } from '@/lib/data';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const HERO_IMAGE = '/images/campus/interior-01.jpg';
const FACILITIES = [
  { icon:Monitor, title:'High-Speed Computer Labs', desc:'Latest hardware and software in every lab' },
  { icon:Wifi,    title:'Gigabit Internet',          desc:'Uninterrupted connectivity campus-wide' },
  { icon:BookOpen,title:'Digital Library',           desc:'Thousands of books and online resources' },
  { icon:Coffee,  title:'Student Lounge & Café',    desc:'Comfortable spaces to relax and collaborate' },
  { icon:FlaskConical, title:'Research Labs',        desc:'Dedicated AI, cybersecurity, and design labs' },
  { icon:Shield,  title:'Secure Environment',        desc:'24/7 security with CCTV surveillance' },
];

export default function CampusesPageClient() {
  const campusRefs = useRef([]);
  const facilRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      campusRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el, {y:50 },
          { opacity:1, y:0, duration:0.7, ease:'power3.out', delay:i*0.15,
            scrollTrigger:{ trigger:el, start:'top 85%', once:true } });
      });
      if (facilRef.current) {
        gsap.fromTo(facilRef.current.children, {y:35 },
          { opacity:1, y:0, stagger:0.1, duration:0.6, ease:'power3.out',
            scrollTrigger:{ trigger:facilRef.current, start:'top 85%', once:true } });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <TopBar />
      <Navbar />
      <main className="pt-[64px] md:pt-[116px]" style={{ backgroundColor:'var(--bg-primary)' }}>
        <PageHero image={HERO_IMAGE} badge="3 Campuses Across Karachi" title="Our" highlight="Campuses"
          subtitle="Three state-of-the-art learning environments delivering world-class tech education across Karachi." />

        {/* Campus cards */}
        <section className="py-12 md:py-24 px-4 md:px-16" style={{ backgroundColor:'var(--bg-primary)' }}>
          <div className="max-w-7xl mx-auto space-y-20">
            {CAMPUSES.map((campus, i) => (
              <div key={campus.id} ref={el => campusRefs.current[i] = el}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i%2!==0?'lg:flex-row-reverse':''} gsap-hidden`}>
                <div className={i%2!==0?'lg:order-2':'lg:order-1'}>
                  <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)] group">
                    <div className="relative w-full h-[420px]">
                      <Image src={campus.image} alt={campus.name} fill quality={80} className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                        sizes="(max-width:1024px) 100vw,50vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    <div className="absolute top-4 left-4 glass-gold px-3 py-1.5 rounded-full text-[#F5C842] text-xs font-bold uppercase tracking-wide">{campus.established}</div>
                    <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full text-white text-xs font-medium flex items-center gap-1.5"><Users size={11} />{campus.students} Students</div>
                  </div>
                </div>
                <div className={i%2!==0?'lg:order-1':'lg:order-2'}>
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase mb-3 block" style={{ color:'#D4A017' }}>Campus {i+1} of 3</span>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-2" style={{ color:'var(--text-primary)' }}>{campus.name}</h2>
                  <div className="flex items-center gap-1.5 text-[#D4A017] text-sm mb-5"><MapPin size={14} />{campus.area}</div>
                  <p className="text-base leading-relaxed mb-6" style={{ color:'var(--text-secondary)' }}>{campus.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {campus.tags.map(tag=>(
                      <span key={tag} className="text-xs px-3 py-1.5 rounded-full font-medium border" style={{ background:'rgba(212,160,23,0.08)', color:'#D4A017', borderColor:'rgba(212,160,23,0.20)' }}>{tag}</span>
                    ))}
                  </div>
                  <a href="/contact" className="inline-flex items-center gap-2 bg-gold-gradient text-black font-bold px-7 py-3 rounded-full text-sm transition-transform duration-200 hover:scale-105" style={{ boxShadow:'var(--shadow-gold-sm)' }}>
                    Get Directions <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shared facilities */}
        <section className="py-12 md:py-24 px-4 md:px-16" style={{ backgroundColor:'var(--bg-section)' }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeader label="World-Class Infrastructure" title="Facilities at" highlight="Every Campus" center />
            <div ref={facilRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FACILITIES.map(({icon:Icon,title,desc},i)=>(
                <div key={i} className="group flex gap-4 p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
                  style={{ backgroundColor:'var(--bg-card)', borderColor:'var(--border-subtle)'}}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border-gold)'; e.currentTarget.style.boxShadow='var(--shadow-card)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.boxShadow='none'; }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4A017]/20 transition-colors duration-300"
                    style={{ background:'rgba(212,160,23,0.10)', border:'1px solid rgba(212,160,23,0.20)' }}>
                    <Icon size={22} className="text-[#D4A017]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-[#F5C842] transition-colors" style={{ color:'var(--text-primary)' }}>{title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color:'var(--text-muted)' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
