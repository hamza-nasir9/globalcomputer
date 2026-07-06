'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { Clock, Users, BarChart3, Calendar, CheckCircle, ArrowRight, Wrench, GraduationCap, ChevronLeft, Star, Briefcase, Award } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';
import { getIcon } from '@/lib/icons';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const BADGE_COLORS = {
  gold: { bg: 'rgba(212,160,23,0.15)', text: '#F5C842', border: 'rgba(212,160,23,0.30)' },
  blue: { bg: 'rgba(96,165,250,0.15)', text: '#93C5FD', border: 'rgba(96,165,250,0.30)' },
  purple: { bg: 'rgba(167,139,250,0.15)', text: '#C4B5FD', border: 'rgba(167,139,250,0.30)' },
  green: { bg: 'rgba(74,222,128,0.15)', text: '#86EFAC', border: 'rgba(74,222,128,0.30)' },
  red: { bg: 'rgba(248,113,113,0.15)', text: '#FCA5A5', border: 'rgba(248,113,113,0.30)' },
  orange: { bg: 'rgba(251,146,60,0.15)', text: '#FED7AA', border: 'rgba(251,146,60,0.30)' },
  teal: { bg: 'rgba(45,212,191,0.15)', text: '#99F6E4', border: 'rgba(45,212,191,0.30)' },
  pink: { bg: 'rgba(244,114,182,0.15)', text: '#FBCFE8', border: 'rgba(244,114,182,0.30)' },
};

