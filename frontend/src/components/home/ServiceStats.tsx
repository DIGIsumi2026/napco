import { useEffect, useRef } from 'react';
import {
  BookOpen,
  CalendarDays,
  FileText,
  Newspaper,
  Printer,
  Tags,
} from 'lucide-react';

import { imageAssets } from '../../data/imageAssets';

const services = [
  {
    icon: Newspaper,
    title: 'Newspaper Printing',
    description:
      'Reliable newspaper printing with professional production capacity and excellent output quality.',
  },
  {
    icon: BookOpen,
    title: 'Books & Publishing',
    description:
      'Complete soft-cover and hard-cover book production from pre-press to binding and finishing.',
  },
  {
    icon: FileText,
    title: 'Brochures & Catalogues',
    description:
      'High-quality brochures and catalogues designed for corporate, commercial and promotional needs.',
  },
  {
    icon: Printer,
    title: 'Posters & Leaflets',
    description:
      'Attractive posters and leaflets with CMYK, special colour, UV coating and lamination options.',
  },
  {
    icon: CalendarDays,
    title: 'Calendars & Diaries',
    description:
      'Customized calendars, diaries and planners with full-colour printing and professional finishing.',
  },
  {
    icon: Tags,
    title: 'Labels & Annual Reports',
    description:
      'Professional labels, tags, stationery and annual reports with strong finishing standards.',
  },
];

export default function ServiceStats() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId: number | null = null;

    const updateFloatingElements = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate how far the section has progressed through the viewport
      const progress =
        (viewportHeight - rect.top) / (viewportHeight + rect.height);

      const clampedProgress = Math.min(Math.max(progress, 0), 1);
      
      // Base movement range (e.g. 180px total travel)
      const baseMove = (clampedProgress - 0.5) * 180;

      const floatingElements = section.querySelectorAll<HTMLElement>(
        '.service-stats__float'
      );

      floatingElements.forEach((element) => {
        const speed = Number(element.dataset.floatSpeed || '1');
        const rotate = element.dataset.rotate || '0deg';
        const direction = Number(element.dataset.direction || '1');

        const y = baseMove * speed * direction;

        element.style.transform = `translate3d(0, ${y}px, 0) rotate(${rotate})`;
      });

      rafId = null;
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateFloatingElements);
    };

    updateFloatingElements();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <section className="service-stats" ref={sectionRef}>
      <div
        className="service-stats__float service-stats__float--printer"
        data-float-speed="0.8"
        data-direction="1"
        data-rotate="-10deg"
        data-cursor="Printer"
      >
        <div className="service-stats__float-inner">
          <img
            src={imageAssets.services.floating.printer}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        className="service-stats__float service-stats__float--papers"
        data-float-speed="1.05"
        data-direction="-1"
        data-rotate="12deg"
        data-cursor="Papers"
      >
        <div className="service-stats__float-inner">
          <img
            src={imageAssets.services.floating.papers}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        className="service-stats__float service-stats__float--cartridges"
        data-float-speed="0.9"
        data-direction="1"
        data-rotate="8deg"
        data-cursor="Ink"
      >
        <div className="service-stats__float-inner">
          <img
            src={imageAssets.services.floating.cartridges}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="service-stats__inner">
        <div className="service-stats__heading">
          <span className="service-stats__pill">Premium Printing Solutions</span>

          <h2>Services Built for Every Brand Impression</h2>

          <p>
            From commercial printing to publishing and finishing, NAPCO delivers
            professional print solutions with quality, reliability and attention
            to detail.
          </p>
        </div>

        <div className="service-stats__grid">
          {services.map(({ icon: Icon, title, description }, index) => (
            <article
              className="service-stats__card"
              key={title}
              style={{ '--card-index': index } as React.CSSProperties}
            >
              <span className="service-stats__icon">
                <Icon size={28} />
              </span>

              <h3>{title}</h3>

              <p>{description}</p>

              <span className="service-stats__number">
                {String(index + 1).padStart(2, '0')}
              </span>
            </article>
          ))}
        </div>

        <div className="service-stats__action">
          <a href="/services" className="service-stats__button" data-cursor="See More">
            See More
          </a>
        </div>
      </div>
    </section>
  );
}