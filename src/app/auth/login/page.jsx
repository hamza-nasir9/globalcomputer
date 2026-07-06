import { Suspense } from 'react';
import LoginClient from './LoginClient';

export const metadata = { title: 'Login — GCI Global Computer Institute' };

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <span className="w-8 h-8 border-2 border-[#D4A017]/30 border-t-[#D4A017] rounded-full animate-spin" />
      </div>
    }>
      <LoginClient />
    </Suspense>
  );
}
