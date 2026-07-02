'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { CheckCircle, ArrowRight, Target, Eye, Lightbulb, Award, GraduationCap, Globe } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import { WHY_FEATURES, FACULTY, MILESTONES, ABOUT_HERO_IMAGE, ABOUT_STORY_IMAGE, ABOUT_VISION_IMAGE } from '@/lib/data';
import { getIcon } from '@/lib/icons';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export default function AboutPageClient() {
  const storyRef    = useRef(null);
  const mvRef       = useRef(null);
  const ceoRef      = useRef(null);
  const timelineRef = useRef(null);
  const whyRef      = useRef(null);
  const facultyRef  = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Story section
      if (storyRef.current) {
        const [left, right] = storyRef.current.querySelectorAll('[data-col]');
        if (left) gsap.fromTo(left, {x:-50 }, { opacity:1, x:0, duration:0.75, ease:'power3.out', scrollTrigger:{ trigger:left, start:'top 85%', once:true } });
        if (right) gsap.fromTo(right, {x:50 }, { opacity:1, x:0, duration:0.75, ease:'power3.out', scrollTrigger:{ trigger:right, start:'top 85%', once:true } });
      }
      // Mission/Vision cards
      if (mvRef.current) {
        gsap.fromTo(mvRef.current.querySelectorAll('[data-card]'), {y:40 },
          { opacity:1, y:0, stagger:0.12, duration:0.65, ease:'power3.out', scrollTrigger:{ trigger:mvRef.current, start:'top 85%', once:true } });
      }
      // Timeline
      if (timelineRef.current) {
        gsap.fromTo(timelineRef.current.querySelectorAll('[data-milestone]'), {y:30 },
          { opacity:1, y:0, stagger:0.12, duration:0.6, ease:'power3.out', scrollTrigger:{ trigger:timelineRef.current, start:'top 85%', once:true } });
      }
      // Why grid
      if (whyRef.current) {
        gsap.fromTo(whyRef.current.children, {y:40 },
          { opacity:1, y:0, stagger:0.1, duration:0.65, ease:'power3.out', scrollTrigger:{ trigger:whyRef.current, start:'top 85%', once:true } });
      }
      // CEO section
      if (ceoRef.current) {
        gsap.fromTo(ceoRef.current, {y:40},
          { opacity:1, y:0, duration:0.75, ease:'power3.out', scrollTrigger:{ trigger:ceoRef.current, start:'top 85%', once:true } });
      }
      // Faculty grid
      if (facultyRef.current) {
        gsap.fromTo(facultyRef.current.children, {y:30 },
          { opacity:1, y:0, stagger:0.08, duration:0.55, ease:'power3.out', scrollTrigger:{ trigger:facultyRef.current, start:'top 85%', once:true } });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <TopBar />
      <Navbar />
      <main className="pt-[64px] md:pt-[116px]" style={{ backgroundColor:'var(--bg-primary)' }}>
        <PageHero image={ABOUT_HERO_IMAGE} badge="Est. 2005 — 20 Years of Excellence"
          title="Shaping Pakistan's" highlight="Digital Future"
          subtitle="From a single classroom in Karachi to a 3-campus institution with 1,500+ alumni across Karachi — this is the GCI story." />

        {/* Story */}
        <section className="py-12 md:py-24 px-4 md:px-16" style={{ backgroundColor:'var(--bg-primary)' }}>
          <div ref={storyRef} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div data-col className="gsap-hidden">
              <SectionHeader label="Our Story" title="From Humble Beginnings" highlight="To Excellence" />
              <p className="text-base leading-relaxed mb-5" style={{ color:'var(--text-secondary)' }}>
                In 2005, GCI founder Dr. Arif Mahmood opened a single training room in Gulshan-e-Iqbal with one vision: every Pakistani student deserves access to world-class technology education.
              </p>
              <p className="text-sm leading-relaxed mb-8" style={{ color:'var(--text-muted)' }}>
                Twenty years later, that vision has produced over 1,500 graduates working at leading Pakistani tech companies and digital agencies across Karachi.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[{v:'20+',l:'Years'},{v:'1.5k+',l:'Alumni'},{v:'3',l:'Campuses'}].map((s,i) => (
                  <div key={i} className="text-center p-4 rounded-xl border" style={{ backgroundColor:'var(--bg-card)', borderColor:'var(--border-gold)' }}>
                    <div className="font-display text-2xl font-black text-[#F5C842]">{s.v}</div>
                    <div className="text-xs mt-1" style={{ color:'var(--text-muted)' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div data-col className="relative gsap-hidden">
              <div className="relative rounded-3xl overflow-hidden h-[420px]">
                <Image src={ABOUT_STORY_IMAGE} alt="GCI classroom" fill quality={85} className="object-cover" sizes="(max-width:1024px) 100vw,50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="absolute -bottom-5 -left-5 glass-gold rounded-2xl p-5 min-w-[180px]" style={{ boxShadow:'var(--shadow-gold)' }}>
                <div className="font-display text-3xl font-black text-[#F5C842]">1,500+</div>
                <div className="text-sm font-medium mt-1" style={{ color:'var(--text-primary)' }}>Alumni Placed</div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-12 md:py-24 px-4 md:px-16" style={{ backgroundColor:'var(--bg-section)' }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeader label="Our Purpose" title="Mission &" highlight="Vision" center />
            <div ref={mvRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon:Target, label:'Our Mission', color:'#D4A017',
                  text:'To democratize technology education in Pakistan by providing affordable, industry-aligned, and career-focused training that empowers every student to thrive in the digital economy.' },
                { icon:Eye, label:'Our Vision', color:'#60A5FA',
                  text:'To become South Asia\'s most trusted technology education institution — producing confident, capable, globally competitive tech professionals who drive innovation across Pakistan and beyond.' },
              ].map(({icon:Icon,label,color,text},i) => (
                <div key={i} data-card className="rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1"
                  style={{ backgroundColor:'var(--bg-card)', borderColor:'var(--border-subtle)'}}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border-gold)'; e.currentTarget.style.boxShadow='var(--shadow-card)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.boxShadow='none'; }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background:`${color}18`, border:`1px solid ${color}30` }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-3" style={{ color:'var(--text-primary)' }}>{label}</h3>
                  <p className="text-sm leading-relaxed" style={{ color:'var(--text-secondary)' }}>{text}</p>
                </div>
              ))}
            </div>
            <div ref={mvRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              {[{icon:Lightbulb,t:'Innovation',d:'Constantly evolving curriculum'},{icon:Award,t:'Excellence',d:'Uncompromising standards'},{icon:CheckCircle,t:'Integrity',d:'Honest and student-first'},{icon:Target,t:'Impact',d:'Measured by graduate success'}].map(({icon:Icon,t,d},i)=>(
                <div key={i} className="text-center p-5 rounded-2xl border" style={{ backgroundColor:'var(--bg-card)', borderColor:'var(--border-subtle)' }}>
                  <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background:'rgba(212,160,23,0.12)', border:'1px solid rgba(212,160,23,0.22)' }}>
                    <Icon size={18} className="text-[#D4A017]" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1" style={{ color:'var(--text-primary)' }}>{t}</h4>
                  <p className="text-xs" style={{ color:'var(--text-muted)' }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Milestones */}
        {/* <section className="py-12 md:py-24 px-4 md:px-16" style={{ backgroundColor:'var(--bg-primary)' }}>
          <div className="max-w-5xl mx-auto">
            <SectionHeader label="Our Journey" title="Two Decades of" highlight="Milestones" center />
            <div ref={timelineRef} className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
                style={{ background:'linear-gradient(to bottom,transparent,rgba(212,160,23,0.35),transparent)' }} />
              {MILESTONES.map((m,i)=>{
                const isLeft = i%2===0;
                return (
                  <div key={i} data-milestone className={`flex items-center gap-6 mb-10 ${isLeft?'md:flex-row':'md:flex-row-reverse'} flex-row gsap-hidden`}>
                    <div className={`flex-1 ${isLeft?'md:text-right':''}`}>
                      <div className="inline-block rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1"
                        style={{ backgroundColor:'var(--bg-card)', borderColor:'var(--border-subtle)' }}
                        onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border-gold)'}
                        onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border-subtle)'}>
                        <span className="text-xs font-bold text-[#D4A017] mb-1 block">{m.year}</span>
                        <h4 className="font-display font-bold text-base mb-1" style={{ color:'var(--text-primary)' }}>{m.title}</h4>
                        <p className="text-xs leading-relaxed" style={{ color:'var(--text-secondary)' }}>{m.desc}</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0 z-10 text-black font-bold text-xs hidden md:flex" style={{ boxShadow:'var(--shadow-gold-sm)' }}>{i+1}</div>
                    <div className="flex-1 hidden md:block" />
                  </div>
                );
              })}
            </div>
          </div>
        </section> */}

      

        {/* Vision image break */}
        <section className="relative h-72 overflow-hidden">
          <Image src={ABOUT_VISION_IMAGE} alt="GCI students" fill quality={80} className="object-cover object-center" />
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
            <div>
              <p className="font-display text-2xl md:text-3xl font-bold text-white mb-4 max-w-2xl">
                &ldquo;We don&apos;t just teach technology — we build <span className="text-gold-gradient">careers that last a lifetime.</span>&rdquo;
              </p>
              <p className="text-white/60 text-sm">— Faheem Ahmed, Founder &amp; Director, GCI</p>
            </div>
          </div>
        </section>


        {/* ── Director / CEO Message ── */}
        <section className="py-16 md:py-24 px-4 md:px-16" style={{ backgroundColor: 'var(--bg-section)' }}>
          <div className="max-w-5xl mx-auto">
            <SectionHeader label="From the Director's Desk" title="A Message" highlight="From Our Director" center />

            <div ref={ceoRef} className="mt-10 md:mt-14 rounded-3xl overflow-hidden border gsap-hidden"
              style={{ borderColor: 'var(--border-gold)', boxShadow: 'var(--shadow-card-lg)', backgroundColor: 'var(--bg-card)' }}>
              <div className="flex flex-col md:flex-row">

                {/* ── Left panel: photo + identity ── */}
                <div className="md:w-64 flex-shrink-0 flex flex-col items-center justify-center px-8 py-10 md:py-12 border-b md:border-b-0 md:border-r"
                  style={{
                    background: 'linear-gradient(160deg,#0a0a0a 0%,#1a1200 70%,#0a0a0a 100%)',
                    borderColor: 'rgba(212,160,23,0.25)',
                  }}>
                  {/* Avatar circle with gold ring */}
                  <div className="relative mb-5">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 flex items-center justify-center"
                      style={{
                        borderColor: '#D4A017',
                        boxShadow: '0 0 0 6px rgba(212,160,23,0.12), 0 8px 32px rgba(212,160,23,0.30)',
                        background: 'linear-gradient(135deg,#1a2030,#2a3545)',
                      }}>
                      {/* CEO image — place your photo at /public/images/ceo.jpg */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/ceo.jpeg"
                        alt="Faheem Ahmed — Director, Global Computer Institute"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          /* Fallback to initials if image file is not placed yet */
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <span
                        className="font-display font-black text-4xl md:text-5xl text-[#D4A017] w-full h-full items-center justify-center"
                        style={{ display: 'none' }}>
                        FA
                      </span>
                    </div>
                    {/* Director badge */}
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black text-black whitespace-nowrap"
                      style={{ background: 'linear-gradient(135deg,#D4A017,#F5C842)', boxShadow: '0 2px 8px rgba(212,160,23,0.4)' }}>
                      Director
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg md:text-xl text-center text-white mt-3">Faheem Ahmed</h3>
                  <p className="text-xs text-center mt-1" style={{ color: 'rgba(245,200,66,0.75)' }}>Director &amp; Founder</p>
                  <p className="text-[10px] text-center mt-0.5" style={{ color: 'rgba(255,255,255,0.30)' }}>Global Computer Institute</p>

                  {/* Decorative line */}
                  <div className="w-10 h-0.5 mt-5 rounded-full" style={{ background: 'linear-gradient(90deg,transparent,#D4A017,transparent)' }} />

                  {/* Social-style stats */}
                  <div className="flex gap-5 mt-5">
                    {[{ n: '20+', l: 'Years' }, { n: '3', l: 'Campuses' }, { n: '1.5K+', l: 'Alumni' }].map(({ n, l }) => (
                      <div key={l} className="text-center">
                        <div className="font-display font-black text-base text-[#F5C842]">{n}</div>
                        <div className="text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Right panel: message ── */}
                <div className="flex-1 min-w-0 px-6 md:px-10 py-8 md:py-12">

                  {/* Title */}
                  <h2 className="font-display font-black leading-none mb-1"
                    style={{
                      fontSize: 'clamp(2rem, 5vw, 3rem)',
                      fontStyle: 'italic',
                      background: 'linear-gradient(135deg,#D4A017,#F5C842)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                    Congratulations
                  </h2>
                  <div className="w-14 h-0.5 mb-6 rounded-full" style={{ background: 'linear-gradient(90deg,#D4A017,transparent)' }} />

                  {/* English paragraphs */}
                  <div className="space-y-4 text-sm md:text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <p>
                      for the completion of your course with a good percentage. I am really very
                      happy for you and wish you every success in life ahead.
                    </p>
                    <p>
                      Being a teacher, it is always a pleasure to see the students on top of the world.
                      Today through this letter I am not only saying bye to you but also like to share
                      a few things with you. To be a successful person you need to be honest and
                      hardworking, as there is no short cut to success.
                    </p>
                    <p>
                      I know you and so I can say that you will set an example of true values in front
                      of others. I am proud to have you as my student. I wish all the success to be at
                      your door step.
                    </p>
                  </div>

                  {/* Urdu dua */}
                  <div className="mt-6 p-4 rounded-2xl text-right"
                    style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-gold)' }}>
                    <p className="text-sm font-medium leading-loose" dir="rtl"
                      style={{ color: 'var(--text-secondary)', fontFamily: "Georgia, serif" }}>
                      میری دعا ہے کہ
                    </p>
                    <p className="text-base font-semibold leading-loose mt-1" dir="rtl"
                      style={{ color: 'var(--text-primary)', fontFamily: "Georgia, serif" }}>
                      رب العزت آپ کو زندگی کے تمام مشکل مراحل اور آزمائشوں میں کامیابیوں اور کامرانیوں سے ہمکنار کرے، آمین!
                    </p>
                  </div>

                  {/* Signature block */}
                  <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>With warm regards,</p>
                    {/* Stylised SVG signature */}
                    {/* <svg viewBox="0 0 140 48" width="140" height="48" fill="none" aria-hidden="true">
                      <path d="M5 38 Q15 8 28 26 Q40 42 55 22 Q68 6 82 24 Q94 38 108 26 Q118 18 130 28"
                        stroke="#D4A017" strokeWidth="2" strokeLinecap="round" />
                      <path d="M8 42 Q40 34 75 40 Q100 44 128 36"
                        stroke="rgba(212,160,23,0.25)" strokeWidth="1" strokeLinecap="round" />
                    </svg> */}
                    <p className="font-display font-bold text-base mt-1" style={{ color: 'var(--text-primary)' }}>Faheem Ahmed</p>
                    <p className="text-xs font-semibold" style={{ color: '#D4A017' }}>Director, Global Computer Institute</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ── Principals Section ── */}
        <section className="py-16 md:py-24 px-4 md:px-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="max-w-5xl mx-auto">
            <SectionHeader label="Our Leadership" title="Campus" highlight="Principals" center />
            <p className="text-center text-sm max-w-xl mx-auto mt-3 mb-10 md:mb-14" style={{ color: 'var(--text-secondary)' }}>
              Each of our three campuses is led by a dedicated principal committed to academic excellence and student development.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  name:        'Principal Name',
                  designation: 'Principal — Campus I',
                  campus:      'Main Campus, Saudabad',
                  image:       null,
                  initials:    'P1',
                },
                {
                  name:        'Principal Name',
                  designation: 'Principal — Campus II',
                  campus:      'Branch Campus',
                  image:       null,
                  initials:    'P2',
                },
                {
                  name:        'Principal Name',
                  designation: 'Principal — Campus III',
                  campus:      'Branch Campus',
                  image:       null,
                  initials:    'P3',
                },
              ].map((principal, i) => (
                <div key={i}
                  className="group flex flex-col items-center text-center rounded-3xl border p-6 md:p-8 transition-all duration-300 hover:-translate-y-2"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-gold)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}>

                  {/* Photo */}
                  <div className="relative mb-5">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 mx-auto flex items-center justify-center"
                      style={{
                        borderColor: '#D4A017',
                        boxShadow: '0 0 0 4px rgba(212,160,23,0.12), 0 4px 20px rgba(212,160,23,0.20)',
                        background: 'linear-gradient(135deg,rgba(212,160,23,0.15),rgba(212,160,23,0.04))',
                      }}>
                      {principal.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={principal.image}
                          alt={principal.name}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <span className="font-display font-black text-3xl" style={{ color: '#D4A017' }}>
                          {principal.initials}
                        </span>
                      )}
                    </div>
                    {/* Principal badge */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black text-black whitespace-nowrap"
                      style={{ background: 'linear-gradient(135deg,#D4A017,#F5C842)', boxShadow: '0 2px 8px rgba(212,160,23,0.4)' }}>
                      Principal
                    </div>
                  </div>

                  {/* Name & Title */}
                  <h3 className="font-display font-bold text-base md:text-lg mt-3 group-hover:text-[#F5C842] transition-colors"
                    style={{ color: 'var(--text-primary)' }}>
                    {principal.name}
                  </h3>
                  <p className="text-sm font-semibold mt-1" style={{ color: '#D4A017' }}>
                    {principal.designation}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {principal.campus}
                  </p>

                  {/* Decorative line */}
                  <div className="w-8 h-0.5 mt-4 rounded-full mx-auto" style={{ background: 'linear-gradient(90deg,transparent,#D4A017,transparent)' }} />
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Faculty */}
        <section className="py-12 md:py-24 px-4 md:px-16" style={{ backgroundColor:'var(--bg-primary)' }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeader label="Our Educators" title="Faculty" highlight="Highlights" center />
            <div ref={facultyRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {FACULTY.map((member,i)=>(
                <div key={member.id} className="group text-center rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1"
                  style={{ backgroundColor:'var(--bg-card)', borderColor:'var(--border-subtle)'}}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border-gold)'; e.currentTarget.style.boxShadow='var(--shadow-card)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.boxShadow='none'; }}>
                  <div className={`w-16 h-16 rounded-full mx-auto mb-4 border-2 flex items-center justify-center font-display font-black text-xl text-[#F5C842] bg-gradient-to-br ${member.bg} group-hover:scale-105 transition-transform duration-300`}
                    style={{ borderColor:'rgba(212,160,23,0.25)' }}>{member.initials}</div>
                  <h4 className="font-semibold text-sm group-hover:text-[#F5C842] transition-colors" style={{ color:'var(--text-primary)' }}>{member.name}</h4>
                  <p className="text-xs text-[#D4A017] mt-0.5">{member.role}</p>
                  <p className="text-xs mt-1" style={{ color:'var(--text-muted)' }}>{member.exp}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

  {/* Why us */}
        <section className="py-12 md:py-24 px-4 md:px-16" style={{ backgroundColor:'var(--bg-section)' }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeader label="Why GCI" title="Why Students Choose" highlight="Us" center />
            <div ref={whyRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHY_FEATURES.map((f,i)=>{
                const Icon=getIcon(f.iconName);
                return (
                  <div key={i} className="group rounded-2xl p-7 border text-center transition-all duration-300 hover:-translate-y-2"
                    style={{ backgroundColor:'var(--bg-card)', borderColor:'var(--border-subtle)'}}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border-gold)'; e.currentTarget.style.boxShadow='var(--shadow-card)'; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.boxShadow='none'; }}>
                    <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center border-2 transition-all duration-300 group-hover:border-[#D4A017]/50 group-hover:scale-110"
                      style={{ background:'linear-gradient(135deg,rgba(212,160,23,0.15),rgba(212,160,23,0.04))', borderColor:'rgba(212,160,23,0.20)' }}>
                      <Icon size={24} className="text-[#D4A017] group-hover:text-[#F5C842] transition-colors" />
                    </div>
                    <h3 className="font-display font-bold text-base mb-2 group-hover:text-[#F5C842] transition-colors" style={{ color:'var(--text-primary)' }}>{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color:'var(--text-secondary)' }}>{f.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>


        {/* CTA */}
        <section className="py-10 md:py-20 px-4 md:px-16 text-center" style={{ backgroundColor:'var(--bg-section)' }}>
          <h2 className="font-display text-3xl md:text-4xl font-black text-[#F5C842] mb-4">Ready to Be Part of Our Story?</h2>
          <p className="text-base mb-8 max-w-xl mx-auto" style={{ color:'var(--text-secondary)' }}>
            Join thousands of students who have already transformed their lives at GCI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="inline-flex items-center gap-2 bg-gold-gradient text-black font-black px-9 py-4 rounded-full text-sm transition-transform duration-200 hover:scale-105" style={{ boxShadow:'var(--shadow-gold)' }}>
              Explore Courses <ArrowRight size={16} />
            </Link>
            <Link href="/admission-form" className="inline-flex items-center gap-2 border-2 font-semibold px-9 py-4 rounded-full text-sm transition-colors"
              style={{ borderColor:'var(--border-gold)', color:'var(--text-primary)' }}>Apply Now</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
