import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import HeroCarousel from './HeroCarousel';

export default function Hero() {
  return (
    <section className="napco-hero" id="hero" data-reveal>

      {/* ── Background carousel ── */}
      <HeroCarousel />

      {/* ── Overlay text content ── */}
      <div className="napco-hero-overlay">
        <div className="napco-hero-content center-align">

          <motion.span
            className="napco-hero-tag"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            Premium Printing Solutions
          </motion.span>

          <motion.h1
            className="napco-hero-heading"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
          >
            Your Impression is{' '}
            <span className="napco-hero-accent">Our Responsibility</span>
          </motion.h1>

          <motion.p
            className="napco-hero-desc"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.36 }}
          >
            From business cards to large-format prints, Napco delivers precision,
            speed, and unmatched quality. Every project is crafted to leave a
            lasting impression.
          </motion.p>

          <motion.div
            className="napco-hero-actions center-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <a href="#about" className="napco-btn-primary">
              Learn More <ArrowRight size={17} />
            </a>
            <a href="#contact" className="napco-btn-outline">
              Contact Us
            </a>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="napco-scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <ChevronDown size={22} />
        </motion.div>
      </div>
    </section>
  );
}
