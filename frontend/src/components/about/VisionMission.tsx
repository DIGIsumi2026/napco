import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { imageAssets } from '../../data/imageAssets';

gsap.registerPlugin(ScrollTrigger);

const MOBILE_BP = 1024;

// ─── Mobile sub-component ────────────────────────────────────────────────────
function MobileVisionMission({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const items = section.querySelectorAll<HTMLElement>('[data-vm-mob-anim]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('vm-mob--visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionRef]);

  return (
    <section className="vision-mission vision-mission--mobile" ref={sectionRef as React.RefObject<HTMLElement>}>
      <div className="vision-mission__mobile-image" data-vm-mob-anim>
        <img src={imageAssets.about.visionMission} alt="NAPCO Vision and Mission" />
      </div>
      <div className="vision-mission__mobile-list">
        <div className="vision-mission__content" data-vm-mob-anim>
          <span className="vision-mission__eyebrow">Our Vision</span>
          <h2>Driven by quality, service excellence and innovation.</h2>
          <p>
            To be a key player in the printing industry in the pursuit of quality
            &amp; service excellence while earning our employees &amp; customers
            enthusiasm through continues improvement driven by integrity, team
            work &amp; innovation.
          </p>
        </div>
        <div className="vision-mission__content" data-vm-mob-anim>
          <span className="vision-mission__eyebrow">Our Mission</span>
          <h2>
            Comprehensive printing solutions with responsibility and growth.
          </h2>
          <p>
            Committed to provide comprehensive printing solution dedicated to
            excellence in customer service, product quality &amp; its impact
            within the environment, local community &amp; its staff providing the
            very best in all that we do for the benefit of our staff, customers
            &amp; suppliers, as well as ensuring a profitable growth.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Desktop sub-component ───────────────────────────────────────────────────
function DesktopVisionMission({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  return (
    <>
      <section className="about-vision-section" ref={sectionRef as React.RefObject<HTMLElement>}>
        <div className="about-vision-section__bg" data-parallax style={{ backgroundImage: `url(${imageAssets.about.visionMission})` }} />
        <div className="about-vision-section__overlay" />
        <div className="about-vision-section__content">
          <span className="about-section-eyebrow" data-reveal>Our Vision</span>
          <h2 data-reveal>Driven by quality, service excellence and innovation.</h2>
          <p data-reveal>
            To be a key player in the printing industry in the pursuit of quality
            &amp; service excellence while earning our employees &amp; customers
            enthusiasm through continues improvement driven by integrity, team
            work &amp; innovation.
          </p>
        </div>
      </section>

      <section className="about-mission-section">
        <div className="about-mission-section__bg" data-parallax style={{ backgroundImage: `url(${imageAssets.about.visionMission})` }} />
        <div className="about-mission-section__overlay" />
        <div className="about-mission-section__content">
          <span className="about-section-eyebrow" data-reveal>Our Mission</span>
          <h2 data-reveal>
            Comprehensive printing solutions with responsibility and growth.
          </h2>
          <p data-reveal>
            Committed to provide comprehensive printing solution dedicated to
            excellence in customer service, product quality &amp; its impact
            within the environment, local community &amp; its staff providing the
            very best in all that we do for the benefit of our staff, customers
            &amp; suppliers, as well as ensuring a profitable growth.
          </p>
        </div>
      </section>
    </>
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
    ? <MobileVisionMission sectionRef={sectionRef} />
    : <DesktopVisionMission sectionRef={sectionRef} />;
}