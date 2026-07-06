import { useEffect, useRef } from 'react';

import { imageAssets } from '../../data/imageAssets';

const serviceCards = [
  {
    title: 'Newspaper Printing',
    image: imageAssets.cards.newspaperPrinting,
    description:
      'Professional newspaper printing with reliable production capacity, consistent output quality and timely delivery for media and publishing requirements.',
  },
  {
    title: 'Books & Publishing',
    image: imageAssets.cards.booksPublishing,
    description:
      'Complete book production solutions from pre-press and printing to binding, finishing and final delivery for publishers and institutions.',
  },
  {
    title: 'Brochures & Catalogues',
    image: imageAssets.cards.brochuresCatalogues,
    description:
      'High-quality brochures and catalogues produced with glossy finishes, sharp printing, clean folds and premium paper quality.',
  },
  {
    title: 'Posters & Leaflets',
    image: imageAssets.cards.postersLeaflets,
    description:
      'Attractive posters and leaflets printed with vibrant colour reproduction, crisp trimming and refined finishing for strong visual impact.',
  },
  {
    title: 'Labels & Annual Reports',
    image: imageAssets.cards.labelsAnnualReports,
    description:
      'Premium labels and corporate annual reports produced with colour consistency, precise cutting, refined finishing and professional presentation.',
  },
  {
    title: 'Calendars & Diaries',
    image: imageAssets.cards.calendarsDiaries,
    description:
      'Customized calendars, diaries and planners with full-colour printing, professional binding, premium paper and elegant finishing.',
  },
];

export default function ServiceStatCards() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const shouldFloat =
      window.matchMedia('(min-width: 1024px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!shouldFloat) return;

    let rafId: number | null = null;
    let isActive = false;

    const updateFloatingElements = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const progress =
        (viewportHeight - rect.top) / (viewportHeight + rect.height);

      const clampedProgress = Math.min(Math.max(progress, 0), 1);
      const baseMove = (clampedProgress - 0.5) * 180;

      const floatingElements = section.querySelectorAll<HTMLElement>(
        '.service-stat-cards__float'
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
      if (!isActive) return;
      if (rafId !== null) return;

      rafId = window.requestAnimationFrame(updateFloatingElements);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isActive = entry.isIntersecting;

        if (isActive) {
          handleScroll();
        }
      },
      {
        rootMargin: '220px 0px',
        threshold: 0.01,
      }
    );

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    observer.observe(section);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      observer.disconnect();

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <section className="service-stat-cards" ref={sectionRef}>
      <div
        className="service-stat-cards__float service-stat-cards__float--printer"
        data-float-speed="0.8"
        data-direction="1"
        data-rotate="-10deg"
        data-cursor="Printer"
      >
        <div className="service-stat-cards__float-inner">
          <img
            src={imageAssets.services.floating.printer}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        className="service-stat-cards__float service-stat-cards__float--papers"
        data-float-speed="1.05"
        data-direction="-1"
        data-rotate="12deg"
        data-cursor="Papers"
      >
        <div className="service-stat-cards__float-inner">
          <img
            src={imageAssets.services.floating.papers}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        className="service-stat-cards__float service-stat-cards__float--cartridges"
        data-float-speed="0.9"
        data-direction="1"
        data-rotate="8deg"
        data-cursor="Ink"
      >
        <div className="service-stat-cards__float-inner">
          <img
            src={imageAssets.services.floating.cartridges}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        className="service-stat-cards__float service-stat-cards__float--cartridges-secondary"
        data-float-speed="0.8"
        data-direction="-1"
        data-rotate="-10deg"
        data-cursor="Ink"
      >
        <div className="service-stat-cards__float-inner">
          <img
            src={imageAssets.services.floating.cartridges2}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="service-stat-cards__inner">
        <div className="service-stat-cards__heading" data-reveal>
          <span>What We Print</span>

          <h2>
            Services crafted
            <br />
            with print quality.
          </h2>

          <p>
            Explore NAPCO’s key printing services, each supported by production
            strength, professional finishing and careful quality control.
          </p>
        </div>

        <div className="service-stat-cards__grid">
          {serviceCards.map((service) => (
            <article
              className="service-stat-card"
              key={service.title}
              data-cursor={service.title}
              data-reveal
            >
              <img
                src={service.image}
                alt={service.title}
                className="service-stat-card__image"
                loading="lazy"
                draggable="false"
              />

              <div className="service-stat-card__shade" />

              <div className="service-stat-card__content">
                <span className="service-stat-card__eyebrow">Service</span>

                <h3>{service.title}</h3>

                <div className="service-stat-card__hidden">
                  <p>{service.description}</p>

                  <a
                    href="/contact#contact"
                    className="service-stat-card__button"
                  >
                    Get a Quote
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}