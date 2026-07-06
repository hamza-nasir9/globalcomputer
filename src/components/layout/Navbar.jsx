'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Sun, Moon, LogIn, LogOut, GraduationCap, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth }  from '@/context/AuthContext';
import { gsap } from '@/lib/gsap';

const LINKS = [
  { label: 'Home',       href: '/' },
  { label: 'About Us',   href: '/about' },
  { label: 'Courses',    href: '/courses' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Campuses',   href: '/campuses' },
  { label: 'Gallery',    href: '/gallery' },
  { label: 'Contact',    href: '/contact' },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout }       = useAuth();
  const pathname  = usePathname();
  const router    = useRouter();
  const navRef    = useRef(null);
  const mobileRef = useRef(null);
  const profileRef= useRef(null);
  const isDark    = theme === 'dark';

  useEffect(() => {
    gsap.fromTo(navRef.current, { y: -60 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const el = mobileRef.current;
    if (!el) return;
    if (menuOpen) {
      el.style.display = 'flex';
      gsap.fromTo(el, { x: '100%' }, { x: '0%', duration: 0.28, ease: 'power3.out' });
      gsap.fromTo(el.querySelectorAll('[data-ml]'), { x: 20, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.05, delay: 0.1, duration: 0.25 });
    } else {
      gsap.to(el, { x: '100%', duration: 0.22, ease: 'power2.in', onComplete: () => { if (el) el.style.display = 'none'; } });
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!profileOpen) return;
    const fn = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [profileOpen]);

  function handleLogout() { logout(); setProfileOpen(false); setMenuOpen(false); router.push('/'); }

  const navBg = isDark
    ? 'bg-[#0d1b2a]'
    : scrolled ? 'bg-white' : 'bg-white';

  return (
    <>
      {/* KCA Navbar: white bg, logo left, links center-ish, apply right.
          On scroll, the navbar slides up to top:0 (topbar collapses) so there's
          no gap between viewport top and navbar while scrolling. */}
      <nav ref={navRef}
        className={`fixed top-0 md:top-[46px] left-0 right-0 z-50 kca-nav ${scrolled ? 'scrolled md:!top-0' : ''} ${navBg}`}
        style={{
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #eef0f4',
          transition: 'top 0.28s ease',
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 h-[64px] md:h-[70px] flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img src="/images/logo-light.png" alt="Global Computer Institute"
              className="h-10 md:h-11 w-auto object-contain"
              style={{ filter: isDark ? 'brightness(0) invert(1)' : 'none' }} />
          </Link>

          {/* Desktop nav links — center */}
          <ul className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {[...LINKS, ...(user ? [{ label: 'Track ID', href: '/track' }] : [])].map(({ label, href }) => {
              const active = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <li key={label}>
                  <Link href={href} className={`kca-nav-link ${active ? 'active' : ''}`}>{label}</Link>
                </li>
              );
            })}
          </ul>

          {/* Right: theme + auth */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <button onClick={toggleTheme}
              className="w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:border-[#f7941d] hover:text-[#f7941d]"
              style={{ borderColor: 'var(--border-c)', color: 'var(--text-b)' }}>
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {user ? (
              <div className="relative" ref={profileRef}>
                <button onClick={() => setProfileOpen(p => !p)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all hover:border-[#f7941d]"
                  style={{ borderColor: 'var(--border-c)', background: 'var(--bg-soft)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: 'var(--kca-orange)' }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold max-w-[80px] truncate" style={{ color: 'var(--text-h)' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={12} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-sm)' }} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border overflow-hidden z-50 shadow-lg"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border-c)' }}>
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-c)' }}>
                      <p className="text-sm font-bold truncate" style={{ color: 'var(--text-h)' }}>{user.name}</p>
                      <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-sm)' }}>{user.email}</p>
                    </div>
                    <div className="py-1">
                      {user.role === 'admin' && (
                        <Link href="/dashboard/admin" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-orange-50 transition-colors"
                          style={{ color: 'var(--text-b)' }}>
                          <LayoutDashboard size={14} />Admin Dashboard
                        </Link>
                      )}
                      <hr style={{ borderColor: 'var(--border-c)' }} />
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut size={14} />Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login"
                  className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-lg border transition-all hover:border-[#f7941d] hover:text-[#f7941d]"
                  style={{ borderColor: 'var(--border-c)', color: 'var(--text-h)' }}>
                  <LogIn size={14} />Login
                </Link>
                <Link href="/admission-form" className="btn-orange text-sm px-5 py-2.5 rounded-lg">
                  <GraduationCap size={15} />Apply Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <button onClick={toggleTheme}
              className="w-8 h-8 rounded-full border flex items-center justify-center"
              style={{ borderColor: 'var(--border-c)', color: 'var(--text-b)' }}>
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button onClick={() => setMenuOpen(o => !o)}
              className="p-1.5 rounded-lg" style={{ color: 'var(--text-h)' }}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div ref={mobileRef}
        className="fixed inset-0 z-40 lg:hidden flex-col pt-20 pb-8 px-6 overflow-y-auto"
        style={{ display: 'none', background: 'var(--bg)' }}>
        <button onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(247,148,29,0.10)', border: '1px solid rgba(247,148,29,0.25)', color: '#f7941d' }}>
          <X size={20} />
        </button>
        <img src="/images/logo-light.png" alt="GCI" data-ml className="h-9 w-auto mb-6"
          style={{ filter: isDark ? 'brightness(0) invert(1)' : 'none' }} />
        <div className="flex flex-col gap-1 mb-8">
          {[...LINKS, ...(user ? [{ label: 'Track ID', href: '/track' }] : [])].map(({ label, href }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link key={label} href={href} data-ml onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-bold transition-all"
                style={{
                  color: active ? '#f7941d' : 'var(--text-h)',
                  background: active ? 'rgba(247,148,29,0.08)' : 'transparent',
                }}>
                {label}
              </Link>
            );
          })}
        </div>
        <div data-ml className="flex flex-col gap-3 max-w-xs">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/dashboard/admin" onClick={() => setMenuOpen(false)} className="btn-border py-3 rounded-xl w-full">
                  <LayoutDashboard size={15} />Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-sm text-red-500" style={{ borderColor: 'rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.04)' }}>
                <LogOut size={15} />Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="btn-border py-3 rounded-xl w-full justify-center">
                <LogIn size={15} />Login
              </Link>
              <Link href="/admission-form" onClick={() => setMenuOpen(false)} className="btn-orange py-3 rounded-xl w-full justify-center">
                <GraduationCap size={15} />Apply Now
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
