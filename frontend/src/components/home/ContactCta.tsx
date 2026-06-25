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
  offsetX: number;
  offsetY: number;
  size: number;
  color: string;
  alpha: number;
  orbit: number;
  speed: number;
  seed: number;
};

const particleColors = ['#0053a0', '#00aeef', '#ec008c', '#fff200', '#111111'];

export default function ContactCta() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const cursorRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false,
  });

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;

    if (!section || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;

    const isSmallScreen = window.matchMedia('(max-width: 680px)').matches;
    const particleCount = isSmallScreen ? 260 : 620;

    const createParticles = () => {
      particles = [];

      for (let index = 0; index < particleCount; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const spread = Math.sqrt(Math.random());
        const cursorRadius = 18 + spread * 185;

        const offsetX = Math.cos(angle) * cursorRadius * (0.8 + Math.random() * 0.7);
        const offsetY = Math.sin(angle) * cursorRadius * (0.45 + Math.random() * 0.75);

        const baseAngle = Math.random() * Math.PI * 2;
        const baseRadius = Math.sqrt(Math.random()) * Math.min(width, height) * 0.52;

        const baseX = width * 0.5 + Math.cos(baseAngle) * baseRadius * 1.55;
        const baseY = height * 0.54 + Math.sin(baseAngle) * baseRadius * 0.72;

        particles.push({
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          vx: 0,
          vy: 0,
          offsetX,
          offsetY,
          size: Math.random() * 1.85 + 0.45,
          color: particleColors[index % particleColors.length],
          alpha: Math.random() * 0.55 + 0.2,
          orbit: Math.random() * 14 + 5,
          speed: Math.random() * 1.15 + 0.55,
          seed: Math.random() * Math.PI * 2,
        });
      }
    };

    const resize = () => {
      const rect = section.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);

      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cursorRef.current.x = width * 0.5;
      cursorRef.current.y = height * 0.5;
      cursorRef.current.targetX = width * 0.5;
      cursorRef.current.targetY = height * 0.5;

      createParticles();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const cursor = cursorRef.current;
      const time = performance.now() * 0.001;

      cursor.x += (cursor.targetX - cursor.x) * 0.18;
      cursor.y += (cursor.targetY - cursor.y) * 0.18;

      particles.forEach((particle) => {
        const idleX = Math.cos(time * particle.speed + particle.seed) * particle.orbit;
        const idleY = Math.sin(time * particle.speed + particle.seed) * particle.orbit;

        const targetX = cursor.active
          ? cursor.x + particle.offsetX + idleX
          : particle.baseX + idleX * 0.45;

        const targetY = cursor.active
          ? cursor.y + particle.offsetY + idleY
          : particle.baseY + idleY * 0.45;

        particle.vx += (targetX - particle.x) * (cursor.active ? 0.06 : 0.025);
        particle.vy += (targetY - particle.y) * (cursor.active ? 0.06 : 0.025);

        particle.vx *= cursor.active ? 0.82 : 0.88;
        particle.vy *= cursor.active ? 0.82 : 0.88;

        particle.x += particle.vx;
        particle.y += particle.vy;

        const activeAlpha = cursor.active ? particle.alpha : particle.alpha * 0.28;

        ctx.globalAlpha = activeAlpha;
        ctx.fillStyle = particle.color;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrame = window.requestAnimationFrame(draw);
    };

    const handlePointerEnter = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();

      cursorRef.current.targetX = event.clientX - rect.left;
      cursorRef.current.targetY = event.clientY - rect.top;
      cursorRef.current.x = cursorRef.current.targetX;
      cursorRef.current.y = cursorRef.current.targetY;
      cursorRef.current.active = true;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();

      cursorRef.current.targetX = event.clientX - rect.left;
      cursorRef.current.targetY = event.clientY - rect.top;
      cursorRef.current.active = true;
    };

    const handlePointerLeave = () => {
      cursorRef.current.active = false;
    };

    resize();
    draw();

    window.addEventListener('resize', resize);
    section.addEventListener('pointerenter', handlePointerEnter);
    section.addEventListener('pointermove', handlePointerMove);
    section.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('resize', resize);
      section.removeEventListener('pointerenter', handlePointerEnter);
      section.removeEventListener('pointermove', handlePointerMove);
      section.removeEventListener('pointerleave', handlePointerLeave);

      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section className="contact-cta" ref={sectionRef}>
      <canvas className="contact-cta__particles" ref={canvasRef} />

      <div className="contact-cta__glow contact-cta__glow--left" />
      <div className="contact-cta__glow contact-cta__glow--right" />

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
          Ready to bring your
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