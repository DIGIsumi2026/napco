import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

import { imageAssets } from '../../data/imageAssets';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact Us', href: '/contact' },
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

export default function NavigationBar({
  onToggleSidebar,
  isSidebarOpen,
}: NavigationBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleHamburgerClick = () => {
    if (isSidebarOpen) return;
    onToggleSidebar();
  };

  return (
    <div
      className={`napco-nav-root ${
        isSidebarOpen ? 'napco-nav-root--disabled' : ''
      }`}
      data-navbar
      aria-hidden={isSidebarOpen}
    >
      <AnimatePresence mode="wait">
        {!scrolled ? (
          <motion.header
            key="glass-nav"
            className="napco-nav-glass"
            data-navbar-panel
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: isSidebarOpen ? 0 : 1,
              y: isSidebarOpen ? -24 : 0,
              filter: isSidebarOpen ? 'blur(8px)' : 'blur(0px)',
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <Link to="/" className="napco-nav-logo" aria-label="NAPCO Home">
              <img src={imageAssets.logo.main} alt="Napco" />
            </Link>

            <nav className="napco-nav-links hidden md:flex">
              {navLinks.map(({ label, href }) => (
                <Link key={label} to={href} className="napco-nav-link">
                  {label}
                </Link>
              ))}
            </nav>

            <div className="napco-nav-actions">
              <div className="napco-nav-socials hidden lg:flex">
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

              <Link
                to="/contact"
                className="napco-cta-wrapper"
                onMouseEnter={() => setIsHoveringCTA(true)}
                onMouseLeave={() => setIsHoveringCTA(false)}
              >
                <div
                  className={`napco-cta-bg ${
                    isHoveringCTA ? 'animate-spin-slow' : ''
                  }`}
                />
                <div className="napco-cta-inner">Get a Quote</div>
              </Link>

              <button
                type="button"
                className="napco-hamburger"
                onClick={handleHamburgerClick}
                aria-label="Open menu"
                disabled={isSidebarOpen}
              >
                <motion.div
                  animate={
                    isSidebarOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }
                  }
                  className="hamburger-line"
                />
                <motion.div
                  animate={isSidebarOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="hamburger-line"
                />
                <motion.div
                  animate={
                    isSidebarOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }
                  }
                  className="hamburger-line"
                />
              </button>
            </div>
          </motion.header>
        ) : (
          <motion.div
            key="pill-nav"
            className="napco-nav-pill-wrap"
            data-navbar-panel
            initial={{ opacity: 0, scale: 0.85, y: -30 }}
            animate={{
              opacity: isSidebarOpen ? 0 : 1,
              scale: isSidebarOpen ? 0.92 : 1,
              y: isSidebarOpen ? -24 : 0,
              filter: isSidebarOpen ? 'blur(8px)' : 'blur(0px)',
            }}
            exit={{ opacity: 0, scale: 0.85, y: -30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <div className="napco-nav-pill">
              <Link to="/" className="napco-pill-logo" aria-label="NAPCO Home">
                <img src={imageAssets.logo.main} alt="Napco" />
              </Link>

              <nav className="napco-pill-links hidden md:flex">
                {navLinks.map(({ label, href }) => (
                  <Link key={label} to={href} className="napco-pill-link">
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="napco-nav-actions">
                <Link
                  to="/contact"
                  className="napco-cta-wrapper pill-cta"
                  onMouseEnter={() => setIsHoveringCTA(true)}
                  onMouseLeave={() => setIsHoveringCTA(false)}
                >
                  <div
                    className={`napco-cta-bg ${
                      isHoveringCTA ? 'animate-spin-slow' : ''
                    }`}
                  />
                  <div className="napco-cta-inner">Get a Quote</div>
                </Link>

                <button
                  type="button"
                  className="napco-hamburger"
                  onClick={handleHamburgerClick}
                  aria-label="Open menu"
                  disabled={isSidebarOpen}
                >
                  <motion.div
                    animate={
                      isSidebarOpen
                        ? { rotate: 45, y: 8 }
                        : { rotate: 0, y: 0 }
                    }
                    className="hamburger-line"
                  />
                  <motion.div
                    animate={isSidebarOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="hamburger-line"
                  />
                  <motion.div
                    animate={
                      isSidebarOpen
                        ? { rotate: -45, y: -8 }
                        : { rotate: 0, y: 0 }
                    }
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