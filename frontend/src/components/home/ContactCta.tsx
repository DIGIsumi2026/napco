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
};

const particleColors = ['#0053a0', '#00aeef', '#ec008c', '#fff200', '#111111'];

export default function ContactCta() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({
    x: -9999,
    y: -9999,
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
    const particleCount = 620;

    const createParticles = () => {
      particles = [];

      for (let index = 0; index < particleCount; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * Math.min(width, height) * 0.5;

        const centerX = width * 0.5;
        const centerY = height * 0.55;

        const baseX = centerX + Math.cos(angle) * radius * (0.9 + Math.random() * 0.8);
        const baseY = centerY + Math.sin(angle) * radius * (0.55 + Math.random() * 0.65);

        particles.push({
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          vx: 0,
          vy: 0,
          size: Math.random() * 1.8 + 0.45,
          color: particleColors[index % particleColors.length],
          alpha: Math.random() * 0.55 + 0.18,
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
      createParticles();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      particles.forEach((particle) => {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = mouse.active ? 190 : 0;

        if (distance < repelRadius) {
          const force = (repelRadius - distance) / repelRadius;
          const angle = Math.atan2(dy, dx);

          particle.vx += Math.cos(angle) * force * 3.2;
          particle.vy += Math.sin(angle) * force * 3.2;
        }

        const returnX = (particle.baseX - particle.x) * 0.025;
        const returnY = (particle.baseY - particle.y) * 0.025;

        particle.vx += returnX;
        particle.vy += returnY;

        particle.vx *= 0.88;
        particle.vy *= 0.88;

        particle.x += particle.vx;
        particle.y += particle.vy;

        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrame = window.requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();

      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    resize();
    draw();

    window.addEventListener('resize', resize);
    section.addEventListener('pointermove', handlePointerMove);
    section.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('resize', resize);
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
        <span className="contact-cta__eyebrow">Let’s Print Something Great</span>

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
          <a href="/contact-us" className="contact-cta__button contact-cta__button--primary" data-cursor="Contact">
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