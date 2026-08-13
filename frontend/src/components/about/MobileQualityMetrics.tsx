import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { label: 'Years of Experience', value: 25, suffix: '+' },
  { label: 'Projects Completed', value: 5000, suffix: '+' },
  { label: 'Client Satisfaction', value: 99, suffix: '%' },
  { label: 'Printing Accuracy', value: 100, suffix: '%' },
];

export default function MobileQualityMetrics() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 1024
  );
  const sectionRef = useRef<HTMLElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!isMobile || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      numberRefs.current.forEach((el, index) => {
        if (!el) return;
        const targetValue = metrics[index].value;
        const obj = { val: 0 };
        
        gsap.to(obj, {
          val: targetValue,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            el.innerText = Math.floor(obj.val).toString();
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  if (!isMobile) return null;

  return (
    <section className="mobile-metrics" ref={sectionRef}>
      <div className="mobile-metrics__header">
        <span>Printing Quality Metrics</span>
        <h2>Proven Excellence</h2>
      </div>
      <div className="mobile-metrics__grid">
        {metrics.map((metric, index) => (
          <div key={metric.label} className="mobile-metrics__card">
            <div className="mobile-metrics__value">
              <span ref={(el) => (numberRefs.current[index] = el)}>0</span>
              <span className="mobile-metrics__suffix">{metric.suffix}</span>
            </div>
            <div className="mobile-metrics__label">{metric.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
