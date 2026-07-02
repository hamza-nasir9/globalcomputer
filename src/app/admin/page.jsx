/**
 * /admin  — Legacy admin route.
 * Redirects to the new /dashboard/admin for backward compatibility.
 */
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminLegacyRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/auth/login?redirect=/dashboard/admin');
    } else if (user.role === 'admin') {
      router.replace('/dashboard/admin');
    } else {
      router.replace('/');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor:'var(--bg-primary)' }}>
      <span className="w-10 h-10 border-2 border-[#D4A017]/30 border-t-[#D4A017] rounded-full animate-spin" />
    </div>
  );
}
