import { Link } from 'react-router-dom';
import { imageAssets } from '../../data/imageAssets';

export default function ContactHero() {
  return (
    <section className="contact-hero">
      <div className="contact-hero__media">
        <img
          src={imageAssets.contact.hero}
          alt="NAPCO contact and customer support"
          className="contact-hero__image"
        />
      </div>

      <div className="contact-hero__shade" />

      <div className="contact-hero__content" data-reveal>
        <span className="contact-hero__eyebrow">Contact NAPCO</span>

        <h1>
          Let’s discuss
          <br />
          your next print.
        </h1>

        <p>
          Connect with NAPCO for newspapers, books, brochures, catalogues,
          labels, calendars, annual reports and complete commercial printing
          solutions.
        </p>

        <div className="contact-hero__actions">
          <Link to="/contact#contact-form" className="contact-hero__button">
            Get a Quote
          </Link>

          <a href="tel:+94112910015" className="contact-hero__button contact-hero__button--ghost">
            Call Us
          </a>
        </div>
      </div>
    </section>
  );
}