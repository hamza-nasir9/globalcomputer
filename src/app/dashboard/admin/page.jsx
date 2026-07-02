import { Suspense } from 'react';
import AdminDashboardClient from './AdminDashboardClient';

export const metadata = { title: 'Admin Dashboard — GCI' };

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor:'var(--bg-primary)' }}>
        <span className="w-10 h-10 border-2 border-[#D4A017]/30 border-t-[#D4A017] rounded-full animate-spin" />
      </div>
    }>
      <AdminDashboardClient />
    </Suspense>
  );
}
