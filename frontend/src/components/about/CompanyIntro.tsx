import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { imageAssets } from '../../data/imageAssets';

gsap.registerPlugin(ScrollTrigger);

const MOBILE_BP = 1024;

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

// ─── Mobile sub-component ────────────────────────────────────────────────────
function MobileCompanyIntro({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const items = section.querySelectorAll<HTMLElement>('[data-ci-mob-anim]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('ci-mob--visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionRef]);

  return (
    <section className="company-intro company-intro--mobile" ref={sectionRef as React.RefObject<HTMLElement>}>
      <div className="company-intro__mobile-item">
        <img 
          src={imageAssets.aboutCompanyIntro.companyLogoBg} 
          alt="Company Logo Background" 
          className="company-intro__mobile-img" 
          data-ci-mob-anim 
        />
        <div className="company-intro__content" data-ci-mob-anim>
          <span className="company-intro__eyebrow">About NAPCO</span>
          <h2>A Sri Lankan printing partner built on trust, technology and people.</h2>
          <p>
            NAPCO has grown as a reliable printing partner for brands,
            institutions and publishers that expect consistent quality. With
            modern machinery, skilled professionals and a strong service culture,
            the company supports complete printing needs from concept to final
            delivery.
          </p>
        </div>
      </div>
      <div className="company-intro__mobile-item">
        <img 
          src={imageAssets.aboutCompanyIntro.serviceQualityBg} 
          alt="Service Quality Background" 
          className="company-intro__mobile-img" 
          data-ci-mob-anim 
        />
        <div className="company-intro__content" data-ci-mob-anim>
          <span className="company-intro__eyebrow">Print Quality</span>
          <h2>Every printed detail is handled with accuracy, care and finishing strength.</h2>
          <p>
            From newspapers, books and commercial print work to labels,
            calendars, diaries, annual reports and stationery, NAPCO focuses on
            sharp detail, colour accuracy, premium paper handling and refined
            finishing to make every impression look professional.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Desktop sub-component ───────────────────────────────────────────────────
function DesktopCompanyIntro({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Pop animation for About Napco Content
      const napcoContent = container.querySelector('.about-napco-section__content');
      if (napcoContent) {
        gsap.fromTo(
          napcoContent,
          { autoAlpha: 0, scale: 0.85, y: 40 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: '.about-napco-section',
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      // Pop animation for Printing Quality Content
      const qualityContent = container.querySelector('.about-quality-section__content');
      if (qualityContent) {
        gsap.fromTo(
          qualityContent,
          { autoAlpha: 0, scale: 0.85, y: 40 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: '.about-quality-section',
              start: 'top 80%',
              once: true,
            },
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <section 
        className="about-napco-section" 
        ref={sectionRef as React.RefObject<HTMLElement>}
        data-cursor-type="image"
        data-cursor-label="View"
      >
        <div className="about-napco-section__bg" data-parallax style={{ backgroundImage: `url(${imageAssets.aboutCompanyIntro.companyLogoBg})` }} />
        <div className="about-napco-section__overlay" />
        <div className="about-napco-section__content">
          <span className="about-section-eyebrow" data-reveal>About NAPCO</span>
          <h2 data-reveal>
            A Sri Lankan printing partner built on trust, technology and people.
          </h2>
          <p data-reveal>
            NAPCO has grown as a reliable printing partner for brands,
            institutions and publishers that expect consistent quality. With
            modern machinery, skilled professionals and a strong service culture,
            the company supports complete printing needs from concept to final
            delivery.
          </p>
        </div>
      </section>

      <section 
        className="about-quality-section"
        data-cursor-type="image"
        data-cursor-label="View"
      >
        <div className="about-quality-section__bg" data-parallax style={{ backgroundImage: `url(${imageAssets.aboutCompanyIntro.serviceQualityBg})` }} />
        <div className="about-quality-section__overlay" />
        <div className="about-quality-section__content">
          <span className="about-section-eyebrow" data-reveal>Print Quality</span>
          <h2 data-reveal>
            Every printed detail is handled with accuracy, care and finishing
            strength.
          </h2>
          <p data-reveal>
            From newspapers, books and commercial print work to labels,
            calendars, diaries, annual reports and stationery, NAPCO focuses on
            sharp detail, colour accuracy, premium paper handling and refined
            finishing to make every impression look professional.
          </p>
        </div>
      </section>
    </div>
  );
}

// ─── Root component ──────────────────────────────────────────────────────────
export default function CompanyIntro() {
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
    ? <MobileCompanyIntro sectionRef={sectionRef} />
    : <DesktopCompanyIntro sectionRef={sectionRef} />;
}
