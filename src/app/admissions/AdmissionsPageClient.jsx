'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import { getIcon } from '@/lib/icons';
import { ADMISSION_STEPS } from '@/lib/data';
import { GraduationCap, Phone, CheckCircle, Clock, Calendar, Users, DollarSign, BookOpen, Award } from 'lucide-react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const HERO_IMAGE = '/images/campus/lab-03.jpg';
const REQUIREMENTS = [
  'Matriculation (SSC) or equivalent (minimum)',
  'Age 16+ for most programs',
  'Basic computer literacy (for advanced programs)',
  'Valid CNIC / B-Form / Passport copy',
  '2 passport-size photographs',
  'Original academic certificates + 1 set of photocopies',
];
const SCHOLARSHIPS = [
  { title:'Merit Scholarship', amount:'Up to 50% fee waiver', desc:'For students with exceptional academic performance.', icon:'Award' },
  { title:'Need-Based Grant', amount:'Up to 30% fee waiver', desc:'For deserving students from low-income families.', icon:'Users' },
  { title:'Early Bird Discount', amount:'10% discount', desc:'Apply 30 days before batch start date.', icon:'Clock' },
  { title:'Sibling Discount', amount:'15% off second sibling', desc:'For families enrolling multiple members.', icon:'BookOpen' },
];

