'use client';
/**
 * ThemeContext — hydration-safe.
 *
 * Rule: useState initializers run on the SERVER where document is undefined.
 * We must ALWAYS start with 'dark' (matching the blocking script default)
 * then sync to the real value in useEffect after mount.
 */
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  mounted: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  // Always 'dark' on first render (server + client) — prevents hydration mismatch
  const [theme,   setTheme]   = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Sync from DOM after mount (blocking script already set data-theme correctly)
    const real = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(real);
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('gci-theme', next); } catch (_) {}
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, mounted, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
