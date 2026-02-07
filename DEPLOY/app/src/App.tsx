import { useEffect, useState } from 'react';
import { Header } from '@/sections/Header';
import { Hero } from '@/sections/Hero';
import { FlightStatus } from '@/sections/FlightStatus';
import { TerminalMap } from '@/sections/TerminalMap';
import { ServicesDirectory } from '@/sections/ServicesDirectory';
import { Features } from '@/sections/Features';
import { AnalyticsDashboard } from '@/sections/AnalyticsDashboard';
import { Testimonials } from '@/sections/Testimonials';
import { CTASection } from '@/sections/CTASection';
import { Footer } from '@/sections/Footer';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A1628] text-white overflow-x-hidden">
      <Header scrollY={scrollY} />
      <main>
        <Hero />
        <FlightStatus />
        <TerminalMap />
        <ServicesDirectory />
        <Features />
        <AnalyticsDashboard />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
