import { useCallback, useEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import { imageAssets } from '../../data/imageAssets';
import { contactLinks, navigationLinks as navLinks, sidebarSocialLinks, socialLinks } from '../../data/siteNavigation';
import MobileSidebar from './MobileSidebar';

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
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 1024px)').matches);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileModalActive, setMobileModalActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const mobileOpenRef = useRef(false);
  const mobileModalActiveRef = useRef(false);
  mobileOpenRef.current = mobileOpen;
  mobileModalActiveRef.current = mobileModalActive;
  const reducedMotion = useReducedMotion();
  const location = useLocation();
  const navigate = useNavigate();
  const pendingNavigation = useRef<string | null>(null);
  const closeMobileMenu = useCallback(() => setMobileOpen(false), []);
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveringNavRef = useRef(false);

  const startHideTimeout = (duration: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (!isHoveringNavRef.current && !mobileModalActiveRef.current) {
        setShowPillNav(false);
      }
    }, duration);
  };

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 1024px)');
    const updateViewport = () => {
      setIsMobile(mobile.matches);
      if (!mobile.matches) {
        setMobileOpen(false);
        setMobileModalActive(false);
        if (pendingNavigation.current) {
          navigate(pendingNavigation.current);
          pendingNavigation.current = null;
        }
      }
    };
    mobile.addEventListener('change', updateViewport);
    return () => mobile.removeEventListener('change', updateViewport);
  }, [navigate]);

  useEffect(() => {
    pendingNavigation.current = null;
    closeMobileMenu();
  }, [location.key, closeMobileMenu]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      if (mobileModalActiveRef.current) return;
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
    if (scrolled && !mobileModalActiveRef.current) {
      startHideTimeout(500); // Disappear shortly after hover out
    }
  };

  const handleHamburgerClick = () => {
    if (isMobile) {
      if (!mobileOpen) {
        setMobileModalActive(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
      setMobileOpen(!mobileOpen);
      return;
    }
    if (isSidebarOpen) return;
    onToggleSidebar();
  };

  const menuToggle = (
    <button
      ref={toggleRef}
      type="button"
      className="napco-hamburger"
      onClick={handleHamburgerClick}
      aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isMobile ? mobileOpen : isSidebarOpen}
      aria-controls={isMobile ? 'napco-mobile-menu' : undefined}
      disabled={!isMobile && isSidebarOpen}
    >
      <motion.span
        className="hamburger-line"
        animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className="hamburger-line"
        animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className="hamburger-line"
        animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </button>
  );

  return (
    <div
      ref={containerRef}
      className={`napco-nav-root ${
        isSidebarOpen ? 'napco-nav-root--disabled' : ''
      } ${isMobile && scrolled ? 'napco-nav-root--mobile-scrolled' : ''}`}
      data-navbar
      aria-hidden={isSidebarOpen}
      role={mobileModalActive ? 'dialog' : undefined}
      aria-modal={mobileModalActive || undefined}
      aria-label={mobileModalActive ? 'Navigation menu' : undefined}
    >
      <AnimatePresence mode="wait">
        {!scrolled && (
          <motion.header
            key="glass-nav"
            className="napco-nav-glass"
            data-navbar-panel
            initial={{ opacity: 0, y: isMobile && reducedMotion ? 0 : -20 }}
            animate={{
              opacity: isSidebarOpen ? 0 : 1,
              y: isSidebarOpen ? -24 : 0,
              filter: isSidebarOpen ? 'blur(8px)' : 'blur(0px)',
            }}
            exit={{ opacity: 0, y: isMobile && reducedMotion ? 0 : -20 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <Link to="/" className="napco-nav-logo" aria-label="NAPCO Home" onClick={closeMobileMenu}>
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

              {menuToggle}
            </div>
          </motion.header>
        )}
        {scrolled && (showPillNav || mobileModalActive) && (
          <motion.div
            key="pill-nav"
            className="napco-nav-pill-wrap"
            onMouseEnter={handleNavMouseEnter}
            onMouseLeave={handleNavMouseLeave}
            data-navbar-panel
            initial={{ opacity: 0, scale: isMobile && reducedMotion ? 1 : 0.85, y: isMobile && reducedMotion ? 0 : -30 }}
            animate={{
              opacity: isSidebarOpen ? 0 : 1,
              scale: isSidebarOpen ? 0.92 : 1,
              y: isSidebarOpen ? -24 : 0,
              filter: isSidebarOpen ? 'blur(8px)' : 'blur(0px)',
            }}
            exit={{ opacity: 0, scale: isMobile && reducedMotion ? 1 : 0.85, y: isMobile && reducedMotion ? 0 : -30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <div className="napco-nav-pill">
              <Link to="/" className="napco-pill-logo" aria-label="NAPCO Home" onClick={closeMobileMenu}>
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

                {menuToggle}
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
      {isMobile && (
        <MobileSidebar
          open={mobileOpen}
          onClose={closeMobileMenu}
          onNavigate={(href) => {
            pendingNavigation.current = href;
            closeMobileMenu();
          }}
          onExitComplete={() => {
            if (mobileOpenRef.current) return;
            setMobileModalActive(false);
            if (scrolled) startHideTimeout(3500);
            if (pendingNavigation.current) {
              const href = pendingNavigation.current;
              pendingNavigation.current = null;
              navigate(href);
            }
          }}
          containerRef={containerRef}
          toggleRef={toggleRef}
          links={navLinks}
          contacts={contactLinks}
          socials={sidebarSocialLinks}
        />
      )}
    </div>
  );
}
