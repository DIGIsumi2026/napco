import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import '../styles/pages/home.css';
import NavigationBar from '../components/common/NavigationBar';
import Sidebar from '../components/common/Sidebar';
import ScrollToTop from '../components/common/ScrollToTop';
import Hero from '../components/home/Hero';
import AboutPrinting from '../components/home/AboutPrinting';
import ServiceStats from '../components/home/ServiceStats';
import ContactCta from '../components/home/ContactCta';
import ClientLogos from '../components/home/ClientLogos';

import Footer from '../components/common/Footer';
import { shouldUseRichEffects } from '../utils/performance';

const ServicesVisual = lazy(() => import('../components/home/ServicesVisual'));

function DeferredServicesVisual() {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const placeholder = placeholderRef.current;
    if (!placeholder) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setReady(true);
        observer.disconnect();
      }
    }, { rootMargin: '800px 0px' });
    observer.observe(placeholder);
    return () => observer.disconnect();
  }, [ready]);

  if (!ready) return <div ref={placeholderRef} className="services-visual-placeholder" />;
  return <Suspense fallback={<div className="services-visual-placeholder" />}><ServicesVisual /></Suspense>;
}

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!shouldUseRichEffects()) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([
      { gsap },
      { ScrollTrigger },
    ]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        const revealSelector = '[data-reveal]';

        gsap.set(revealSelector, { y: 40, opacity: 0 });
        ScrollTrigger.batch(revealSelector, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              y: 0,
              opacity: 1,
              duration: 0.75,
              ease: 'power3.out',
              stagger: 0.08,
              overwrite: true,
            });
          },
        });

        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
          if (element.closest('.contact-cta')) return;
          gsap.to(element, {
            yPercent: -5,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          });
        });
      });

      cleanup = () => ctx.revert();
    }).catch(() => {});

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <main className="home-page">
      <NavigationBar 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen} 
      />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <Hero />
      <AboutPrinting />
      <ServiceStats/>
      <DeferredServicesVisual />
      <ContactCta/>
      <ClientLogos/>

      <Footer />
      
      <ScrollToTop />
    </main>
  );
}
