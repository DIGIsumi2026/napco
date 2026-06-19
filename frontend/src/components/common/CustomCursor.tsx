import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CursorFollower() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!dotRef.current || !ringRef.current) return;
    const dotX = gsap.quickTo(dotRef.current, 'x', { duration: 0.12, ease: 'power3.out' });
    const dotY = gsap.quickTo(dotRef.current, 'y', { duration: 0.12, ease: 'power3.out' });
    const ringX = gsap.quickTo(ringRef.current, 'x', { duration: 0.35, ease: 'power3.out' });
    const ringY = gsap.quickTo(ringRef.current, 'y', { duration: 0.35, ease: 'power3.out' });

    const move = (event: MouseEvent) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const enter = () => document.body.classList.add('is-hovering');
    const leave = () => document.body.classList.remove('is-hovering');

    window.addEventListener('mousemove', move);
    document.querySelectorAll('a, button, .cursor-target').forEach((node) => {
      node.addEventListener('mouseenter', enter);
      node.addEventListener('mouseleave', leave);
    });

    return () => {
      window.removeEventListener('mousemove', move);
      document.querySelectorAll('a, button, .cursor-target').forEach((node) => {
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
