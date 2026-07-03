import { useEffect, useRef } from 'react';
import { MessageCircle, Send } from 'lucide-react';

import { imageAssets } from '../../data/imageAssets';

type Particle = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  group: number;
  phase: number;
  angle: number;
  radius: number;
  wavePower: number;
};

const particleColors = ['#00aeef', '#ec008c', '#fff200', '#8b35ff', '#ffffff'];

export default function ContactCta() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const cursorRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    previousX: 0,
    previousY: 0,
    active: false,
    speed: 0,
  });

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;

    if (!section || !canvas) return;

    const shouldAnimateParticles =
      window.matchMedia('(min-width: 1024px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!shouldAnimateParticles) {
      canvas.hidden = true;
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let isVisible = false;
    let sectionRect = section.getBoundingClientRect();

    const getParticleCount = () => {
      if (window.innerWidth <= 1280) return 320;
      return 460;
    };

    const createParticles = () => {
      particles = [];

      const particleCount = getParticleCount();
      const centerX = width * 0.5;
      const centerY = height * 0.5;

      for (let index = 0; index < particleCount; index += 1) {
        const group = index % particleColors.length;

        const baseAngle = Math.random() * Math.PI * 2;
        const baseRadius =
          Math.sqrt(Math.random()) * Math.min(width, height) * 0.66;

        const baseX =
          centerX +
          Math.cos(baseAngle) * baseRadius * (1.3 + Math.random() * 0.8);

        const baseY =
          centerY +
          Math.sin(baseAngle) * baseRadius * (0.62 + Math.random() * 0.68);

        const angle = Math.random() * Math.PI * 2;

        particles.push({
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          vx: 0,
          vy: 0,
          size: Math.random() * 1.65 + 0.65,
          color: particleColors[group],
          alpha: Math.random() * 0.5 + 0.34,
          group,
          phase: Math.random() * Math.PI * 2,
          angle,
          radius: 32 + Math.sqrt(Math.random()) * 150 + group * 5,
          wavePower: Math.random() * 0.8 + 0.65,
        });
      }
    };

    const resize = () => {
      const rect = section.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

      width = rect.width;
      height = rect.height;
      sectionRect = rect;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cursorRef.current.x = width * 0.5;
      cursorRef.current.y = height * 0.48;
      cursorRef.current.targetX = width * 0.5;
      cursorRef.current.targetY = height * 0.48;
      cursorRef.current.previousX = width * 0.5;
      cursorRef.current.previousY = height * 0.48;

      createParticles();
    };

    const drawCursorGlow = (x: number, y: number, strength: number) => {
      const glowRadius = 115 + strength * 0.55;

      const glow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);

      glow.addColorStop(0, 'rgba(255, 255, 255, 0.32)');
      glow.addColorStop(0.12, 'rgba(0, 174, 239, 0.34)');
      glow.addColorStop(0.32, 'rgba(236, 0, 140, 0.26)');
      glow.addColorStop(0.58, 'rgba(139, 53, 255, 0.18)');
      glow.addColorStop(1, 'rgba(139, 53, 255, 0)');

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      if (!isVisible) {
        animationFrame = 0;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const cursor = cursorRef.current;
      const time = performance.now() * 0.001;

      cursor.x += (cursor.targetX - cursor.x) * 0.16;
      cursor.y += (cursor.targetY - cursor.y) * 0.16;

      const moveX = cursor.targetX - cursor.previousX;
      const moveY = cursor.targetY - cursor.previousY;

      cursor.speed +=
        (Math.min(Math.sqrt(moveX * moveX + moveY * moveY), 80) -
          cursor.speed) *
        0.12;

      cursor.previousX = cursor.targetX;
      cursor.previousY = cursor.targetY;

      if (cursor.active) {
        drawCursorGlow(cursor.x, cursor.y, cursor.speed);
      }

      particles.forEach((particle) => {
        const defaultWaveX =
          Math.sin(particle.baseY * 0.012 + time * 1.05 + particle.phase) *
            16 *
            particle.wavePower +
          Math.cos(time * 0.7 + particle.group) * 6;

        const defaultWaveY =
          Math.cos(particle.baseX * 0.01 + time * 1.02 + particle.phase) *
            13 *
            particle.wavePower +
          Math.sin(time * 0.84 + particle.group) * 6;

        const distanceFromCursorBase = Math.hypot(
          particle.baseX - cursor.x,
          particle.baseY - cursor.y
        );

        /*
          This is the important part:
          only nearby dots react to cursor.
          The whole screen does not gather.
        */
        const influenceRadius = 290 + cursor.speed * 0.9;
        const influence = cursor.active
          ? Math.max(0, 1 - distanceFromCursorBase / influenceRadius)
          : 0;

        const softenedInfluence = influence * influence;

        const rotatingAngle =
          particle.angle +
          Math.sin(time * 1.25 + particle.phase) * 0.34 +
          cursor.speed * 0.003;

        const clusterRadius =
          particle.radius * (0.36 + softenedInfluence * 0.52);

        const cursorClusterX =
          cursor.x +
          Math.cos(rotatingAngle) * clusterRadius +
          Math.sin(time * 4.1 + particle.phase) *
            (14 + cursor.speed * 0.12) *
            softenedInfluence;

        const cursorClusterY =
          cursor.y +
          Math.sin(rotatingAngle) * clusterRadius * 0.72 +
          Math.cos(time * 3.4 + particle.phase) *
            (12 + cursor.speed * 0.1) *
            softenedInfluence;

        /*
          Small empty center around cursor.
          This creates the clean split, not a blob.
        */
        const localDx = particle.x - cursor.x;
        const localDy = particle.y - cursor.y;
        const localDistance = Math.hypot(localDx, localDy) || 1;

        const emptyCenterRadius = 42 + cursor.speed * 0.28;
        const emptyCenterForce =
          cursor.active && localDistance < emptyCenterRadius
            ? (emptyCenterRadius - localDistance) / emptyCenterRadius
            : 0;

        const pushX =
          (localDx / localDistance) * emptyCenterForce * (38 + cursor.speed * 0.35);
        const pushY =
          (localDy / localDistance) * emptyCenterForce * (38 + cursor.speed * 0.35);

        const targetX =
          particle.baseX +
          defaultWaveX +
          (cursorClusterX - particle.baseX) * softenedInfluence +
          pushX;

        const targetY =
          particle.baseY +
          defaultWaveY +
          (cursorClusterY - particle.baseY) * softenedInfluence +
          pushY;

        const easeToTarget = 0.026 + softenedInfluence * 0.08;

        particle.vx += (targetX - particle.x) * easeToTarget;
        particle.vy += (targetY - particle.y) * easeToTarget;

        particle.vx *= 0.9 - softenedInfluence * 0.08;
        particle.vy *= 0.9 - softenedInfluence * 0.08;

        particle.x += particle.vx;
        particle.y += particle.vy;

        const dotAlpha = Math.min(
          particle.alpha * (0.66 + softenedInfluence * 0.82),
          1
        );

        const dotSize = particle.size * (1 + softenedInfluence * 0.42);

        ctx.save();

        if (softenedInfluence > 0.08) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.shadowBlur = 6 + softenedInfluence * 10;
          ctx.shadowColor = particle.color;
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = dotAlpha;
        ctx.fillStyle = particle.color;

        /*
          Only draw the real dot.
          No big secondary bubble circles.
        */
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, dotSize, 0, Math.PI * 2);
        ctx.fill();

        if (softenedInfluence > 0.22) {
          ctx.globalAlpha = softenedInfluence * 0.55;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, dotSize * 0.42, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrame = window.requestAnimationFrame(draw);
    };

    const startDrawing = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(draw);
    };

    const stopDrawing = () => {
      if (!animationFrame) return;
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };

    const handlePointerEnter = (event: PointerEvent) => {
      sectionRect = section.getBoundingClientRect();
      const x = event.clientX - sectionRect.left;
      const y = event.clientY - sectionRect.top;

      cursorRef.current.x = x;
      cursorRef.current.y = y;
      cursorRef.current.targetX = x;
      cursorRef.current.targetY = y;
      cursorRef.current.previousX = x;
      cursorRef.current.previousY = y;
      cursorRef.current.active = true;
    };

    const handlePointerMove = (event: PointerEvent) => {
      cursorRef.current.targetX = event.clientX - sectionRect.left;
      cursorRef.current.targetY = event.clientY - sectionRect.top;
      cursorRef.current.active = true;
    };

    const handlePointerLeave = () => {
      cursorRef.current.active = false;
      cursorRef.current.speed = 0;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;

        if (isVisible) {
          startDrawing();
        } else {
          cursorRef.current.active = false;
          stopDrawing();
        }
      },
      {
        rootMargin: '180px 0px',
        threshold: 0.01,
      }
    );

    resize();
    observer.observe(section);

    window.addEventListener('resize', resize, { passive: true });
    section.addEventListener('pointerenter', handlePointerEnter, { passive: true });
    section.addEventListener('pointermove', handlePointerMove, { passive: true });
    section.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      section.removeEventListener('pointerenter', handlePointerEnter);
      section.removeEventListener('pointermove', handlePointerMove);
      section.removeEventListener('pointerleave', handlePointerLeave);
      observer.disconnect();

      stopDrawing();
    };
  }, []);

  return (
    <section className="contact-cta" ref={sectionRef} data-reveal>
      <canvas className="contact-cta__particles" ref={canvasRef} />

      <div className="contact-cta__glow contact-cta__glow--left" />
      <div className="contact-cta__glow contact-cta__glow--right" />
      <div className="contact-cta__glow contact-cta__glow--center" />

      <img
        className="contact-cta__float contact-cta__float--book"
        src={imageAssets.contactCta.openBook}
        alt=""
        aria-hidden="true"
      />

      <img
        className="contact-cta__float contact-cta__float--tag"
        src={imageAssets.contactCta.tag}
        alt=""
        aria-hidden="true"
      />

      <img
        className="contact-cta__float contact-cta__float--strip"
        src={imageAssets.contactCta.cmykStrip}
        alt=""
        aria-hidden="true"
      />

      <img
        className="contact-cta__float contact-cta__float--calendar"
        src={imageAssets.contactCta.calendar}
        alt=""
        aria-hidden="true"
      />

      <img
        className="contact-cta__float contact-cta__float--stack"
        src={imageAssets.contactCta.bookStack}
        alt=""
        aria-hidden="true"
      />

      <div className="contact-cta__content">
        <span className="contact-cta__eyebrow">
          Let’s Print Something Great
        </span>

        <h2>
          Ready to
          <br />
          bring your
          <br />
          next impression to life?
        </h2>

        <p>
          From books, labels and catalogues to calendars, reports and commercial
          print solutions, NAPCO is ready to help you create high-quality printed
          work with care, precision and responsibility.
        </p>

        <div className="contact-cta__actions">
          <a
            href="/contact-us"
            className="contact-cta__button contact-cta__button--primary"
            data-cursor="Contact"
          >
            <Send size={18} />
            Contact Us
          </a>

          <a
            href="https://wa.me/YOUR_WHATSAPP_NUMBER"
            target="_blank"
            rel="noreferrer"
            className="contact-cta__button contact-cta__button--secondary"
            data-cursor="WhatsApp"
          >
            <MessageCircle size={19} />
            Chat With Us
          </a>
        </div>
      </div>
    </section>
  );
}
