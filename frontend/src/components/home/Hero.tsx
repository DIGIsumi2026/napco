import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';
import HeroCarousel from './HeroCarousel';

export default function Hero() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="napco-hero" id="hero">

      {/* ── Background carousel ── */}
      <HeroCarousel swiperRef={swiperRef} />

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

          <div className="napco-hero-action-stack">
            <div className="napco-hero-actions">
              <a href="#about" className="napco-btn-primary">
                Learn More <ArrowRight size={17} />
              </a>
              <Link to="/contact#contact-form" className="napco-btn-outline">
                Contact Us
              </Link>
            </div>
            <div className="hero-pagination-controls">
              <button
                type="button"
                className="hero-pagination-control"
                aria-label="Previous hero image"
                title="Previous image"
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <ChevronLeft size={19} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="hero-pagination-control"
                aria-label="Next hero image"
                title="Next image"
                onClick={() => swiperRef.current?.slideNext()}
              >
                <ChevronRight size={19} aria-hidden="true" />
              </button>
            </div>
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
