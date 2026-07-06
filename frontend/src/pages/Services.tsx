import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import '../styles/pages/services.css';

import CustomCursor from '../components/common/CustomCursor';
import NavigationBar from '../components/common/NavigationBar';
import Sidebar from '../components/common/Sidebar';
import ScrollToTop from '../components/common/ScrollToTop';
import Footer from '../components/common/Footer';

import ServicesHero from '../components/services/ServicesHero';
import ServiceStatCards from '../components/services/ServiceStatCards';
import AboutMachineModel from '../components/about/AboutMachineModel';
import QualityPrintingSection from '../components/services/QualityPrintingSection';


gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 54, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 86%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="services-page">
      <CustomCursor />

      <NavigationBar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <ServicesHero />
      <ServiceStatCards />
      <AboutMachineModel/>
      <QualityPrintingSection/>

      <Footer />
      <ScrollToTop />
    </main>
  );
}