import { Link } from 'react-router-dom';
import { imageAssets } from '../../data/imageAssets';

export default function ServicesHero() {
  return (
    <section className="services-hero">
      <div className="services-hero__media">
        <img
          src={imageAssets.servicesHero.heroTeam}
          alt="NAPCO professional staff representing printing services"
          className="services-hero__image"
        />
      </div>

      <div className="services-hero__fade" />

      <div className="services-hero__content">
        <span className="services-hero__eyebrow">Our Services</span>

        <h1>
          Printing solutions
          <br />
          for every industry.
        </h1>

        <p>
          From newspapers and books to commercial printing, labels, calendars,
          annual reports and premium finishing, NAPCO delivers complete print
          solutions with professional care.
        </p>

        <Link to="/contact#contact-form" className="services-hero__button">
          Get a Quote
        </Link>
      </div>
    </section>
  );
}