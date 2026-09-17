import { useEffect, useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
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
  { Icon: Facebook, href: 'https://www.facebook.com/share/1EmKKmMVfr/?mibextid=wwXIfr', label: 'Facebook' },
  { Icon: Instagram, href: 'https://www.instagram.com/napcolk?igsh=MWk0ajNrdDFxODB5ZA==', label: 'Instagram' },
  { Icon: Linkedin, href: 'https://www.linkedin.com/company/napcopvtltd/', label: 'LinkedIn' },
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
  const [showPillNav, setShowPillNav] = useState(false);
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveringNavRef = useRef(false);

  const startHideTimeout = (duration: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (!isHoveringNavRef.current) {
        setShowPillNav(false);
      }
    }, duration);
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrolledDownPastThreshold = currentScrollY > 60;
      
      setScrolled(isScrolledDownPastThreshold);

      if (isScrolledDownPastThreshold) {
        if (currentScrollY < lastScrollY - 2) {
          // Scrolling UP (with a small threshold of 2px to prevent jitter)
          setShowPillNav(true);
          startHideTimeout(3500); // Appear for 3.5 seconds
        } else if (currentScrollY > lastScrollY + 2) {
          // Scrolling DOWN
          if (!isHoveringNavRef.current) {
            setShowPillNav(false);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }
        }
      } else {
         // Back at top
         setShowPillNav(false);
         if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
      
      lastScrollY = currentScrollY;
    };

    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleNavMouseEnter = () => {
    isHoveringNavRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleNavMouseLeave = () => {
    isHoveringNavRef.current = false;
    if (scrolled) {
      startHideTimeout(500); // Disappear shortly after hover out
    }
  };

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
        {!scrolled && (
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
              <img src={imageAssets.logo.nav} alt="Napco" />
            </Link>

            <nav className="napco-nav-links hidden md:flex">
              {navLinks.map(({ label, href }) => (
                <NavLink key={label} to={href} className="napco-nav-link" data-cursor-type="nav">
                  {label}
                </NavLink>
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
                to="/contact#contact-form"
                className="napco-cta-wrapper hidden md:flex"
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
        )}
        {scrolled && showPillNav && (
          <motion.div
            key="pill-nav"
            className="napco-nav-pill-wrap"
            onMouseEnter={handleNavMouseEnter}
            onMouseLeave={handleNavMouseLeave}
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
                <img src={imageAssets.logo.nav} alt="Napco" />
              </Link>

              <nav className="napco-pill-links hidden md:flex">
                {navLinks.map(({ label, href }) => (
                  <NavLink key={label} to={href} className="napco-pill-link" data-cursor-type="nav">
                    {label}
                  </NavLink>
                ))}
              </nav>

              <div className="napco-nav-actions">
                <Link
                  to="/contact#contact-form"
                  className="napco-cta-wrapper pill-cta hidden md:flex"
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
            
            <div className="napco-nav-socials-floating hidden lg:flex">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}