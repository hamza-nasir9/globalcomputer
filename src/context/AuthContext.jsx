'use client';
/**
 * AuthContext — authentication via /api/auth/* (MongoDB) always.
 * Session persisted in localStorage (client-only, no cookies needed).
 * User shape: { id, name, email, phone, role: 'student'|'admin', createdAt }
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext({
  user: null, loading: true,
  login: async () => {}, register: async () => {}, logout: () => {},
});

const STORAGE_KEY = 'gci_user';

/* ── API helpers (always talk to MongoDB via API routes) ─────────── */
async function apiLogin({ email, password }) {
  const res  = await fetch('/api/auth/login', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed. Please try again.');
  const u = data.user;
  return { ...u, id: String(u._id || u.id) };
}

async function apiRegister({ name, email, password, phone }) {
  const res  = await fetch('/api/auth/register', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ name, email, password, phone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed. Please try again.');
  const u = data.user;
  return { ...u, id: String(u._id || u.id) };
}

/* ── Provider ─────────────────────────────────────────────────────── */
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  /* Restore session from localStorage on mount */
  useEffect(() => {
    if (typeof window === 'undefined') { setLoading(false); return; }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure id field is always a string
        if (parsed) setUser({ ...parsed, id: String(parsed._id || parsed.id || '') });
      }
    } catch { /* corrupted storage — ignore */ }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const safe = await apiLogin(credentials);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    setUser(safe);
    return safe;
  }, []);

  const register = useCallback(async (data) => {
    const safe = await apiRegister(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    setUser(safe);
    return safe;
  }, []);

  const logout = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
