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
  const animationFrameRef = useRef<number | null>(null);

 useEffect(() => {
  const section = sectionRef.current;
  if (!section) return;

  let rafId: number | null = null;

  const updateFloatingElements = () => {
    const rect = section.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const scrollInsideSection = window.scrollY - sectionTop;

    const floatingElements = section.querySelectorAll<HTMLElement>(
      '.service-stats__float'
    );

    floatingElements.forEach((element) => {
      const speed = Number(element.dataset.floatSpeed || 0.2);
      const y = scrollInsideSection * speed;

      element.style.setProperty('--float-y', `${y}px`);
    });

    rafId = null;
  };

  const handleScroll = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(updateFloatingElements);
  };

  updateFloatingElements();

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll);

  return () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleScroll);

    if (rafId) {
      window.cancelAnimationFrame(rafId);
    }
  };
}, []);


  return (
    <section className="service-stats" ref={sectionRef}>
      <div className="service-stats__float service-stats__float--printer">
        <img
          src={imageAssets.services.floating.printer}
          alt=""
          aria-hidden="true"
        />
      </div>

      <div className="service-stats__float service-stats__float--papers">
        <img
          src={imageAssets.services.floating.papers}
          alt=""
          aria-hidden="true"
        />
      </div>

      <div className="service-stats__float service-stats__float--cartridges">
        <img
          src={imageAssets.services.floating.cartridges}
          alt=""
          aria-hidden="true"
        />
      </div>

      <div className="service-stats__float service-stats__float--cartridges">
        <img
          src={imageAssets.services.floating.cartridges2}
          alt=""
          aria-hidden="true"
        />
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