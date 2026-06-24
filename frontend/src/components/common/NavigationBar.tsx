import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { imageAssets } from '../../data/imageAssets';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact Us', href: '#contact' },
];

const socialLinks = [
  { Icon: Facebook, href: '#', label: 'Facebook' },
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export default function NavigationBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="napco-nav-root" id="home">
      <AnimatePresence mode="wait">
        {!scrolled ? (
          /* ─── DEFAULT: Full-width glass bar ─── */
          <motion.header
            key="glass-nav"
            className="napco-nav-glass"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {/* Logo */}
            <a href="#home" className="napco-nav-logo">
              <img src={imageAssets.logo.main} alt="Napco" />
            </a>

            {/* Center links */}
            <nav className="napco-nav-links">
              {navLinks.map(({ label, href }) => (
                <a key={label} href={href} className="napco-nav-link">
                  {label}
                </a>
              ))}
            </nav>

            {/* Social icons */}
            <div className="napco-nav-socials">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="napco-social-icon"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </motion.header>
        ) : (
          /* ─── SCROLLED: Floating pill ─── */
          <motion.div
            key="pill-nav"
            className="napco-nav-pill-wrap"
            initial={{ opacity: 0, scale: 0.85, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <div className="napco-nav-pill">
              {/* Logo */}
              <a href="#home" className="napco-pill-logo">
                <img src={imageAssets.logo.main} alt="Napco" />
              </a>

              {/* Center links */}
              <nav className="napco-pill-links">
                {navLinks.map(({ label, href }) => (
                  <a key={label} href={href} className="napco-pill-link">
                    {label}
                  </a>
                ))}
              </nav>

              {/* CTA */}
              <a href="#contact" className="napco-pill-cta">
                Get a Quote
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