export default function CourseDetailClient({ course }) {
  const Icon = getIcon(course.iconName);
  const badge = BADGE_COLORS[course.badgeColor] || BADGE_COLORS.gold;
  const contentRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(contentRef.current.querySelectorAll('[data-section]'), { y: 30 },
          {
            opacity: 1, y: 0, stagger: 0.12, duration: 0.65, ease: 'power3.out',
            scrollTrigger: { trigger: contentRef.current, start: 'top 85%', once: true }
          });
      }
      if (sidebarRef.current) {
        gsap.fromTo(sidebarRef.current, { x: 30 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.5 });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <TopBar />
      <Navbar />
      <main className="pt-[64px] md:pt-[116px]" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {/* Hero */}
        <section className="relative h-[500px] md:h-[560px] flex items-end overflow-hidden bg-[var(--bg-primary)]">
          <Image src={course.heroImage} alt={course.name} fill priority quality={85} className="object-cover object-center" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-16 pb-10 md:pb-14 w-full">
            <div className="flex items-center gap-2 text-xs mb-6" style={{ color: 'rgba(255,255,255,0.50)' }}>
              <Link href="/courses" className="hover:text-[#D4A017] transition-colors flex items-center gap-1"><ChevronLeft size={13} />All Courses</Link>
              <span>/</span><span style={{ color: 'rgba(255,255,255,0.70)' }}>{course.category}</span>
              <span>/</span><span className="text-[#F5C842] truncate max-w-[200px]">{course.name}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-4 border"
              style={{ background: badge.bg, color: badge.text, borderColor: badge.border }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: badge.text }} />{course.badge}
            </span>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-3">{course.name}</h1>
            <p className="text-white/65 text-base md:text-lg mb-7 max-w-2xl">{course.tagline}</p>
            <div className="flex flex-wrap gap-3">
              {[{ Icon: Clock, text: course.duration }, { Icon: BarChart3, text: course.level }, { Icon: Calendar, text: course.schedule }, { Icon: Users, text: course.seats }].map(({ Icon: Ic, text }, i) => (
                <div key={i} className="flex items-center gap-2 glass px-3 py-2 rounded-full text-xs text-white/80"><Ic size={13} className="text-[#D4A017]" />{text}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-10 md:py-16 px-4 sm:px-6 md:px-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div ref={contentRef} className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <div data-section className="gsap-hidden">
                <h2 className="font-display font-bold text-2xl mb-4" style={{ color: 'var(--text-primary)' }}>Course Overview</h2>
                <div className="w-14 h-0.5 bg-gold-gradient rounded-full mb-5" />
                <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{course.fullDescription}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>All sessions include live coding, peer collaboration, and mentor feedback. Students graduate with a professional portfolio and receive dedicated career placement support.</p>
              </div>
              {/* Syllabus */}
              <div data-section className="gsap-hidden">
                <h2 className="font-display font-bold text-2xl mb-4" style={{ color: 'var(--text-primary)' }}>Course Syllabus</h2>
                <div className="w-14 h-0.5 bg-gold-gradient rounded-full mb-6" />
                <div className="space-y-4">
                  {course.syllabus.map((s, i) => (
                    <div key={i} className="group flex gap-4 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5"
                      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-gold)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center font-bold text-black text-sm flex-shrink-0 mt-0.5" style={{ boxShadow: 'var(--shadow-gold-sm)' }}>{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
                          <h4 className="font-semibold text-sm group-hover:text-[#F5C842] transition-colors" style={{ color: 'var(--text-primary)' }}>{s.topic}</h4>
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: 'rgba(212,160,23,0.12)', color: '#D4A017', border: '1px solid rgba(212,160,23,0.22)' }}>{s.week}</span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{s.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Outcomes */}
              <div data-section className="gsap-hidden">
                <h2 className="font-display font-bold text-2xl mb-4" style={{ color: 'var(--text-primary)' }}>What You Will Learn</h2>
                <div className="w-14 h-0.5 bg-gold-gradient rounded-full mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.outcomes.map((o, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                      <CheckCircle size={16} className="text-[#D4A017] flex-shrink-0 mt-0.5" />
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Features */}
              {course.features && course.features.length > 0 && (
                <div data-section className="gsap-hidden">
                  <h2 className="font-display font-bold text-2xl mb-4" style={{ color: 'var(--text-primary)' }}>Key Features</h2>
                  <div className="w-14 h-0.5 bg-gold-gradient rounded-full mb-6" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {course.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-gold)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
                        <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                          style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.30)' }}>
                          <Star size={11} className="text-[#D4A017]" />
                        </div>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Career Opportunities */}
              {course.careerOpportunities && course.careerOpportunities.length > 0 && (
                <div data-section className="gsap-hidden">
                  <h2 className="font-display font-bold text-2xl mb-4" style={{ color: 'var(--text-primary)' }}>Career Opportunities</h2>
                  <div className="w-14 h-0.5 bg-gold-gradient rounded-full mb-6" />
                  <div className="flex flex-wrap gap-3">
                    {course.careerOpportunities.map((opp, i) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 hover:-translate-y-0.5"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.45)'; e.currentTarget.style.color = '#F5C842'; e.currentTarget.style.backgroundColor = 'rgba(212,160,23,0.06)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'var(--bg-card)'; }}>
                        <Briefcase size={13} className="text-[#D4A017] flex-shrink-0" />
                        <span className="text-sm font-medium">{opp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Certification */}
              {course.certification && (
                <div data-section className="gsap-hidden">
                  <h2 className="font-display font-bold text-2xl mb-4" style={{ color: 'var(--text-primary)' }}>Certification</h2>
                  <div className="w-14 h-0.5 bg-gold-gradient rounded-full mb-6" />
                  <div className="flex items-start gap-4 p-5 rounded-2xl border"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-gold)', background: 'linear-gradient(135deg,rgba(212,160,23,0.06),rgba(212,160,23,0.02))' }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,#D4A017,#F5C842)', boxShadow: 'var(--shadow-gold-sm)' }}>
                      <Award size={22} className="text-black" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Certificate Awarded</h4>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{course.certification}</p>
                    </div>
                  </div>
                </div>
              )}
              {/* Tools */}
              <div data-section className="gsap-hidden">
                <h2 className="font-display font-bold text-2xl mb-4" style={{ color: 'var(--text-primary)' }}>Tools &amp; Technologies</h2>
                <div className="w-14 h-0.5 bg-gold-gradient rounded-full mb-6" />
                <div className="flex flex-wrap gap-2.5">
                  {course.tools.map(tool => (
                    <span key={tool} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 hover:-translate-y-0.5"
                      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.45)'; e.currentTarget.style.color = '#F5C842'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                      <Wrench size={12} className="text-[#D4A017]" />{tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div ref={sidebarRef} className="lg:col-span-1 gsap-hidden">
              <div className="sticky top-24 rounded-3xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-gold)', boxShadow: 'var(--shadow-card)' }}>
                <div className="relative h-40 overflow-hidden">
                  <Image src={course.cardImage} alt={course.name} fill quality={75} className="object-cover" sizes="400px" />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-gold-gradient flex items-center justify-center" style={{ boxShadow: 'var(--shadow-gold)' }}>
                      <Icon size={26} className="text-black" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="font-display font-black text-2xl text-[#F5C842] mb-1">{course.fee}</div>
                  <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>Installment plans available. Scholarships for eligible students.</p>
                  <div className="space-y-3 mb-6">
                    {[{ Icon: Clock, label: 'Duration', value: course.duration }, { Icon: BarChart3, label: 'Level', value: course.level }, { Icon: Calendar, label: 'Schedule', value: course.schedule.split(',')[0] }, { Icon: Users, label: 'Class Size', value: course.seats }].map(({ Icon: Ic, label, value }, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}><Ic size={13} className="text-[#D4A017]" />{label}</div>
                        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/admission-form"
                    className="flex items-center justify-center gap-2 w-full bg-gold-gradient text-black font-black py-3.5 rounded-2xl text-sm mb-3 transition-transform duration-200 hover:scale-[1.02] hover:-translate-y-0.5"
                    style={{ boxShadow: 'var(--shadow-gold)' }}>
                    <GraduationCap size={17} />Enroll Now
                  </Link>

                  <a
                    href="tel:+922111424786"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-xs font-semibold border transition-colors"
                    style={{ borderColor: 'var(--border-gold)', color: 'var(--text-secondary)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#F5C842'; e.currentTarget.style.backgroundColor = 'rgba(212,160,23,0.07)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                    Free Counseling Call
                  </a>
                  <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>No commitment required. Limited seats per batch.</p>
                </div>
              </div>
              <div className="mt-6 p-5 rounded-2xl border text-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Explore more programs</p>
                <Link href="/courses" className="inline-flex items-center gap-1.5 text-[#D4A017] hover:text-[#F5C842] text-sm font-semibold transition-colors">
                  View All Courses <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
