import { Suspense } from 'react';
import RegisterClient from './RegisterClient';

export const metadata = {
  title: 'Create Account | Global Computer Institute',
};

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <span className="w-8 h-8 border-2 border-[#D4A017]/30 border-t-[#D4A017] rounded-full animate-spin" />
      </div>
    }>
      <RegisterClient />
    </Suspense>
  );
}
