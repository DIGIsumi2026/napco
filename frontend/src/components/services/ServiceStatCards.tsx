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
  return (
    <section className="service-stat-cards">
      <div className="service-stat-cards__float service-stat-cards__float--1" />
      <div className="service-stat-cards__float service-stat-cards__float--2" />
      <div className="service-stat-cards__float service-stat-cards__float--3" />
      <div className="service-stat-cards__float service-stat-cards__float--4" />

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

                  <a href="/contact#contact" className="service-stat-card__button">
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