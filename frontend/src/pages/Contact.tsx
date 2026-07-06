import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import '../styles/pages/contact.css';

import CustomCursor from '../components/common/CustomCursor';
import NavigationBar from '../components/common/NavigationBar';
import Sidebar from '../components/common/Sidebar';
import ScrollToTop from '../components/common/ScrollToTop';
import Footer from '../components/common/Footer';

import ContactHero from '../components/contact/ContactHero';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
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
    <main className="contact-page">
      <CustomCursor />

      <NavigationBar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <ContactHero />

      <Footer />
      <ScrollToTop />
    </main>
  );
}