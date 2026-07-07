import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { imageAssets } from '../../data/imageAssets';

gsap.registerPlugin(ScrollTrigger);

export default function VisionMission() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const imageTrack = section.querySelector('.vision-mission__image-track');
      const image = section.querySelector('.vision-mission__image');
      const visionContent = section.querySelector('.vision-mission__content--vision');
      const missionContent = section.querySelector('.vision-mission__content--mission');
      const progressLine = section.querySelector('.vision-mission__progress-line span');

      if (!imageTrack || !image || !visionContent || !missionContent || !progressLine) return;

      // Initial states
      gsap.set(visionContent, { autoAlpha: 1, y: 0 });
      gsap.set(missionContent, { autoAlpha: 0, y: 60 });
      gsap.set(image, { xPercent: 0, scale: 1.08 });
      gsap.set(progressLine, { scaleX: 0, transformOrigin: 'left center' });

      const isMobile = window.innerWidth <= 768;
      const scrollEnd = isMobile ? '+=1100' : '+=1600';

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: scrollEnd,
          scrub: 0.9,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 0.00 to 0.35: keep Vision readable
      tl.to(progressLine, { scaleX: 0.35, duration: 0.35, ease: 'none' }, 0);
      
      // 0.35 to 0.55: fade/slide Vision out
      tl.to(visionContent, { autoAlpha: 0, y: -40, duration: 0.20, ease: 'power2.inOut' }, 0.35);
      tl.to(progressLine, { scaleX: 0.55, duration: 0.20, ease: 'none' }, 0.35);

      // 0.35 to 0.75: pan/zoom image to right side
      tl.to(image, { xPercent: -14, scale: 1.16, duration: 0.40, ease: 'power2.inOut' }, 0.35);
      
      // 0.55 to 0.85: fade/slide Mission in
      tl.to(missionContent, { autoAlpha: 1, y: 0, duration: 0.30, ease: 'power2.inOut' }, 0.55);
      tl.to(progressLine, { scaleX: 0.85, duration: 0.30, ease: 'none' }, 0.55);

      // 0.85 to 1.00: hold Mission readable
      tl.to(progressLine, { scaleX: 1, duration: 0.15, ease: 'none' }, 0.85);

      // Refresh ScrollTrigger once image is loaded to recalculate heights if necessary
      const imgEl = image as HTMLImageElement;
      if (imgEl.complete) {
        ScrollTrigger.refresh();
      } else {
        imgEl.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
      }

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="vision-mission" ref={sectionRef}>
      <div className="vision-mission__sticky">
        <div className="vision-mission__media" aria-hidden="true">
          <div className="vision-mission__image-track">
            <img
              src={imageAssets.about.visionMission}
              alt=""
              className="vision-mission__image"
            />
          </div>
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