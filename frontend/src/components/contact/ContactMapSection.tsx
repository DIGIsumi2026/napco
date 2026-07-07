import { ExternalLink, MapPin } from 'lucide-react';

const GOOGLE_MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=6.9762959776077835,79.9315029699449';

const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.2796431904044!2d79.9315029699449!3d6.9762959776077835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae257e678132525%3A0xc407c14242fd00e4!2sNapco!5e0!3m2!1sen!2slk!4v1783397316195!5m2!1sen!2slk';

export default function ContactMapSection() {
  return (
    <section className="contact-map-section">
      <div className="contact-map-section__bg" />

      <div className="contact-map-section__inner">
        <div className="contact-map-section__content" data-reveal>
          <span className="contact-map-section__eyebrow">Find Us</span>

          <h2>
            Visit NAPCO
            <br />
            in Kiribathgoda.
          </h2>

          <p>
            Reach our printing facility for enquiries, project discussions and
            professional printing support.
          </p>

          <div className="contact-map-section__address">
            <span>
              <MapPin size={24} />
            </span>

            <strong>
              No. 17, Fathima Mawatha,
              <br />
              Off Makola Road,
              <br />
              Kiribathgoda, Sri Lanka.
            </strong>
          </div>

          <a
            href={GOOGLE_MAP_URL}
            target="_blank"
            rel="noreferrer"
            className="contact-map-section__button"
            data-cursor="Open Map"
          >
            Open in Google Maps
            <ExternalLink size={18} />
          </a>
        </div>

        <div className="contact-map-section__map-wrap" data-reveal>
          <iframe
            title="NAPCO location map"
            src={MAP_EMBED_URL}
            className="contact-map-section__map"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}