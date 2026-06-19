import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ThreeOrb from './ThreeOrb';

export default function Hero() {
  return (
    <section className="hero-section section-anchor" data-reveal>
      <div className="hero-bg" />
      <span className="floating-dot dot-one" />
      <span className="floating-dot dot-two" />
      <span className="floating-chevron">▶▶▶▶▶</span>
      <ThreeOrb />
      <div className="hero-content">
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-kicker"
        >
          Modern print design studio
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Print Exactly <br /> What You Want
        </motion.h1>
        <motion.a
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="purple-button"
          href="#services"
        >
          Let’s Get Started <ArrowRight size={19} />
        </motion.a>
      </div>
    </section>
  );
}
