import { useEffect, useMemo, useRef } from 'react';

import { imageAssets } from '../../data/imageAssets';

const companyLogos = [
  {
    name: 'Company 1',
    logo: imageAssets.company.company1,
  },
  {
    name: 'Company 2',
    logo: imageAssets.company.company2,
  },
  {
    name: 'Company 3',
    logo: imageAssets.company.company3,
  },
  {
    name: 'Company 4',
    logo: imageAssets.company.company4,
  },
  {
    name: 'Company 5',
    logo: imageAssets.company.company5,
  },
  {
    name: 'Company 6',
    logo: imageAssets.company.company6,
  },
  {
    name: 'Company 7',
    logo: imageAssets.company.company7,
  },
  {
    name: 'Company 8',
    logo: imageAssets.company.company8,
  },
  {
    name: 'Company 9',
    logo: imageAssets.company.company9,
  },
  {
    name: 'Company 10',
    logo: imageAssets.company.company10,
  },
  {
    name: 'Company 11',
    logo: imageAssets.company.company11,
  },
  {
    name: 'Company 12',
    logo: imageAssets.company.company12,
  },
  {
    name: 'Company 13',
    logo: imageAssets.company.company13,
  },
  {
    name: 'Company 14',
    logo: imageAssets.company.company14,
  },
  {
    name: 'Company 15',
    logo: imageAssets.company.company15,
  },
];

const LOOP_COUNT = 3;

export default function AboutCompanyBanner() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const resumeTimerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const repeatedLogos = useMemo(
    () =>
      Array.from({ length: LOOP_COUNT }).flatMap((_, loopIndex) =>
        companyLogos.map((company, index) => ({
          ...company,
          key: `${company.name}-${loopIndex}-${index}`,
        }))
      ),
    []
  );

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) return;

    let previousTime = performance.now();
    let isVisible = false;

    const getSingleLoopWidth = () => scroller.scrollWidth / LOOP_COUNT;

    const normalizeScrollPosition = () => {
      const singleLoopWidth = getSingleLoopWidth();

      if (!singleLoopWidth) return;

      if (scroller.scrollLeft >= singleLoopWidth * 2) {
        scroller.scrollLeft -= singleLoopWidth;
      }

      if (scroller.scrollLeft <= 0) {
        scroller.scrollLeft += singleLoopWidth;
      }
    };

    const setInitialPosition = () => {
      const singleLoopWidth = getSingleLoopWidth();

      if (singleLoopWidth > 0) {
        scroller.scrollLeft = singleLoopWidth;
      }
    };

    const pauseAutoScroll = () => {
      pausedRef.current = true;

      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };

    const resumeAutoScrollSoon = () => {
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
      }

      resumeTimerRef.current = window.setTimeout(() => {
        pausedRef.current = false;
      }, 1200);
    };

    const autoScroll = (time: number) => {
      if (!isVisible) {
        animationFrameRef.current = null;
        return;
      }

      const delta = time - previousTime;
      previousTime = time;

      const speed = window.innerWidth <= 768 ? 0.045 : 0.075;

      if (!pausedRef.current && !draggingRef.current) {
        scroller.scrollLeft += delta * speed;
        normalizeScrollPosition();
      }

      animationFrameRef.current = window.requestAnimationFrame(autoScroll);
    };

    const startAutoScroll = () => {
      if (animationFrameRef.current) return;

      previousTime = performance.now();
      animationFrameRef.current = window.requestAnimationFrame(autoScroll);
    };

    const stopAutoScroll = () => {
      if (!animationFrameRef.current) return;

      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    };

    const handlePointerDown = (event: PointerEvent) => {
      draggingRef.current = true;
      pauseAutoScroll();

      startXRef.current = event.clientX;
      startScrollLeftRef.current = scroller.scrollLeft;

      scroller.classList.add('about-company-banner__scroller--dragging');
      scroller.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!draggingRef.current) return;

      const deltaX = event.clientX - startXRef.current;
      scroller.scrollLeft = startScrollLeftRef.current - deltaX;

      normalizeScrollPosition();
    };

    const stopDragging = (event: PointerEvent) => {
      if (!draggingRef.current) return;

      draggingRef.current = false;
      scroller.classList.remove('about-company-banner__scroller--dragging');

      if (scroller.hasPointerCapture(event.pointerId)) {
        scroller.releasePointerCapture(event.pointerId);
      }

      normalizeScrollPosition();
      resumeAutoScrollSoon();
    };

    const handleWheel = () => {
      pauseAutoScroll();
      normalizeScrollPosition();
      resumeAutoScrollSoon();
    };

    const handleMouseEnter = () => {
      pauseAutoScroll();
    };

    const handleMouseLeave = () => {
      resumeAutoScrollSoon();
    };

    const handleResize = () => {
      setInitialPosition();
    };

    const initialTimer = window.setTimeout(setInitialPosition, 150);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;

        if (isVisible) {
          startAutoScroll();
        } else {
          stopAutoScroll();
        }
      },
      {
        rootMargin: '180px 0px',
        threshold: 0.01,
      }
    );

    scroller.addEventListener('pointerdown', handlePointerDown);
    scroller.addEventListener('pointermove', handlePointerMove);
    scroller.addEventListener('pointerup', stopDragging);
    scroller.addEventListener('pointercancel', stopDragging);
    scroller.addEventListener('lostpointercapture', stopDragging);
    scroller.addEventListener('wheel', handleWheel, { passive: true });
    scroller.addEventListener('mouseenter', handleMouseEnter);
    scroller.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize, { passive: true });

    observer.observe(scroller);

    return () => {
      window.clearTimeout(initialTimer);

      scroller.removeEventListener('pointerdown', handlePointerDown);
      scroller.removeEventListener('pointermove', handlePointerMove);
      scroller.removeEventListener('pointerup', stopDragging);
      scroller.removeEventListener('pointercancel', stopDragging);
      scroller.removeEventListener('lostpointercapture', stopDragging);
      scroller.removeEventListener('wheel', handleWheel);
      scroller.removeEventListener('mouseenter', handleMouseEnter);
      scroller.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);

      observer.disconnect();

      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
      }

      stopAutoScroll();
    };
  }, []);

  return (
    <section className="about-company-banner" aria-label="Our trusted companies">
      <div className="about-company-banner__fade about-company-banner__fade--left" />
      <div className="about-company-banner__fade about-company-banner__fade--right" />

      <div className="about-company-banner__scroller" ref={scrollerRef}>
        <div className="about-company-banner__track">
          {repeatedLogos.map((company) => (
            <div
              className="about-company-banner__item"
              key={company.key}
              data-cursor={company.name}
            >
              <img src={company.logo} alt={company.name} draggable="false" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}