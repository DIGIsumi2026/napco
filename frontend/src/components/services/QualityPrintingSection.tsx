import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { imageAssets } from '../../data/imageAssets';

const machineSlides = [
  {
    number: '1',
    title: 'HEIDELBERG 10C\nOFF SET MACHINE',
    description:
      'We are in the newspaper printing industry for more than two decades. It includes an excellent national newspaper & wide array of magazines.',
    image: imageAssets.servicesQuality.gallery.heidelberg10c,
  },
  {
    number: '2',
    title: 'MITSUBISHI\nLITHOPIA WEB OFF\nSET MACHINE',
    description:
      'We are directory supplier for the nations COMMERCIAL PRINTING & PACKAGING ART WORK & COLOUR SEPERATION',
    image: imageAssets.servicesQuality.gallery.mitsubishiLithopia1,
  },
  {
    number: '3',
    title: 'LAMINATION & UV\nVANISH',
    description: 'Even the all-powerful Pointing has no control',
    image: imageAssets.servicesQuality.gallery.laminationUv,
  },
  {
    number: '4',
    title: 'MITSUBISHI\nLITHOPIA WEB OFF\nSET MACHINE',
    description: 'Even the all-powerful Pointing has no control',
    image: imageAssets.servicesQuality.gallery.mitsubishiLithopia2,
  },
];

const AUTOPLAY_DELAY = 4200;

export default function QualityPrintingSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [experienceCount, setExperienceCount] = useState(0);
  const [hasCounted, setHasCounted] = useState(false);

  const activeSlide = machineSlides[activeIndex];

  const splitTitle = useMemo(
    () => activeSlide.title.split('\n'),
    [activeSlide.title]
  );

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasCounted) return;

        setHasCounted(true);

        const targetNumber = 17;
        const duration = 1500;
        const startTime = performance.now();

        const animateCounter = (time: number) => {
          const progress = Math.min((time - startTime) / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);

          setExperienceCount(Math.round(targetNumber * easedProgress));

          if (progress < 1) {
            window.requestAnimationFrame(animateCounter);
          } else {
            setExperienceCount(targetNumber);
          }
        };

        window.requestAnimationFrame(animateCounter);
      },
      {
        threshold: 0.34,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [hasCounted]);

  useEffect(() => {
    const startAutoPlay = () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }

      timerRef.current = window.setInterval(() => {
        setActiveIndex((current) => (current + 1) % machineSlides.length);
      }, AUTOPLAY_DELAY);
    };

    startAutoPlay();

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  const resetAutoplay = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % machineSlides.length);
    }, AUTOPLAY_DELAY);
  };

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? machineSlides.length - 1 : current - 1
    );
    resetAutoplay();
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % machineSlides.length);
    resetAutoplay();
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
    resetAutoplay();
  };

  return (
    <section className="quality-printing" ref={sectionRef}>
      <img
        src={imageAssets.servicesQuality.background}
        alt=""
        className="quality-printing__bg"
        aria-hidden="true"
      />

      <div className="quality-printing__overlay" />

      <div className="quality-printing__inner">
        <div className="quality-printing__experience" data-reveal>
          <strong>{experienceCount}</strong>
          <span>Years of</span>
          <small>Experience</small>
        </div>

        <div className="quality-printing__gallery" data-reveal>
          <div className="quality-printing__image-wrap">
            <img
              key={activeSlide.number}
              src={activeSlide.image}
              alt={splitTitle.join(' ')}
              className="quality-printing__image"
            />
          </div>

          <div className="quality-printing__bottom-fade" />

          <span className="quality-printing__number">
            {activeSlide.number}
          </span>

          <div className="quality-printing__content">
            <h2>
              {splitTitle.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>

            <p>{activeSlide.description}</p>
          </div>

          <div className="quality-printing__controls">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous machine"
              data-cursor="Previous"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="quality-printing__dots">
              {machineSlides.map((slide, index) => (
                <button
                  key={slide.number}
                  type="button"
                  className={
                    index === activeIndex
                      ? 'quality-printing__dot quality-printing__dot--active'
                      : 'quality-printing__dot'
                  }
                  onClick={() => goToSlide(index)}
                  aria-label={`Show machine ${slide.number}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Next machine"
              data-cursor="Next"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}