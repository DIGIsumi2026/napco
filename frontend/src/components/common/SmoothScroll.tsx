import { ReactNode, useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

declare global {
  interface Window {
    napcoLenis?: Lenis;
  }
}

type SmoothScrollProps = {
  children: ReactNode;
};

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.15,
      smoothWheel: true,
      syncTouch: false,
      anchors: {
        offset: 0,
        duration: 1.15
      }
    });

    window.napcoLenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();

      if (window.napcoLenis === lenis) {
        delete window.napcoLenis;
      }
    };
  }, []);

  return <>{children}</>;
}
