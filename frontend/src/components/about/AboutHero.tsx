import { useEffect, useRef, useState } from 'react';
import { Factory, Layers, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { imageAssets } from '../../data/imageAssets';
import { videoAssets } from '../../data/videoAssets';

gsap.registerPlugin(ScrollTrigger);

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const thumbnailRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.currentTime = 0;
    video.muted = true;
    video.playsInline = true;
    video.loop = false;

    video.play().catch(() => {
      // Autoplay can be blocked in rare browser cases.
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const thumbnail = thumbnailRef.current;
    const content = contentRef.current;

    if (!section || !video || !thumbnail || !content) return;

    const ctx = gsap.context(() => {
      gsap.set(video, {
        scale: 1,
        transformOrigin: '50% 50%',
      });

      gsap.set(thumbnail, {
        autoAlpha: 0,
        scale: 0.72,
        y: 80,
        rotateX: 10,
        transformOrigin: '50% 50%',
      });

      gsap.set(content, {
        y: 0,
        autoAlpha: 1,
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=1100',
          scrub: 0.9,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline.to(
        video,
        {
          scale: 1.22,
          duration: 1.2,
          ease: 'power2.inOut',
        },
        0
      );

      timeline.to(
        content,
        {
          y: -46,
          autoAlpha: 0.82,
          duration: 0.75,
          ease: 'power2.out',
        },
        0.1
      );

      timeline.to(
        thumbnail,
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          rotateX: 0,
          duration: 0.9,
          ease: 'back.out(1.35)',
        },
        0.32
      );

      timeline.to(
        thumbnail,
        {
          scale: 1.04,
          duration: 0.7,
          ease: 'power2.inOut',
        },
        1.02
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
        onEnded={() => setVideoEnded(true)}
      />

      <div className="about-hero__overlay" />

      <div className="about-hero__content" ref={contentRef}>
        <span className="about-hero__eyebrow">About NAPCO</span>

        <h1>
          Printing excellence
          <br />
          with responsibility
        </h1>

        <p>
          NAPCO Printers is a trusted Sri Lankan printing and publishing company
          delivering reliable, high-quality solutions for corporate,
          institutional and commercial clients.
        </p>

        <div className="about-hero__stats">
          <div>
            <Factory size={24} />
            <strong>Since 2003</strong>
            <span>Established</span>
          </div>

          <div>
            <Layers size={24} />
            <strong>Full Service</strong>
            <span>Print &amp; Publishing</span>
          </div>

          <div>
            <ShieldCheck size={24} />
            <strong>Reliable</strong>
            <span>Quality Standards</span>
          </div>
        </div>
      </div>

      <figure
        className={`about-hero__thumbnail ${
          videoEnded ? 'about-hero__thumbnail--ready' : ''
        }`}
        ref={thumbnailRef}
      >
        <img
          src={imageAssets.about.thubnail}
          alt="NAPCO printing services and Sri Lankan staff"
          onLoad={() => ScrollTrigger.refresh()}
        />

        <figcaption>
          <span>Our Capabilities</span>
          <strong>From newspapers to labels, books and reports.</strong>
        </figcaption>
      </figure>

      <div className="about-hero__scroll">
        <span />
        <small>Scroll</small>
      </div>
    </section>
  );
}