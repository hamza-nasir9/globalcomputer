'use client';
import { useState, useEffect } from 'react';
import { Phone, MapPin, Mail, Facebook, Linkedin, Youtube, Instagram } from 'lucide-react';

export default function TopBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const fn = () => setHidden(window.scrollY > 20);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div
      className="hidden md:block"
      style={{
        height: hidden ? 0 : 46,
        overflow: 'hidden',
        opacity: hidden ? 0 : 1,
        transition: 'height 0.28s ease, opacity 0.2s ease',
        background: 'var(--topbar-bg)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
      <div
        className="max-w-7xl mx-auto px-6 lg:px-14 flex items-center justify-between gap-6"
        style={{ height: 46 }}>

        {/* LEFT — contact info */}
        <div className="flex items-center gap-6">
          <a href="tel:+923333580212"
            className="flex items-center gap-2 transition-colors hover:text-[#f7941d]"
            style={{ color: 'rgba(255,255,255,0.80)', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            <Phone size={13} color="#f7941d" />
            <span>0333-3580212</span>
          </a>

          <span style={{ color: 'rgba(255,255,255,0.20)' }}>|</span>

          <a href="tel:+923132246517"
            className="flex items-center gap-2 transition-colors hover:text-[#f7941d]"
            style={{ color: 'rgba(255,255,255,0.80)', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            <Phone size={13} color="#f7941d" />
            <span>0313-2246517</span>
          </a>

          <span style={{ color: 'rgba(255,255,255,0.20)' }} className="hidden lg:block">|</span>

          <a href="mailto:gcisbte11@gmail.com"
            className="items-center gap-2 transition-colors hover:text-[#f7941d] hidden lg:flex"
            style={{ color: 'rgba(255,255,255,0.80)', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            <Mail size={13} color="#f7941d" />
            <span>gcisbte11@gmail.com</span>
          </a>

          <span style={{ color: 'rgba(255,255,255,0.20)' }} className="hidden xl:block">|</span>

          <span className="items-center gap-2 hidden xl:flex"
            style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 500 }}>
            <MapPin size={13} color="#f7941d" />
            Saudabad Malir · Model Colony · Shahfaisal — Karachi
          </span>
        </div>

        {/* RIGHT — social icons */}
        <div className="flex items-center gap-1">
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 500, marginRight: 8 }}>
            Follow Us:
          </span>
          {[
            { Icon: Facebook,  href: 'https://facebook.com',  label: 'Facebook' },
            { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
            { Icon: Youtube,   href: 'https://youtube.com',   label: 'YouTube' },
            { Icon: Linkedin,  href: 'https://linkedin.com',  label: 'LinkedIn' },
          ].map(({ Icon, href, label }) => (
            <a key={label} href={href} aria-label={label}
              className="flex items-center justify-center rounded transition-all hover:scale-110"
              style={{ width: 30, height: 30, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f7941d'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}>
              <Icon size={15} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
