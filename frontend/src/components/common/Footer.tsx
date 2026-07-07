import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

import { imageAssets } from '../../data/imageAssets';

const GOOGLE_MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=6.9762959776077835,79.9315029699449';

const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.2796431904044!2d79.9315029699449!3d6.9762959776077835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae257e678132525%3A0xc407c14242fd00e4!2sNapco!5e0!3m2!1sen!2slk!4v1783397316195!5m2!1sen!2slk';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Contact', path: '/contact' },
];

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1EmKKmMVfr/?mibextid=wwXIfr',
    icon: Facebook,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/napcolk?igsh=MWk0ajNrdDFxODB5ZA==',
    icon: Instagram,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/napcopvtltd/',
    icon: Linkedin,
  },
];

export default function Footer() {
  return (
    <footer className="napco-footer">
      <div className="napco-footer__glow napco-footer__glow--cyan" />
      <div className="napco-footer__glow napco-footer__glow--purple" />
      <div className="napco-footer__glow napco-footer__glow--yellow" />

      <div className="napco-footer__inner">
        <div className="napco-footer__brand">
          <Link to="/" className="napco-footer__logo" aria-label="NAPCO Home">
            <img src={imageAssets.brand.logo} alt="NAPCO" />
          </Link>

          <p>
            NAPCO delivers professional printing solutions across newspapers,
            books, brochures, catalogues, labels, annual reports, stationery and
            premium finishing services.
          </p>

          <div className="napco-footer__socials">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={href === '#' ? undefined : '_blank'}
                rel={href === '#' ? undefined : 'noreferrer'}
                data-cursor={label}
              >
                <Icon size={19} />
              </a>
            ))}
          </div>
        </div>

        <div className="napco-footer__links">
          <h3>Quick Links</h3>

          <nav aria-label="Footer navigation">
            {quickLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="napco-footer__contact">
          <h3>Contact Us</h3>

          <ul>
            <li>
              <span>
                <MapPin size={19} />
              </span>

              <p>
                No. 17, Fathima Mawatha,
                <br />
                Off Makola Road,
                <br />
                Kiribathgoda, Sri Lanka.
              </p>
            </li>

            <li>
              <span>
                <Phone size={19} />
              </span>

              <a href="tel:+94112910015">+94 11 2910015</a>
            </li>

            <li>
              <span>
                <Mail size={19} />
              </span>

              <a href="mailto:info@napco.lk">info@napco.lk</a>
            </li>
          </ul>
        </div>

        <div className="napco-footer__map">
          <h3>Find Us</h3>

          <a
            href={GOOGLE_MAP_URL}
            target="_blank"
            rel="noreferrer"
            className="napco-footer__map-frame"
            aria-label="Open NAPCO location in Google Maps"
          >
            <iframe
              title="NAPCO location map"
              src={MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </a>
        </div>
      </div>

      <div className="napco-footer__bottom">
        <p>© {new Date().getFullYear()} NAPCO. All rights reserved.</p>
        <span>Professional Printing Solutions in Sri Lanka</span>
      </div>
    </footer>
  );
}