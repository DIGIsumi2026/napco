import { useEffect, useRef } from 'react';

export default function CursorFollower() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    const canUseCursor =
      window.matchMedia('(min-width: 1024px)').matches &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!canUseCursor) {
      dot.hidden = true;
      ring.hidden = true;
      return;
    }

    let frame = 0;
    let dotX = window.innerWidth * 0.5;
    let dotY = window.innerHeight * 0.5;
    let ringX = dotX;
    let ringY = dotY;
    let targetX = dotX;
    let targetY = dotY;

    const render = () => {
      dotX += (targetX - dotX) * 0.55;
      dotY += (targetY - dotY) * 0.55;
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;

      dot.style.transform = `translate3d(${dotX - 3.5}px, ${dotY - 3.5}px, 0)`;
      ring.style.transform = `translate3d(${ringX - 29}px, ${ringY - 29}px, 0)`;

      frame = window.requestAnimationFrame(render);
    };

    const move = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const enter = () => document.body.classList.add('is-hovering');
    const leave = () => document.body.classList.remove('is-hovering');
    const interactiveElements = document.querySelectorAll('a, button, .cursor-target');

    window.addEventListener('mousemove', move, { passive: true });
    interactiveElements.forEach((node) => {
      node.addEventListener('mouseenter', enter, { passive: true });
      node.addEventListener('mouseleave', leave, { passive: true });
    });

    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', move);
      document.body.classList.remove('is-hovering');

      interactiveElements.forEach((node) => {
        node.removeEventListener('mouseenter', enter);
        node.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}
