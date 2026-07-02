'use client';
import { useRef, useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const HERO_IMAGE = '/images/campus/reception-01.jpg';

const CAMPUSES = [
  { 
    name: 'Saudabad Campus', 
    area: 'Saudabad Malir', 
    addr: 'Plot# A-22 Indus Mehran Society, Near 1st P.S.O Petrol Pump, Saudabad Malir, Karachi-75080', 
    phone: '0333-3580212, 0313-2246517', 
    email: 'gcisbte11@gmail.com', 
    hours: 'Mon–Sat: 8 AM – 9 PM',
    mapUrl: 'https://maps.google.com/?q=Saudabad+Malir+Karachi',
    color: '#D4A017' 
  },
  { 
    name: 'Model Colony Campus', 
    area: 'Model Colony', 
    addr: 'Near Railway Crossing, Rabbani Masjid, Model Colony, Karachi', 
    phone: '0322-2511944, 0318-2511944', 
    email: 'gcisbte11@gmail.com', 
    hours: 'Mon–Sat: 8 AM – 9 PM',
    mapUrl: 'https://maps.google.com/?q=Model+Colony+Karachi',
    color: '#60A5FA' 
  },
  { 
    name: 'Shahfaisal Campus', 
    area: 'Shahfaisal Colony', 
    addr: 'Near Fauji Foundation Hospital, Plot# 3/147, Shahfaisal Colony-3, Karachi-75230', 
    phone: '0317-4740335, 0347-2763587', 
    email: 'gcisbte11@gmail.com', 
    hours: 'Mon–Sat: 8 AM – 9 PM',
    mapUrl: 'https://maps.google.com/?q=Shahfaisal+Colony+Karachi',
    color: '#34D399' 
  },
];

export default function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const cardsRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        gsap.fromTo(cardsRef.current.children, 
          { y: 40, opacity: 0 },
          { opacity: 1, y: 0, stagger: 0.15, duration: 0.65, ease: 'power3.out',
            scrollTrigger: { trigger: cardsRef.current, start: 'top 85%', once: true } }
        );
      }
      if (formRef.current) {
        gsap.fromTo(formRef.current, 
          { y: 40, opacity: 0 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: formRef.current, start: 'top 85%', once: true } }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (formError) setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed.');
      setSubmitted(true);
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = { 
    backgroundColor: 'var(--bg-input)', 
    border: '1px solid var(--border-medium)', 
    color: 'var(--text-primary)', 
    borderRadius: '12px', 
    padding: '12px 16px', 
    width: '100%', 
    fontSize: '14px', 
    outline: 'none', 
    transition: 'border-color 0.2s' 
  };

  return (
    <>
      <TopBar />
      <Navbar />
      <main className="pt-[64px] md:pt-[116px]" style={{ backgroundColor: 'var(--bg-primary)' }}>
        
        <PageHero 
          image={HERO_IMAGE} 
          badge="We're Here to Help" 
          title="Get In" 
          highlight="Touch With Us"
          subtitle="Have questions about our programs, admissions, or anything else? We'd love to hear from you." 
        />

        {/* Campus Cards Section */}
        <section className="py-12 md:py-24 px-4 md:px-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeader label="Our Locations" title="Visit Any" highlight="Campus" center />
            
            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {CAMPUSES.map((c, i) => (
                <div 
                  key={i} 
                  className="group rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-2"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-gold)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${c.color}18`, border: `1px solid ${c.color}30` }}>
                    <MapPin size={18} style={{ color: c.color }} />
                  </div>
                  
                  <h3 className="font-display font-bold text-lg mb-1 group-hover:text-[#F5C842] transition-colors" style={{ color: 'var(--text-primary)' }}>{c.name}</h3>
                  <p className="text-xs font-semibold mb-3" style={{ color: '#D4A017' }}>{c.area}</p>
                  
                  <div className="space-y-2 mb-5">
                    <div className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <MapPin size={12} className="text-[#D4A017] flex-shrink-0 mt-0.5" />
                      <span className="flex-1">{c.addr}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Phone size={12} className="text-[#D4A017] flex-shrink-0 mt-0.5" />
                      <span>{c.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Mail size={12} className="text-[#D4A017] flex-shrink-0 mt-0.5" />
                      <span>{c.email}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Clock size={12} className="text-[#D4A017] flex-shrink-0 mt-0.5" />
                      <span>{c.hours}</span>
                    </div>
                  </div>
                  
                  <a 
                    href={c.mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4A017] hover:text-[#F5C842] transition-colors">
                    View on Map <MapPin size={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map + Contact Form Section */}
        <section className="py-10 md:py-20 px-4 md:px-16" style={{ backgroundColor: 'var(--bg-section)' }}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* MAP SECTION */}
            <div>
              <SectionHeader label="Find Us" title="GCI Main" highlight="Campus" />
              <div className="relative rounded-2xl overflow-hidden border" style={{ height: '400px', borderColor: 'var(--border-gold)' }}>
                <iframe
                  title="GCI Main Campus - Saudabad Malir Karachi"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115800!2d67.0011!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e7b3c2e4b4d%3A0x3c0e7e7e7e7e7e7e!2sKarachi!5e0!3m2!1sen!2s!4v1700000000000"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade" />
              </div>
              <div className="mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  <MapPin size={12} className="inline mr-1 text-[#D4A017]" />
                  Plot# A-22 Indus Mehran Society, Saudabad Malir, Karachi-75080
                </p>
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=Saudabad+Malir+Karachi"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-[#D4A017] hover:text-[#F5C842] transition-colors flex items-center gap-1">
                  <MapPin size={12} /> Get Directions
                </a>
              </div>
            </div>

            {/* Contact Form Section */}
            <div ref={formRef} className="gsap-hidden">
              <SectionHeader label="Send A Message" title="Write" highlight="To Us" />
              
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-[400px] rounded-2xl border text-center p-8"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-gold)' }}>
                  <div className="w-16 h-16 rounded-full bg-[#D4A017]/15 border-2 border-[#D4A017]/30 flex items-center justify-center mb-4">
                    <CheckCircle size={30} className="text-[#D4A017]" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>Message Sent!</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Our team will get back to you within 24 hours.</p>
                  <button 
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                    className="mt-4 text-sm text-[#D4A017] hover:text-[#F5C842] transition-colors">
                    Send Another Message →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        value={form.name} 
                        onChange={handleChange} 
                        placeholder="Your full name" 
                        style={inputStyle}
                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(212,160,23,0.5)'} 
                        onBlur={e => e.currentTarget.style.borderColor = 'var(--border-medium)'} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email *</label>
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        value={form.email} 
                        onChange={handleChange} 
                        placeholder="your@email.com" 
                        style={inputStyle}
                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(212,160,23,0.5)'} 
                        onBlur={e => e.currentTarget.style.borderColor = 'var(--border-medium)'} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Phone</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={form.phone} 
                        onChange={handleChange} 
                        placeholder="+92-XXX-XXXXXXX" 
                        style={inputStyle}
                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(212,160,23,0.5)'} 
                        onBlur={e => e.currentTarget.style.borderColor = 'var(--border-medium)'} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Subject *</label>
                      <input 
                        type="text" 
                        name="subject" 
                        required 
                        value={form.subject} 
                        onChange={handleChange} 
                        placeholder="How can we help?" 
                        style={inputStyle}
                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(212,160,23,0.5)'} 
                        onBlur={e => e.currentTarget.style.borderColor = 'var(--border-medium)'} />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Message *</label>
                    <textarea 
                      name="message" 
                      required 
                      rows={5} 
                      value={form.message} 
                      onChange={handleChange} 
                      placeholder="Tell us about your inquiry..." 
                      style={{ ...inputStyle, resize: 'vertical' }}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(212,160,23,0.5)'} 
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--border-medium)'} />
                  </div>
                  
                  {formError && (
                    <div className="flex items-center gap-2 p-3 rounded-xl text-xs"
                      style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                      <Send size={12} />{formError}
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 w-full bg-gold-gradient text-black font-bold py-3.5 rounded-xl text-sm transition-transform duration-200 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed" 
                    style={{ boxShadow: 'var(--shadow-gold)' }}>
                    {submitting
                      ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Sending…</>
                      : <><Send size={16} />Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}