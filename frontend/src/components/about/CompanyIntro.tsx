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
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let trigger: ScrollTrigger | null = null;
    let applyCurrentProgress: (() => void) | null = null;

    // Kill any leftover scroll triggers
    ScrollTrigger.getAll().forEach((st) => st.kill());

    const ctx = gsap.context(() => {
      const firstImage = section.querySelector<HTMLElement>('.company-intro__image--first');
      const secondImage = section.querySelector<HTMLElement>('.company-intro__image--second');
      const firstContent = section.querySelector<HTMLElement>('.company-intro__content--first');
      const secondContent = section.querySelector<HTMLElement>('.company-intro__content--second');
      const progressLine = section.querySelector<HTMLElement>('.company-intro__progress-line span');

      if (!firstImage || !secondImage || !firstContent || !secondContent || !progressLine) return;

      gsap.set(progressLine, {
        scaleX: 0,
        transformOrigin: 'left center',
      });

      const applyProgress = (progress: number) => {
        const transition = clamp((progress - 0.28) / 0.42, 0, 1);

        gsap.set(progressLine, { scaleX: progress });

        gsap.set(firstImage, {
          autoAlpha: 1 - transition,
          scale: 1 + transition * 0.04,
        });

        gsap.set(secondImage, {
          autoAlpha: transition,
          scale: 1.06 - transition * 0.06,
          clipPath: `inset(0% 0% 0% ${100 - transition * 100}%)`,
        });

        gsap.set(firstContent, {
          autoAlpha: 1 - transition,
          y: -44 * transition,
          clipPath: `inset(0% 0% ${transition * 100}% 0%)`,
        });

        gsap.set(secondContent, {
          autoAlpha: transition,
          y: 48 * (1 - transition),
          clipPath: `inset(${100 - transition * 100}% 0% 0% 0%)`,
        });
      };

      applyCurrentProgress = () => {
        const rect = section.getBoundingClientRect();
        const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
        const progress = clamp(-rect.top / scrollDistance, 0, 1);
        applyProgress(progress);
      };

      applyCurrentProgress();

      window.addEventListener('scroll', applyCurrentProgress, { passive: true });
      window.addEventListener('resize', applyCurrentProgress);
      gsap.ticker.add(applyCurrentProgress);

      trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onEnter: () => applyCurrentProgress?.(),
        onEnterBack: () => applyCurrentProgress?.(),
        onLeave: () => applyCurrentProgress?.(),
        onLeaveBack: () => applyCurrentProgress?.(),
        onUpdate: () => applyCurrentProgress?.(),
        onRefresh: () => applyCurrentProgress?.(),
      });
    }, section);

    // Refresh after setup so pin recalculates correct position on fresh mount
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      if (applyCurrentProgress) {
        window.removeEventListener('scroll', applyCurrentProgress);
        window.removeEventListener('resize', applyCurrentProgress);
        gsap.ticker.remove(applyCurrentProgress);
      }
      trigger?.kill();
      ctx.revert();
      
      ScrollTrigger.getAll().forEach((st) => st.kill());
      const lenis = (window as unknown as { napcoLenis?: { resize(): void } }).napcoLenis;
      if (lenis) {
        lenis.resize();
      } else {
        window.dispatchEvent(new Event('resize'));
      }
    };
  }, [sectionRef]);

  return (
    <section className="company-intro" ref={sectionRef as React.RefObject<HTMLElement>}>
      <div className="company-intro__sticky">
        <div className="company-intro__media" aria-hidden="true">
          <img
            src={imageAssets.aboutCompanyIntro.companyLogoBg}
            alt=""
            className="company-intro__image company-intro__image--first"
            onLoad={() => ScrollTrigger.refresh()}
          />
          <img
            src={imageAssets.aboutCompanyIntro.serviceQualityBg}
            alt=""
            className="company-intro__image company-intro__image--second"
            onLoad={() => ScrollTrigger.refresh()}
          />
        </div>

        <div className="company-intro__shade" />

        <div className="company-intro__content company-intro__content--first">
          <span className="company-intro__eyebrow">About NAPCO</span>
          <h2>
            A Sri Lankan printing partner built on trust, technology and people.
          </h2>
          <p>
            NAPCO has grown as a reliable printing partner for brands,
            institutions and publishers that expect consistent quality. With
            modern machinery, skilled professionals and a strong service culture,
            the company supports complete printing needs from concept to final
            delivery.
          </p>
        </div>

        <div className="company-intro__content company-intro__content--second">
          <span className="company-intro__eyebrow">Print Quality</span>
          <h2>
            Every printed detail is handled with accuracy, care and finishing
            strength.
          </h2>
          <p>
            From newspapers, books and commercial print work to labels,
            calendars, diaries, annual reports and stationery, NAPCO focuses on
            sharp detail, colour accuracy, premium paper handling and refined
            finishing to make every impression look professional.
          </p>
        </div>

        <div className="company-intro__progress">
          <div className="company-intro__progress-line">
            <span />
          </div>
          <span>Company Story</span>
        </div>
      </div>
    </section>
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
