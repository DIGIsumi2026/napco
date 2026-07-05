import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { imageAssets } from '../../data/imageAssets';

gsap.registerPlugin(ScrollTrigger);

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export default function CompanyIntro() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    let trigger: ScrollTrigger | null = null;
    let refreshTimer = 0;
    let applyCurrentProgress: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const firstImage = section.querySelector<HTMLElement>(
        '.company-intro__image--first'
      );
      const secondImage = section.querySelector<HTMLElement>(
        '.company-intro__image--second'
      );
      const firstContent = section.querySelector<HTMLElement>(
        '.company-intro__content--first'
      );
      const secondContent = section.querySelector<HTMLElement>(
        '.company-intro__content--second'
      );
      const progressLine = section.querySelector<HTMLElement>(
        '.company-intro__progress-line span'
      );

      if (
        !firstImage ||
        !secondImage ||
        !firstContent ||
        !secondContent ||
        !progressLine
      ) {
        return;
      }

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

      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    }, section);

    return () => {
      window.clearTimeout(refreshTimer);
      if (applyCurrentProgress) {
        window.removeEventListener('scroll', applyCurrentProgress);
        window.removeEventListener('resize', applyCurrentProgress);
        gsap.ticker.remove(applyCurrentProgress);
      }
      trigger?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section className="company-intro" ref={sectionRef}>
      <div className="company-intro__sticky">
        <div className="company-intro__media" aria-hidden="true">
          <img
            src={imageAssets.aboutCompanyIntro.companyLogoBg}
            alt=""
            className="company-intro__image company-intro__image--first"
          />

          <img
            src={imageAssets.aboutCompanyIntro.serviceQualityBg}
            alt=""
            className="company-intro__image company-intro__image--second"
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
