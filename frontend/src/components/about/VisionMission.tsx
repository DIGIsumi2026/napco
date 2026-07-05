import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { imageAssets } from '../../data/imageAssets';

gsap.registerPlugin(ScrollTrigger);

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export default function VisionMission() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const visionImage = section.querySelector<HTMLElement>(
        '.vision-mission__image--vision'
      );

      const missionImage = section.querySelector<HTMLElement>(
        '.vision-mission__image--mission'
      );

      const visionContent = section.querySelector<HTMLElement>(
        '.vision-mission__content--vision'
      );

      const missionContent = section.querySelector<HTMLElement>(
        '.vision-mission__content--mission'
      );

      const progressLine = section.querySelector<HTMLElement>(
        '.vision-mission__progress-line span'
      );

      if (
        !visionImage ||
        !missionImage ||
        !visionContent ||
        !missionContent ||
        !progressLine
      ) {
        return;
      }

      const applyProgress = (progress: number) => {
        const transition = clamp((progress - 0.28) / 0.44, 0, 1);

        gsap.set(progressLine, {
          scaleX: progress,
          transformOrigin: 'left center',
        });

        // Vision image: left-side focus
        gsap.set(visionImage, {
          autoAlpha: 1 - transition,
          scale: 1.08 + transition * 0.05,
        });

        // Mission image: right-side machine/man focus
        gsap.set(missionImage, {
          autoAlpha: transition,
          scale: 1.18 - transition * 0.1,
        });

        // Vision text disappears while scrolling down, reappears when scrolling up
        gsap.set(visionContent, {
          autoAlpha: 1 - transition,
          y: -52 * transition,
          clipPath: `inset(0% 0% ${transition * 100}% 0%)`,
        });

        // Mission text appears while scrolling down, disappears when scrolling up
        gsap.set(missionContent, {
          autoAlpha: transition,
          y: 52 * (1 - transition),
          clipPath: `inset(${100 - transition * 100}% 0% 0% 0%)`,
        });
      };

      gsap.set(visionImage, {
        autoAlpha: 1,
        scale: 1.08,
      });

      gsap.set(missionImage, {
        autoAlpha: 0,
        scale: 1.18,
      });

      gsap.set(visionContent, {
        autoAlpha: 1,
        y: 0,
        clipPath: 'inset(0% 0% 0% 0%)',
      });

      gsap.set(missionContent, {
        autoAlpha: 0,
        y: 52,
        clipPath: 'inset(100% 0% 0% 0%)',
      });

      gsap.set(progressLine, {
        scaleX: 0,
        transformOrigin: 'left center',
      });

      applyProgress(0);

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          applyProgress(self.progress);
        },
        onRefresh: (self) => {
          applyProgress(self.progress);
        },
      });

      window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);

      return () => {
        trigger.kill();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="vision-mission" ref={sectionRef}>
      <div className="vision-mission__sticky">
        <div className="vision-mission__media" aria-hidden="true">
          <img
            src={imageAssets.about.visionMission}
            alt=""
            className="vision-mission__image vision-mission__image--vision"
            onLoad={() => ScrollTrigger.refresh()}
          />

          <img
            src={imageAssets.about.visionMission}
            alt=""
            className="vision-mission__image vision-mission__image--mission"
            onLoad={() => ScrollTrigger.refresh()}
          />
        </div>

        <div className="vision-mission__overlay" />

        <div className="vision-mission__content vision-mission__content--vision">
          <span className="vision-mission__eyebrow">Our Vision</span>

          <h2>Driven by quality, service excellence and innovation.</h2>

          <p>
            To be a key player in the printing industry in the pursuit of quality
            &amp; service excellence while earning our employees &amp; customers
            enthusiasm through continues improvement driven by integrity, team
            work &amp; innovation.
          </p>
        </div>

        <div className="vision-mission__content vision-mission__content--mission">
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

        <div className="vision-mission__progress">
          <div className="vision-mission__progress-line">
            <span />
          </div>

          <span className="vision-mission__progress-label">
            Responsibility & Growth
          </span>
        </div>
      </div>
    </section>
  );
}