import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import HeroCarousel from './HeroCarousel';

export default function Hero() {
  return (
    <section className="napco-hero" id="hero">

      {/* ── Background carousel ── */}
      <HeroCarousel />

      {/* ── Overlay text content ── */}
      <div className="napco-hero-overlay">
        <div className="napco-hero-content">

          <h1 className="napco-hero-heading">
            Your Impression is
            <br />
            <span className="napco-hero-accent">Our Responsibility</span>
          </h1>

          <p className="napco-hero-desc">
            From business cards to large format prints, Napco delivers precision,
            speed, and unmatched quality. Every project is crafted to leave a
            lasting impression.
          </p>

          <div className="napco-hero-actions">
            <a href="#about" className="napco-btn-primary">
              Learn More <ArrowRight size={17} />
            </a>
            <Link to="/contact#contact-form" className="napco-btn-outline">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="napco-scroll-hint">
          <ChevronDown size={22} />
        </div>
      </div>
    </section>
  );
}
