import localFont from 'next/font/local';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider }  from '@/context/AuthContext';
import './globals.css';

/* ── Auto-seed admin account on startup (server only) ─────────────
   Runs once when the server boots. Safe to run repeatedly —
   the seed endpoint checks for existing admin first.
──────────────────────────────────────────────────────────────────── */
async function ensureAdminExists() {
  try {
    const dbConnect = (await import('@/lib/db')).default;
    const conn = await dbConnect();
    if (!conn) return; // No DB configured — skip

    const mongoose = (await import('mongoose')).default;
    const bcrypt   = (await import('bcryptjs')).default;

    const UserSchema = new mongoose.Schema(
      { name:String, email:{ type:String, unique:true }, password:String, phone:String, role:String },
      { collection:'users' }
    );
    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    const exists = await User.findOne({ email:'admin@gmail.com' }).lean();
    if (!exists) {
      const hashed = await bcrypt.hash('Admin@123', 12);
      await User.create({ name:'GCI Admin', email:'admin@gmail.com', password:hashed, phone:'', role:'admin' });
      console.log('[startup] ✓ Admin account seeded: admin@gmail.com');
    }
  } catch (err) {
    console.warn('[startup] Admin seed skipped:', err.message);
  }
}

// Fire and forget — never blocks server startup
ensureAdminExists();

/**
 * Fonts: Google Fonts (Playfair Display + DM Sans) are loaded via CSS @import
 * in globals.css for runtime rendering. The local stubs here satisfy Next.js
 * font optimization at build time. On Vercel (internet access), you can swap
 * these back to `next/font/google` imports for full optimization.
 */
const playfair = localFont({
  src: '../fonts/playfair.woff2',
  variable: '--font-playfair',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  display: 'swap',
});
const dmSans = localFont({
  src: '../fonts/dmsans.woff2',
  variable: '--font-dm-sans',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gci.edu.pk';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  'GCI — Global Computer Institute | Premier Tech Education in Karachi',
    template: '%s | GCI — Global Computer Institute',
  },
  description:
    "Global Computer Institute (GCI) is Karachi's #1 technology training institute. " +
    '3 campuses, 50+ programs including Web Development, AI & ML, Cybersecurity, and Cloud Computing. 15,000+ alumni placed.',
  keywords: [
    'computer institute karachi','IT courses karachi','web development karachi',
    'AI course pakistan','cybersecurity course karachi','GCI institute',
  ],
  authors:   [{ name: 'Global Computer Institute' }],
  creator:   'Global Computer Institute',
  publisher: 'Global Computer Institute',
  openGraph: {
    type: 'website', locale: 'en_PK', url: SITE_URL,
    siteName: 'Global Computer Institute',
    title: 'GCI — Global Computer Institute | Premier Tech Education in Karachi',
    description: "Karachi's #1 computer institute. 50+ programs, 3 campuses.",
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'GCI Institute' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GCI — Global Computer Institute',
    description: "Karachi's #1 computer institute.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' },
  },
};

// Blocking script: sets data-theme before React hydrates — zero flash
const THEME_SCRIPT = `(function(){
  try{
    var s=localStorage.getItem('gci-theme'),
        p=window.matchMedia('(prefers-color-scheme:dark)').matches;
    document.documentElement.setAttribute('data-theme',s||(p?'dark':'light'));
  }catch(e){
    document.documentElement.setAttribute('data-theme','dark');
  }
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      document.documentElement.classList.add('theme-ready');
    });
  });
})();`;

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the blocking script modifies data-theme before
    // React hydrates — React must ignore that attribute difference.
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={SITE_URL} />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      {/* suppressHydrationWarning on body: browser extensions inject attributes */}
      <body className={`${playfair.variable} ${dmSans.variable}`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
