'use client';
/**
 * DashLayout — Dashboard shell with sidebar + topbar.
 *
 * HOOKS RULE FIX:
 *   All hooks (useState, useEffect, useCallback, useRef) must be called
 *   UNCONDITIONALLY — never after a conditional return.
 *   Previous version had useCallback after `if (authLoading || !user) return`.
 *   This caused "Rendered fewer hooks than expected" on logout.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, ClipboardList,
  LogOut, Menu, X, ChevronRight, ChevronLeft, Sun, Moon, ExternalLink,
} from 'lucide-react';
import { useAuth }  from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const ADMIN_NAV = [
  { icon: LayoutDashboard, label: 'Overview',    href: '/dashboard/admin'                   },
  { icon: Users,           label: 'Students',    href: '/dashboard/admin?tab=students'      },
  { icon: ClipboardList,   label: 'Admissions',  href: '/dashboard/admin?tab=admissions'    },
];

export default function DashLayout({ children, activeTab }) {
  // ─── ALL HOOKS MUST COME FIRST — before any conditional return ───────────
  const { user, loading: authLoading, logout } = useAuth();
  const { theme, toggleTheme }                 = useTheme();
  const router   = useRouter();
  const pathname = usePathname();
  const isDark   = theme === 'dark';

  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // isActive must be useCallback, defined here — not after any return
  const isActive = useCallback((href) => {
    if (href.includes('?tab=')) {
      return activeTab === href.split('?tab=')[1];
    }
    return !activeTab && pathname === href;
  }, [activeTab, pathname]);

  /* Auth guard — waits for authLoading before redirecting.
     This prevents the back-navigation crash where user=null briefly
     on re-mount before localStorage is read. */
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (user.role !== 'admin') {
      router.replace('/');
    }
  }, [user, authLoading, pathname, router]);

  /* Close profile dropdown on outside click */
  useEffect(() => {
    if (!profileOpen) return;
    const fn = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [profileOpen]);

  /* Lock body scroll when mobile sidebar open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // ─── END OF HOOKS SECTION ────────────────────────────────────────────────

  /* Loading state: show spinner while auth resolves from localStorage */
  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <span className="w-10 h-10 border-2 border-[#D4A017]/30 border-t-[#D4A017] rounded-full animate-spin" />
      </div>
    );
  }

  /* After logout: user=null, loading=false — redirect effect fires above.
     Return null here to avoid rendering with null user (no hooks issue since
     all hooks are already declared above). */
  if (!user) return null;

  // ─── Variables that depend on user (safe after the null check above) ─────
  const navLinks = ADMIN_NAV;
  const dashHref = '/dashboard/admin';

  function handleLogout() {
    setProfileOpen(false);
    setMobileOpen(false);
    logout();
    router.replace('/');
  }

  // ─── Sidebar content (inner component — not a hook, just JSX factory) ────
  function SidebarContent({ isMobile = false }) {
    return (
      <div className="flex flex-col h-full">

        {/* Logo row */}
        <div
          className="flex items-center gap-3 px-4 border-b flex-shrink-0"
          style={{ borderColor: 'var(--border-subtle)', minHeight: 64 }}
        >
          <div
            className="w-8 h-8 rounded-xl bg-gold-gradient flex-shrink-0 flex items-center justify-center font-display font-black text-black text-sm"
            style={{ boxShadow: 'var(--shadow-gold-sm)' }}
          >
            G
          </div>

          {(!collapsed || isMobile) && (
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold text-sm leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
                GCI Institute
              </p>
              <p className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {user.role === 'admin' ? 'Admin Panel' : 'Student Portal'}
              </p>
            </div>
          )}

          {!isMobile ? (
            <button
              onClick={() => setCollapsed(c => !c)}
              className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg-card-hover)]"
              style={{ color: 'var(--text-muted)' }}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          ) : (
            <button
              onClick={() => setMobileOpen(false)}
              className="ml-auto w-7 h-7 flex items-center justify-center"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* User chip */}
        <div
          className={`mx-3 my-2 rounded-2xl flex items-center gap-2.5 flex-shrink-0 ${
            collapsed && !isMobile ? 'p-2 justify-center' : 'p-2.5'
          }`}
          style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="w-8 h-8 rounded-full bg-gold-gradient flex-shrink-0 flex items-center justify-center font-bold text-black text-xs">
            {user.name?.[0]?.toUpperCase()}
          </div>
          {(!collapsed || isMobile) && (
            <>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {user.name}
                </p>
                <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                  {user.email}
                </p>
              </div>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{
                  background: user.role === 'admin' ? 'rgba(212,160,23,.15)' : 'rgba(96,165,250,.15)',
                  color:      user.role === 'admin' ? '#F5C842' : '#60A5FA',
                  border:    `1px solid ${user.role === 'admin' ? 'rgba(212,160,23,.3)' : 'rgba(96,165,250,.3)'}`,
                }}
              >
                {user.role}
              </span>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-1 overflow-y-auto overflow-x-hidden">
          {(!collapsed || isMobile) && (
            <p className="text-[9px] font-bold uppercase tracking-wider px-2 py-1.5" style={{ color: 'var(--text-muted)' }}>
              Menu
            </p>
          )}
          {navLinks.map(({ icon: Icon, label, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={label}
                href={href}
                onClick={() => isMobile && setMobileOpen(false)}
                title={collapsed && !isMobile ? label : undefined}
                className={`flex items-center rounded-xl mb-0.5 text-sm font-medium transition-all duration-150 ${
                  collapsed && !isMobile ? 'px-2 py-3 justify-center' : 'gap-3 px-3 py-2.5'
                }`}
                style={
                  active
                    ? { background: 'linear-gradient(135deg,rgba(212,160,23,.18),rgba(212,160,23,.07))', color: '#F5C842', border: '1px solid rgba(212,160,23,.25)' }
                    : { color: 'var(--text-secondary)', border: '1px solid transparent' }
                }
                onMouseEnter={e => { if (!active) { e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
              >
                <Icon size={16} className={active ? 'text-[#D4A017] flex-shrink-0' : 'flex-shrink-0'} />
                {(!collapsed || isMobile) && (
                  <span className="truncate flex-1">{label}</span>
                )}
                {(!collapsed || isMobile) && active && (
                  <ChevronRight size={12} className="ml-auto text-[#D4A017] flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-2 pb-3 pt-2 border-t space-y-0.5 flex-shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
          <Link
            href="/"
            title={collapsed && !isMobile ? 'Back to website' : undefined}
            className={`flex items-center rounded-xl text-sm transition-all duration-150 ${
              collapsed && !isMobile ? 'px-2 py-3 justify-center' : 'gap-3 px-3 py-2.5'
            }`}
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <ExternalLink size={15} className="flex-shrink-0" />
            {(!collapsed || isMobile) && <span>Back to Website</span>}
          </Link>

          <button
            onClick={handleLogout}
            title={collapsed && !isMobile ? 'Logout' : undefined}
            className={`w-full flex items-center rounded-xl text-sm text-red-400 hover:text-red-300 transition-all duration-150 ${
              collapsed && !isMobile ? 'px-2 py-3 justify-center' : 'gap-3 px-3 py-2.5'
            }`}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,.08)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={15} className="flex-shrink-0" />
            {(!collapsed || isMobile) && <span>Logout</span>}
          </button>
        </div>
      </div>
    );
  }

  // ─── Main layout ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)' }}>

      {/* Desktop sidebar — sticky, full height */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 border-r sticky top-0 h-screen overflow-hidden transition-[width] duration-300 ease-in-out"
        style={{
          width: collapsed ? 68 : 256,
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={e => e.target === e.currentTarget && setMobileOpen(false)}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="relative z-10 w-64 h-full flex flex-col"
            style={{ backgroundColor: 'var(--bg-card)', borderRight: '1px solid var(--border-gold)' }}
          >
            <SidebarContent isMobile />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header
          className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6 border-b flex-shrink-0"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', height: 64 }}
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1.5 rounded-lg transition-colors hover:bg-[var(--bg-card-hover)]"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs min-w-0" style={{ color: 'var(--text-muted)' }}>
            <span className="hidden sm:inline">GCI</span>
            <span className="hidden sm:inline">/</span>
            <span className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {user.role === 'admin' ? 'Admin' : 'Student'} Dashboard
            </span>
          </div>

          {/* Right controls */}
          <div className="ml-auto flex items-center gap-2 flex-shrink-0">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200"
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-gold)'; e.currentTarget.style.color = '#D4A017'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Profile button + dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(p => !p)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-200"
                style={{ borderColor: profileOpen ? 'var(--border-gold)' : 'var(--border-medium)' }}
                aria-label="Profile menu"
                aria-expanded={profileOpen}
              >
                <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center font-bold text-black text-xs flex-shrink-0">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate" style={{ color: 'var(--text-primary)' }}>
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 rounded-2xl border z-50 overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-gold)', boxShadow: 'var(--shadow-card)' }}
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>
                  <div className="py-1">
                    {[
                      { label: 'Dashboard',  href: dashHref },
                      { label: 'My Profile', href: `${dashHref}?tab=profile` },
                    ].map(({ label, href }) => (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        {label}
                      </Link>
                    ))}
                    <Link
                      href="/"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      Back to Website
                    </Link>
                    <hr style={{ borderColor: 'var(--border-subtle)', margin: '4px 0' }} />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-red-400 hover:text-red-300 transition-colors"
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,.07)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
