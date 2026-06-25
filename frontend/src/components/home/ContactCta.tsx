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
  group: number;
  phase: number;
  radius: number;
  angle: number;
  wavePower: number;
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
    previousX: 0,
    previousY: 0,
    active: false,
    speed: 0,
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

    const getParticleCount = () => {
      if (window.innerWidth <= 680) return 240;
      if (window.innerWidth <= 1024) return 420;
      return 760;
    };

    const createParticles = () => {
      particles = [];

      const particleCount = getParticleCount();
      const centerX = width * 0.5;
      const centerY = height * 0.52;

      for (let index = 0; index < particleCount; index += 1) {
        const group = index % 5;

        /*
          Base field: dots are spread across the section.
          Hover field: dots form a loose wave cloud around the cursor.
        */
        const baseAngle = Math.random() * Math.PI * 2;
        const baseRadius = Math.sqrt(Math.random()) * Math.min(width, height) * 0.58;

        const baseX =
          centerX + Math.cos(baseAngle) * baseRadius * (1.25 + Math.random() * 0.8);
        const baseY =
          centerY + Math.sin(baseAngle) * baseRadius * (0.55 + Math.random() * 0.55);

        const angle = Math.random() * Math.PI * 2;

        /*
          Bigger radius creates better split around cursor.
          This prevents dots from becoming one tight blob.
        */
        const radius =
          46 +
          Math.sqrt(Math.random()) * 270 +
          group * 10;

        const offsetX = Math.cos(angle) * radius * (1 + Math.random() * 0.38);
        const offsetY = Math.sin(angle) * radius * (0.5 + Math.random() * 0.62);

        particles.push({
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          vx: 0,
          vy: 0,
          offsetX,
          offsetY,
          size: Math.random() * 1.85 + 0.5,
          color: particleColors[group],
          alpha: Math.random() * 0.52 + 0.22,
          group,
          phase: Math.random() * Math.PI * 2,
          radius,
          angle,
          wavePower: Math.random() * 0.75 + 0.55,
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
      cursorRef.current.previousX = width * 0.5;
      cursorRef.current.previousY = height * 0.5;

      createParticles();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const cursor = cursorRef.current;
      const time = performance.now() * 0.001;

      cursor.x += (cursor.targetX - cursor.x) * 0.14;
      cursor.y += (cursor.targetY - cursor.y) * 0.14;

      const moveX = cursor.targetX - cursor.previousX;
      const moveY = cursor.targetY - cursor.previousY;

      cursor.speed +=
        (Math.min(Math.sqrt(moveX * moveX + moveY * moveY), 90) - cursor.speed) *
        0.1;

      cursor.previousX = cursor.targetX;
      cursor.previousY = cursor.targetY;

      particles.forEach((particle) => {
        /*
          Default wave field:
          This keeps the dots moving even when the user is not hovering.
        */
        const defaultWaveX =
          Math.sin(particle.baseY * 0.012 + time * 1.15 + particle.phase) *
            18 *
            particle.wavePower +
          Math.cos(time * 0.74 + particle.group) * 8;

        const defaultWaveY =
          Math.cos(particle.baseX * 0.01 + time * 1.05 + particle.phase) *
            14 *
            particle.wavePower +
          Math.sin(time * 0.82 + particle.group) * 7;

        /*
          Hover wave field:
          Dots follow cursor, but each particle keeps a different offset.
          This creates the split / anti-gravity effect from the demo.
        */
        const hoverWave =
          Math.sin(time * 3.2 + particle.phase + particle.group * 0.75) *
          (16 + cursor.speed * 0.14);

        const hoverWave2 =
          Math.cos(time * 2.7 + particle.phase) *
          (12 + cursor.speed * 0.1);

        const rotatedAngle =
          particle.angle +
          Math.sin(time * 0.9 + particle.phase) * 0.18 +
          cursor.speed * 0.002;

        const hoverOffsetX =
          Math.cos(rotatedAngle) * particle.radius +
          particle.offsetX * 0.38 +
          hoverWave;

        const hoverOffsetY =
          Math.sin(rotatedAngle) * particle.radius * 0.62 +
          particle.offsetY * 0.3 +
          hoverWave2;

        /*
          Cursor split:
          This creates a small empty center around the cursor,
          so particles split away instead of sitting under the mouse.
        */
        const dx = particle.x - cursor.x;
        const dy = particle.y - cursor.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        const splitRadius = 120 + cursor.speed * 0.7;
        const splitPower = cursor.active
          ? Math.max(0, (splitRadius - distance) / splitRadius)
          : 0;

        const splitX = (dx / distance) * splitPower * (90 + cursor.speed * 0.9);
        const splitY = (dy / distance) * splitPower * (90 + cursor.speed * 0.9);

        const targetX = cursor.active
          ? cursor.x + hoverOffsetX + splitX
          : particle.baseX + defaultWaveX;

        const targetY = cursor.active
          ? cursor.y + hoverOffsetY + splitY
          : particle.baseY + defaultWaveY;

        /*
          Correlation:
          Nearby particles share a similar wave direction through group phase.
          This makes the dots feel connected and fluid.
        */
        const correlation =
          cursor.active
            ? 0.072 + particle.group * 0.002
            : 0.026 + particle.group * 0.001;

        particle.vx += (targetX - particle.x) * correlation;
        particle.vy += (targetY - particle.y) * correlation;

        particle.vx *= cursor.active ? 0.8 : 0.9;
        particle.vy *= cursor.active ? 0.8 : 0.9;

        particle.x += particle.vx;
        particle.y += particle.vy;

        const activeAlpha = cursor.active
          ? Math.min(particle.alpha + 0.28, 0.95)
          : particle.alpha * 0.46;

        const activeSize = cursor.active
          ? particle.size * (1.05 + Math.min(cursor.speed, 60) * 0.004)
          : particle.size;

        ctx.globalAlpha = activeAlpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, activeSize, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrame = window.requestAnimationFrame(draw);
    };

    const updateCursor = (event: PointerEvent, activate: boolean) => {
      const rect = section.getBoundingClientRect();

      cursorRef.current.targetX = event.clientX - rect.left;
      cursorRef.current.targetY = event.clientY - rect.top;
      cursorRef.current.active = activate;
    };

    const handlePointerEnter = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      cursorRef.current.x = x;
      cursorRef.current.y = y;
      cursorRef.current.targetX = x;
      cursorRef.current.targetY = y;
      cursorRef.current.previousX = x;
      cursorRef.current.previousY = y;
      cursorRef.current.active = true;
    };

    const handlePointerMove = (event: PointerEvent) => {
      updateCursor(event, true);
    };

    const handlePointerLeave = () => {
      cursorRef.current.active = false;
      cursorRef.current.speed = 0;
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