import { useEffect, useRef, useState } from 'react';
import { Eye, Target, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { imageAssets } from '../../data/imageAssets';

gsap.registerPlugin(ScrollTrigger);

const MOBILE_BP = 1024;

// ─── Mobile sub-component ────────────────────────────────────────────────────
function MobileVisionMission() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const items = section.querySelectorAll<HTMLElement>('.vm-mobile-card');
    
    // Observer for fade-in visibility (pop-up effect)
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Apply pop up effect via CSS class
            entry.target.classList.add('vm-mob--visible', 'vm-mob--expanded');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );

    items.forEach((el) => {
      visibilityObserver.observe(el);
    });

    return () => {
      visibilityObserver.disconnect();
    };
  }, [sectionRef]);

  return (
    <section className="vm-mobile-section" ref={sectionRef as React.RefObject<HTMLElement>}>
      <div ref={containerRef} className="vm-mobile-container">
        {/* Vision Card */}
        <div className="vm-mobile-card">
          <img 
            src={imageAssets.about.visionMission} 
            alt="NAPCO Vision" 
            className="vm-mobile-bg"
          />
          <div className="vm-mobile-blur" />
          <div className="vm-mobile-overlay" />
          <div className="vm-mobile-content">
            <div className="vm-mobile-title">
              <h2>Our Vision</h2>
            </div>
            <div className="vm-mobile-desc">
              <p>
                To be a key player in the printing industry in the pursuit of quality
                &amp; service excellence while earning our employees &amp; customers
                enthusiasm through continuous improvement driven by integrity, team
                work &amp; innovation.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Card */}
        <div className="vm-mobile-card">
          <img 
            src={imageAssets.aboutCompanyIntro.serviceQualityBg} 
            alt="NAPCO Mission" 
            className="vm-mobile-bg"
          />
          <div className="vm-mobile-blur" />
          <div className="vm-mobile-overlay" />
          <div className="vm-mobile-content">
            <div className="vm-mobile-title">
              <h2>Our Mission</h2>
            </div>
            <div className="vm-mobile-desc">
              <p>
                Committed to provide comprehensive printing solutions dedicated to
                excellence in customer service, product quality &amp; its impact
                within the environment, local community &amp; its staff, ensuring profitable growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Desktop sub-component ───────────────────────────────────────────────────
function DesktopVisionMission({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);

  // GSAP Hover Logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const panels = gsap.utils.toArray<HTMLElement>('.vm-accordion-panel', container);
    
    // We use a context to easily clean up GSAP tweens when the component unmounts
    const ctx = gsap.context(() => {
      panels.forEach((panel, i) => {
        const bg = panel.querySelector('.vm-accordion-bg');
        const blurLayer = panel.querySelector('.vm-accordion-blur');
        const overlay = panel.querySelector('.vm-accordion-overlay');
        const desc = panel.querySelector('.vm-accordion-desc');
        const titleArea = panel.querySelector('.vm-accordion-title-area');

        // Animate Panel bounds and internals based on hover state
        if (hoveredIndex === i) {
          // Hovered state
          gsap.to(panel, { flex: '1 1 70%', duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
          gsap.to(bg, { scale: 1.05, xPercent: -2, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
          gsap.to(blurLayer, { opacity: 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
          gsap.to(overlay, { opacity: 1, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
          gsap.to(desc, { autoAlpha: 1, y: 0, duration: 0.5, delay: 0.1, ease: 'power3.out', overwrite: 'auto' });
          gsap.to(titleArea, { scale: 1.05, transformOrigin: 'left center', duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
        } else if (hoveredIndex !== null) {
          // Shrunk state (when something else is hovered)
          gsap.to(panel, { flex: '1 1 30%', duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
          gsap.to(bg, { scale: 1, xPercent: 2, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
          gsap.to(blurLayer, { opacity: 1, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
          gsap.to(overlay, { opacity: 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
          gsap.to(desc, { autoAlpha: 0, y: 20, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
          gsap.to(titleArea, { scale: 0.95, transformOrigin: 'left center', duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
        } else {
          // Default state (nothing hovered)
          gsap.to(panel, { flex: '1 1 50%', duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
          gsap.to(bg, { scale: 1, xPercent: 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
          gsap.to(blurLayer, { opacity: 1, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
          gsap.to(overlay, { opacity: 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
          gsap.to(desc, { autoAlpha: 0, y: 20, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
          gsap.to(titleArea, { scale: 1, transformOrigin: 'left center', duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
        }
      });
    }, container);

    return () => ctx.revert();
  }, [hoveredIndex]);

  return (
    <section className="vm-accordion-section" ref={sectionRef as React.RefObject<HTMLElement>}>
      <div className="vm-accordion-container" ref={containerRef} onMouseLeave={() => setHoveredIndex(0)}>
        
        {/* Panel 1: Vision */}
        <div 
          className="vm-accordion-panel"
          onMouseEnter={() => setHoveredIndex(0)}
          onFocus={() => setHoveredIndex(0)}
          tabIndex={0}
          role="button"
          aria-expanded={hoveredIndex === 0}
          data-cursor-type="accordion"
          data-cursor-label="Explore"
        >
          <div className="vm-accordion-bg-wrapper">
            <img 
              src={imageAssets.about.visionMission} 
              alt="Our Vision Background" 
              className="vm-accordion-bg"
            />
          </div>
          <div className="vm-accordion-blur" />
          <div className="vm-accordion-overlay" />
          <div className="vm-accordion-content">
            <div className="vm-accordion-title-area">
              <div className="vm-accordion-icon">
                <Eye size={24} color="white" />
              </div>
              <h2>Our Vision</h2>
            </div>
            <div className="vm-accordion-desc">
              <p>
                To be a key player in the printing industry in the pursuit of quality
                &amp; service excellence while earning our employees &amp; customers
                enthusiasm through continuous improvement driven by integrity, team
                work &amp; innovation.
              </p>
            </div>
          </div>
        </div>

        {/* Panel 2: Mission */}
        <div 
          className="vm-accordion-panel"
          onMouseEnter={() => setHoveredIndex(1)}
          onFocus={() => setHoveredIndex(1)}
          tabIndex={0}
          role="button"
          aria-expanded={hoveredIndex === 1}
          data-cursor-type="accordion"
          data-cursor-label="Explore"
        >
          <div className="vm-accordion-bg-wrapper">
            <img 
              src={imageAssets.aboutCompanyIntro.serviceQualityBg} 
              alt="Our Mission Background" 
              className="vm-accordion-bg"
            />
          </div>
          <div className="vm-accordion-blur" />
          <div className="vm-accordion-overlay" />
          <div className="vm-accordion-content">
            <div className="vm-accordion-title-area">
              <div className="vm-accordion-icon">
                <Target size={24} color="white" />
              </div>
              <h2>Our Mission</h2>
            </div>
            <div className="vm-accordion-desc">
              <p>
                Committed to provide comprehensive printing solutions dedicated to
                excellence in customer service, product quality &amp; its impact
                within the environment, local community &amp; its staff providing the
                very best in all that we do for the benefit of our staff, customers
                &amp; suppliers, as well as ensuring a profitable growth.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── Root component ──────────────────────────────────────────────────────────
export default function VisionMission() {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth <= MOBILE_BP
  );
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BP);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile
    ? <MobileVisionMission />
    : <DesktopVisionMission sectionRef={sectionRef} />;
}