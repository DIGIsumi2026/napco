import { useEffect, useMemo, useRef } from 'react';

import { imageAssets } from '../../data/imageAssets';

const clientLogos = [
  {
    name: 'Client 1',
    logo: imageAssets.clients.client1,
  },
  {
    name: 'Client 2',
    logo: imageAssets.clients.client2,
  },
  {
    name: 'Client 3',
    logo: imageAssets.clients.client3,
  },
  {
    name: 'Client 4',
    logo: imageAssets.clients.client4,
  },
  {
    name: 'Client 5',
    logo: imageAssets.clients.client5,
  },
  {
    name: 'Client 6',
    logo: imageAssets.clients.client6,
  },
  {
    name: 'Client 7',
    logo: imageAssets.clients.client7,
  },
  {
    name: 'Client 8',
    logo: imageAssets.clients.client8,
  },
];

const LOOP_COUNT = 3;

export default function ClientLogos() {
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
        clientLogos.map((client, index) => ({
          ...client,
          key: `${client.name}-${loopIndex}-${index}`,
        }))
      ),
    []
  );

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) return;

    let previousTime = performance.now();

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
      const delta = time - previousTime;
      previousTime = time;

      const speed = window.innerWidth <= 768 ? 0.045 : 0.075;

      if (!pausedRef.current && !draggingRef.current) {
        scroller.scrollLeft += delta * speed;
        normalizeScrollPosition();
      }

      animationFrameRef.current = window.requestAnimationFrame(autoScroll);
    };

    const handlePointerDown = (event: PointerEvent) => {
      draggingRef.current = true;
      pauseAutoScroll();

      startXRef.current = event.clientX;
      startScrollLeftRef.current = scroller.scrollLeft;

      scroller.classList.add('client-logos__scroller--dragging');
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
      scroller.classList.remove('client-logos__scroller--dragging');

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

    scroller.addEventListener('pointerdown', handlePointerDown);
    scroller.addEventListener('pointermove', handlePointerMove);
    scroller.addEventListener('pointerup', stopDragging);
    scroller.addEventListener('pointercancel', stopDragging);
    scroller.addEventListener('lostpointercapture', stopDragging);
    scroller.addEventListener('wheel', handleWheel, { passive: true });
    scroller.addEventListener('mouseenter', handleMouseEnter);
    scroller.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    animationFrameRef.current = window.requestAnimationFrame(autoScroll);

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

      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
      }

      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <section className="client-logos" aria-label="Our clients">
      <div className="client-logos__fade client-logos__fade--left" />
      <div className="client-logos__fade client-logos__fade--right" />

      <div className="client-logos__scroller" ref={scrollerRef}>
        <div className="client-logos__track">
          {repeatedLogos.map((client) => (
            <div
              className="client-logos__item"
              key={client.key}
              data-cursor={client.name}
            >
              <img src={client.logo} alt={client.name} draggable="false" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}