export default function AdmissionsPageClient() {
  const stepsRef  = useRef(null);
  const reqRef    = useRef(null);
  const scholRef  = useRef(null);
  const ctaRef    = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      [
        { ref:stepsRef, sel:'[data-step-card]' },
        { ref:reqRef,   sel:'[data-req]' },
        { ref:scholRef, sel:'[data-schol]' },
      ].forEach(({ref,sel}) => {
        if (!ref.current) return;
        gsap.fromTo(ref.current.querySelectorAll(sel), {y:35 },
          { opacity:1, y:0, stagger:0.1, duration:0.6, ease:'power3.out',
            scrollTrigger:{ trigger:ref.current, start:'top 85%', once:true } });
      });
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current.children, {y:25 },
          { opacity:1, y:0, stagger:0.12, duration:0.6, ease:'power3.out',
            scrollTrigger:{ trigger:ctaRef.current, start:'top 88%', once:true } });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <TopBar />
      <Navbar />
      <main className="pt-[64px] md:pt-[116px]" style={{ backgroundColor:'var(--bg-primary)' }}>
        <PageHero image={HERO_IMAGE} badge="Admissions Open — Spring 2025" title="Begin Your" highlight="Tech Journey Today"
          subtitle="Joining GCI is simple. Our streamlined admission process gets you from applicant to student in just a few easy steps." />

        {/* Steps */}
        <section className="py-12 md:py-24 px-4 md:px-16" style={{ backgroundColor:'var(--bg-primary)' }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader label="Enrollment Process" title="How To" highlight="Join GCI"
              subtitle="Follow these five steps and begin your transformation today." center />
            <div ref={stepsRef} className="relative">
              {/* Mobile layout */}
              <div className="space-y-6 lg:hidden">
                {ADMISSION_STEPS.map((step, i) => {
                  const Icon = getIcon(step.iconName);
                  return (
                    <div key={i} data-step-card className="flex gap-5 p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
                      style={{ backgroundColor:'var(--bg-card)', borderColor:'var(--border-subtle)'}}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border-gold)'; e.currentTarget.style.boxShadow='var(--shadow-card)'; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.boxShadow='none'; }}>
                      <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center font-bold text-black font-display flex-shrink-0" style={{ boxShadow:'var(--shadow-gold-sm)' }}>{step.step}</div>
                      <div>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background:'rgba(212,160,23,0.12)', border:'1px solid rgba(212,160,23,0.20)' }}>
                          <Icon size={16} className="text-[#D4A017]" />
                        </div>
                        <h3 className="font-semibold text-base mb-1" style={{ color:'var(--text-primary)' }}>{step.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color:'var(--text-secondary)' }}>{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Desktop grid */}
              <div className="hidden lg:grid grid-cols-5 gap-4">
                {ADMISSION_STEPS.map((step, i) => {
                  const Icon = getIcon(step.iconName);
                  return (
                    <div key={i} data-step-card className="group relative flex flex-col items-center text-center p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-2"
                      style={{ backgroundColor:'var(--bg-card)', borderColor:'var(--border-subtle)'}}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border-gold)'; e.currentTarget.style.boxShadow='var(--shadow-card)'; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.boxShadow='none'; }}>
                      {i < 4 && <div className="absolute top-10 left-full w-4 h-0.5 bg-gold/30 z-10 hidden lg:block" />}
                      <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center font-bold text-black font-display mb-4" style={{ boxShadow:'var(--shadow-gold-sm)' }}>{step.step}</div>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background:'rgba(212,160,23,0.12)', border:'1px solid rgba(212,160,23,0.20)' }}>
                        <Icon size={18} className="text-[#D4A017]" />
                      </div>
                      <h3 className="font-semibold text-sm mb-2 group-hover:text-[#F5C842] transition-colors" style={{ color:'var(--text-primary)' }}>{step.title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color:'var(--text-secondary)' }}>{step.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-12 md:py-24 px-4 md:px-16" style={{ backgroundColor:'var(--bg-section)' }}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <SectionHeader label="Eligibility" title="Admission" highlight="Requirements" />
              <div ref={reqRef} className="space-y-3">
                {REQUIREMENTS.map((req, i) => (
                  <div key={i} data-req className="flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5"
                    style={{ backgroundColor:'var(--bg-card)', borderColor:'var(--border-subtle)'}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border-gold)'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border-subtle)'}>
                    <CheckCircle size={16} className="text-[#D4A017] flex-shrink-0 mt-0.5" />
                    <span className="text-sm" style={{ color:'var(--text-secondary)' }}>{req}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionHeader label="Financial Aid" title="Scholarships &" highlight="Discounts" />
              <div ref={scholRef} className="space-y-4">
                {SCHOLARSHIPS.map((s, i) => {
                  const Icon = getIcon(s.icon);
                  return (
                    <div key={i} data-schol className="group flex gap-4 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
                      style={{ backgroundColor:'var(--bg-card)', borderColor:'var(--border-subtle)'}}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border-gold)'; e.currentTarget.style.boxShadow='var(--shadow-card)'; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.boxShadow='none'; }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:'rgba(212,160,23,0.12)', border:'1px solid rgba(212,160,23,0.20)' }}>
                        <Icon size={18} className="text-[#D4A017]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-semibold text-sm group-hover:text-[#F5C842] transition-colors" style={{ color:'var(--text-primary)' }}>{s.title}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background:'rgba(212,160,23,0.15)', color:'#F5C842', border:'1px solid rgba(212,160,23,0.25)' }}>{s.amount}</span>
                        </div>
                        <p className="text-xs" style={{ color:'var(--text-muted)' }}>{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Batch info */}
        <section className="py-10 md:py-20 px-4 md:px-16" style={{ backgroundColor:'var(--bg-primary)' }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeader label="Upcoming Batches" title="Available" highlight="Schedule" center />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                // { shift:'Morning Batch', time:'9:00 AM – 1:00 PM', days:'Monday – Friday', seats:'25 seats', start:'Feb 15, 2025' },
                { shift:'Evening Batch', time:'2:00 PM – 6:00 PM', days:'Monday – Friday', seats:'25 seats', start:'Feb 15, 2025' },
                { shift:'Weekend Batch', time:'9:00 AM – 5:00 PM', days:'Saturday – Sunday', seats:'20 seats', start:'Feb 22, 2025' },
              ].map((b, i) => (
                <div key={i} className="p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
                  style={{ backgroundColor:'var(--bg-card)', borderColor:i===0?'var(--border-gold)':'var(--border-subtle)' }}>
                  {i===0 && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 inline-block" style={{ background:'rgba(212,160,23,0.15)', color:'#F5C842', border:'1px solid rgba(212,160,23,0.25)' }}>Most Popular</span>}
                  <h3 className="font-display font-bold text-lg mb-3" style={{ color:'var(--text-primary)' }}>{b.shift}</h3>
                  {[{icon:Clock,v:b.time},{icon:Calendar,v:b.days},{icon:Users,v:b.seats},{icon:GraduationCap,v:`Starts: ${b.start}`}].map(({icon:Ic,v},j)=>(
                    <div key={j} className="flex items-center gap-2 text-sm mb-2" style={{ color:'var(--text-secondary)' }}>
                      <Ic size={14} className="text-[#D4A017] flex-shrink-0" />{v}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 md:py-20 px-4 md:px-16 text-center" style={{ backgroundColor:'var(--bg-section)' }}>
          <div ref={ctaRef}>
            <h2 className="font-display text-3xl md:text-4xl font-black text-[#F5C842] mb-4 gsap-hidden">Ready to Start Your Application?</h2>
            <p className="text-base mb-8 max-w-xl mx-auto" style={{ color:'var(--text-secondary)'}}>Applications reviewed within 24 hours. Our team will contact you to guide the next steps.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center gsap-hidden">
              <a href="tel:+922111424786" className="inline-flex items-center gap-2 bg-gold-gradient text-black font-black px-9 py-4 rounded-full text-sm transition-transform duration-200 hover:scale-105" style={{ boxShadow:'var(--shadow-gold)' }}>
                <Phone size={18} />Call for Free Counseling
              </a>
              <a href="/contact" className="inline-flex items-center gap-2 border-2 font-semibold px-9 py-4 rounded-full text-sm transition-colors"
                style={{ borderColor:'var(--border-gold)', color:'var(--text-primary)' }}>Send Inquiry</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
