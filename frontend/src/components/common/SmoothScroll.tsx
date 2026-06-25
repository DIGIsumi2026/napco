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
      lerp: 0.08,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.1,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
      anchors: {
        offset: 0,
        duration: 1.15,
      },
    });

    window.napcoLenis = lenis;

    const onLenisScroll = () => {
      ScrollTrigger.update();
    };

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on('scroll', onLenisScroll);

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    const handleLoad = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('load', handleLoad);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener('load', handleLoad);

      lenis.off('scroll', onLenisScroll);
      gsap.ticker.remove(updateLenis);

      lenis.destroy();

      if (window.napcoLenis === lenis) {
        delete window.napcoLenis;
      }
    };
  }, []);

  return <>{children}</>;
}