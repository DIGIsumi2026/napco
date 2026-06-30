import { useEffect, useRef } from 'react';
import { ArrowDown, RotateCcw } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { imageAssets } from '../../data/imageAssets';
import { videoAssets } from '../../data/videoAssets';

gsap.registerPlugin(ScrollTrigger);

type LenisWindow = Window & {
  napcoLenis?: {
    scrollTo: (
      target: number | string | HTMLElement,
      options?: { duration?: number; offset?: number }
    ) => void;
  };
};

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const thumbnailRef = useRef<HTMLDivElement | null>(null);
  const thumbnailImageRef = useRef<HTMLImageElement | null>(null);
  const thumbnailContentRef = useRef<HTMLDivElement | null>(null);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);
  const replayRef = useRef<HTMLButtonElement | null>(null);

  const playVideo = () => {
    const video = videoRef.current;

    if (!video) return;

    video.currentTime = 0;
    video.muted = true;
    video.playsInline = true;
    video.loop = false;

    video.play().catch(() => {
      // Muted autoplay may still be blocked in rare browser cases.
    });
  };

  const handleReplay = () => {
    const section = sectionRef.current;

    playVideo();

    if (!section) return;

    const lenis = (window as LenisWindow).napcoLenis;

    if (lenis) {
      lenis.scrollTo(section, {
        duration: 1.05,
        offset: 0,
      });
    } else {
      window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    playVideo();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const thumbnail = thumbnailRef.current;
    const thumbnailImage = thumbnailImageRef.current;
    const thumbnailContent = thumbnailContentRef.current;
    const scrollHint = scrollHintRef.current;
    const replayButton = replayRef.current;

    if (
      !section ||
      !video ||
      !thumbnail ||
      !thumbnailImage ||
      !thumbnailContent ||
      !scrollHint ||
      !replayButton
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(video, {
        scale: 1,
        transformOrigin: '50% 50%',
      });

      gsap.set(thumbnail, {
        autoAlpha: 0,
        scale: 1.08,
        clipPath: 'inset(46% 46% 46% 46% round 40px)',
        transformOrigin: '50% 50%',
      });

      gsap.set(thumbnailImage, {
        scale: 1.12,
        transformOrigin: '50% 50%',
      });

      gsap.set(thumbnailContent, {
        autoAlpha: 0,
        y: 70,
        scale: 0.96,
      });

      gsap.set(scrollHint, {
        autoAlpha: 1,
        y: 0,
      });

      gsap.set(replayButton, {
        autoAlpha: 1,
        y: 0,
        pointerEvents: 'auto',
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=1300',
          scrub: 0.9,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline.to(
        video,
        {
          scale: 1.28,
          duration: 1.4,
          ease: 'power2.inOut',
        },
        0
      );

      timeline.to(
        scrollHint,
        {
          autoAlpha: 0,
          y: 40,
          duration: 0.35,
          ease: 'power2.out',
        },
        0.05
      );

      timeline.to(
        replayButton,
        {
          autoAlpha: 0,
          y: 24,
          pointerEvents: 'none',
          duration: 0.35,
          ease: 'power2.out',
        },
        0.18
      );

      timeline.to(
        thumbnail,
        {
          autoAlpha: 1,
          scale: 1,
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          duration: 1,
          ease: 'power4.inOut',
        },
        0.28
      );

      timeline.to(
        thumbnailImage,
        {
          scale: 1,
          duration: 1,
          ease: 'power3.out',
        },
        0.32
      );

      timeline.to(
        thumbnailContent,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: 'power3.out',
        },
        0.88
      );

      window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about-hero" ref={sectionRef}>
      <video
        ref={videoRef}
        className="about-hero__video"
        src={videoAssets.about.hero}
        muted
        playsInline
        preload="auto"
        onLoadedData={() => ScrollTrigger.refresh()}
      />

      <div className="about-hero__video-vignette" />

      <button
        ref={replayRef}
        type="button"
        className="about-hero__replay"
        onClick={handleReplay}
        aria-label="Replay video"
        data-cursor="Replay"
      >
        <RotateCcw size={16} />
        <span>Replay</span>
      </button>

      <div className="about-hero__scroll" ref={scrollHintRef}>
        <div className="about-hero__scroll-line">
          <span />
        </div>

        <div className="about-hero__scroll-icon">
          <ArrowDown size={18} />
        </div>

        <small>Scroll Down</small>
      </div>

      <div className="about-hero__thumbnail-full" ref={thumbnailRef}>
        <img
          ref={thumbnailImageRef}
          src={imageAssets.about.thubnail}
          alt="NAPCO printing services with Sri Lankan company staff"
          onLoad={() => ScrollTrigger.refresh()}
        />

        <div className="about-hero__thumbnail-overlay" />

        <div className="about-hero__thumbnail-content" ref={thumbnailContentRef}>
          <span>About NAPCO</span>

          <h1>
            Printing excellence
            <br />
            powered by people
          </h1>

          <p>
            NAPCO Printers combines advanced printing technology, skilled Sri
            Lankan professionals and reliable production standards to deliver
            newspapers, books, catalogues, labels, calendars, diaries, annual
            reports and complete commercial printing solutions.
          </p>
        </div>
      </div>
    </section>
  );
}