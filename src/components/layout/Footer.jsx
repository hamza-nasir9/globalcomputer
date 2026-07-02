'use client';
import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react';

/* KCA Footer: dark navy, 4 columns, orange heading underlines, campus info */
const QUICK = [
  { l:'Home', href:'/' },{ l:'About Us', href:'/about' },{ l:'Courses', href:'/courses' },
  { l:'Admissions', href:'/admissions' },{ l:'Campuses', href:'/campuses' },
  { l:'Gallery', href:'/gallery' },{ l:'Contact', href:'/contact' },
];

const PROGRAMS = [
  'Web Development','Graphic Design','AI & Machine Learning',
  'Mobile App Development','Cybersecurity','Cloud Computing','Data Science','Video Editing',
];

const CAMPUSES = [
  { name:'Saudabad Campus',    phone:'0333-3580212, 0313-2246517',  addr:'Plot# A-22 Indus Mehran Society, Saudabad Malir, Karachi' },
  { name:'Model Colony Campus',phone:'0322-2511944, 0318-2511944',  addr:'Near Railway Crossing, Rabbani Masjid, Model Colony, Karachi' },
  { name:'Shahfaisal Campus',  phone:'0317-4740335, 0347-2763587',  addr:'Near Fauji Foundation Hospital, Shahfaisal Colony-3, Karachi' },
];

const SOCIALS = [
  { Icon:Facebook, href:'#' },{ Icon:Instagram, href:'#' },
  { Icon:Linkedin, href:'#' },{ Icon:Youtube,   href:'#' },{ Icon:Twitter, href:'#' },
];

function FootCol({ title, children }) {
  return (
    <div>
      <h4 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:17, color:'#fff', marginBottom:16, paddingBottom:12, borderBottom:'1px solid rgba(255,255,255,0.08)', position:'relative' }}>
        {title}
        <span style={{ position:'absolute', bottom:-1, left:0, width:40, height:2, background:'#f7941d', borderRadius:2 }} />
      </h4>
      {children}
    </div>
  );
}

export default function Footer() {
  return (
    <footer>
      {/* KCA: "Have any Question?" top strip */}
      <div style={{ background:'linear-gradient(135deg,#00242B,#003d30)', padding:'28px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:16 }}>
          <div>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:20, color:'#fff', marginBottom:4 }}>Have any Question?</h3>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.55)' }}>Our counselors are ready to help you choose the right program</p>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
            <a href="tel:+923333580212" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 22px', borderRadius:8, border:'2px solid #f7941d', color:'#f7941d', fontWeight:700, fontSize:13, textDecoration:'none', transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='#f7941d';e.currentTarget.style.color='#fff';}}
              onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#f7941d';}}>
              <Phone size={15} />0333-3580212
            </a>
            <a href="/admission-form" className="btn-orange px-6 py-2.5 rounded-lg text-sm">Apply Online</a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div style={{ background:'#081c2e' }}>
        <div style={{ height:3, background:'linear-gradient(90deg,transparent,#f7941d,transparent)' }} />
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'52px 24px 24px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'32px 40px', marginBottom:40 }}>

            {/* Brand */}
            <div>
              <Link href="/">
                <img src="/images/logo-light.png" alt="GCI" style={{ height:40, objectFit:'contain', filter:'brightness(0) invert(1)', marginBottom:18 }} />
              </Link>
              <p style={{ fontSize:13, lineHeight:1.80, color:'rgba(255,255,255,0.50)', marginBottom:20 }}>
                Global Computer Institute is one of the most trusted IT training institutes in Karachi. Quality education, experienced faculty, and career-focused programs since 2005.
              </p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {SOCIALS.map(({ Icon, href }, i) => (
                  <a key={i} href={href} style={{ width:34, height:34, borderRadius:8, border:'1px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.45)', transition:'all 0.2s', textDecoration:'none' }}
                    onMouseEnter={e=>{e.currentTarget.style.background='#f7941d';e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='#f7941d';}}
                    onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(255,255,255,0.45)';e.currentTarget.style.borderColor='rgba(255,255,255,0.12)';}}>
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <FootCol title="Quick Links">
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:8 }}>
                {QUICK.map(({ l, href }) => (
                  <li key={l}>
                    <Link href={href} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'rgba(255,255,255,0.50)', textDecoration:'none', transition:'color 0.2s' }}
                      onMouseEnter={e=>e.currentTarget.style.color='#f7941d'}
                      onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.50)'}>
                      <span style={{ width:5, height:5, borderRadius:'50%', background:'rgba(247,148,29,0.50)', flexShrink:0 }} />{l}
                    </Link>
                  </li>
                ))}
              </ul>
            </FootCol>

            {/* Programs */}
            <FootCol title="Our Programs">
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:8 }}>
                {PROGRAMS.map((p) => (
                  <li key={p}>
                    <Link href="/courses" style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'rgba(255,255,255,0.50)', textDecoration:'none', transition:'color 0.2s' }}
                      onMouseEnter={e=>e.currentTarget.style.color='#f7941d'}
                      onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.50)'}>
                      <span style={{ width:5, height:5, borderRadius:'50%', background:'rgba(247,148,29,0.50)', flexShrink:0 }} />{p}
                    </Link>
                  </li>
                ))}
              </ul>
            </FootCol>

            {/* Contact */}
            <FootCol title="Contact Us">
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {CAMPUSES.slice(0,1).map(c=>(
                  <div key={c.name}>
                    <p style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.80)', marginBottom:4 }}>{c.name}</p>
                    <div style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:12, color:'rgba(255,255,255,0.45)', marginBottom:6 }}>
                      <MapPin size={12} color="#f7941d" style={{ flexShrink:0, marginTop:1 }} />{c.addr}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'#f7941d' }}>
                      <Phone size={11} />{c.phone}
                    </div>
                  </div>
                ))}
                <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'rgba(255,255,255,0.45)' }}>
                  <Mail size={12} color="#f7941d" />gcisbte11@gmail.com
                </div>
              </div>
            </FootCol>
          </div>

          {/* Campus cards strip */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:12, marginBottom:28, paddingTop:24, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            {CAMPUSES.map(c=>(
              <div key={c.name} style={{ borderRadius:10, padding:'12px 16px', border:'1px solid rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.03)' }}>
                <p style={{ fontSize:12, fontWeight:700, color:'#fff', marginBottom:4 }}>{c.name}</p>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.40)', lineHeight:1.55, marginBottom:6 }}>{c.addr}</p>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'#f7941d' }}><Phone size={10} />{c.phone}</div>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:8, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.30)' }}>
              © {new Date().getFullYear()} Global Computer Institute (GCI). All rights reserved.
            </p>
            <div style={{ display:'flex', gap:16 }}>
              {['Privacy Policy','Terms of Use'].map(t=>(
                <Link key={t} href="#" style={{ fontSize:11, color:'rgba(255,255,255,0.30)', textDecoration:'none', transition:'color 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.color='#f7941d'}
                  onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.30)'}>
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
