import TopBar              from '@/components/layout/TopBar';
import Navbar              from '@/components/layout/Navbar';
import Footer              from '@/components/layout/Footer';
import HeroSection         from '@/components/sections/HeroSection';
import PartnersSection     from '@/components/sections/PartnersSection';
import AboutSection        from '@/components/sections/AboutSection';
import CoursesSection      from '@/components/sections/CoursesSection';
import CategorySection     from '@/components/sections/CategorySection';
import StatsSection        from '@/components/sections/StatsSection';
import WhyChooseUs         from '@/components/sections/WhyChooseUs';
import FacultySection      from '@/components/sections/FacultySection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import AdmissionsSection   from '@/components/sections/AdmissionsSection';
import CtaSection          from '@/components/sections/CtaSection';

export default function HomePage() {
  return (
    <main style={{ background:'var(--bg)', color:'var(--text-h)', overflowX:'hidden' }}>
      <TopBar />
      <Navbar />
      {/* pt accounts for TopBar (37px on md+) + Navbar (70px on md+) = 107px total */}
      <div className="pt-[64px] md:pt-[116px]">
        <HeroSection />
        <PartnersSection />
        <AboutSection />
        <CoursesSection />
        <CategorySection />
        <StatsSection />
        <WhyChooseUs />
        <FacultySection />
        <TestimonialsSection />
        <AdmissionsSection />
        <CtaSection />
        <Footer />
      </div>
    </main>
  );
}
