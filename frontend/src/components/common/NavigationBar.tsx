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

interface NavigationBarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function NavigationBar({ onToggleSidebar, isSidebarOpen }: NavigationBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);

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

            {/* Center links (hidden on mobile) */}
            <nav className="napco-nav-links hidden md:flex">
              {navLinks.map(({ label, href }) => (
                <a key={label} href={href} className="napco-nav-link">
                  {label}
                </a>
              ))}
            </nav>

            <div className="napco-nav-actions">
              {/* Social icons (desktop only) */}
              <div className="napco-nav-socials hidden lg:flex">
                {socialLinks.map(({ Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label} className="napco-social-icon">
                    <Icon size={17} />
                  </a>
                ))}
              </div>

              {/* CTA */}
              <a
                href="#contact"
                className="napco-cta-wrapper"
                onMouseEnter={() => setIsHoveringCTA(true)}
                onMouseLeave={() => setIsHoveringCTA(false)}
              >
                <div className={`napco-cta-bg ${isHoveringCTA ? 'animate-spin-slow' : ''}`} />
                <div className="napco-cta-inner">Get a Quote</div>
              </a>

              {/* Hamburger */}
              <button className="napco-hamburger" onClick={onToggleSidebar} aria-label="Toggle menu">
                <motion.div
                  animate={isSidebarOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  className="hamburger-line"
                />
                <motion.div
                  animate={isSidebarOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="hamburger-line"
                />
                <motion.div
                  animate={isSidebarOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  className="hamburger-line"
                />
              </button>
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

              {/* Center links (hidden on mobile) */}
              <nav className="napco-pill-links hidden md:flex">
                {navLinks.map(({ label, href }) => (
                  <a key={label} href={href} className="napco-pill-link">
                    {label}
                  </a>
                ))}
              </nav>

              <div className="napco-nav-actions">
                {/* CTA */}
                <a
                  href="#contact"
                  className="napco-cta-wrapper pill-cta"
                  onMouseEnter={() => setIsHoveringCTA(true)}
                  onMouseLeave={() => setIsHoveringCTA(false)}
                >
                  <div className={`napco-cta-bg ${isHoveringCTA ? 'animate-spin-slow' : ''}`} />
                  <div className="napco-cta-inner">Get a Quote</div>
                </a>

                {/* Hamburger */}
                <button className="napco-hamburger" onClick={onToggleSidebar} aria-label="Toggle menu">
                  <motion.div
                    animate={isSidebarOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                    className="hamburger-line"
                  />
                  <motion.div
                    animate={isSidebarOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="hamburger-line"
                  />
                  <motion.div
                    animate={isSidebarOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                    className="hamburger-line"
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
