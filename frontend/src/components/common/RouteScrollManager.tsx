import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    napcoLenis?: any;
  }
}

const SCROLL_KEY_PREFIX = 'napco-scroll:';
const SESSION_INIT_KEY = 'napco-session-init';

function scrollTo(top: number, instant = false) {
  if (window.napcoLenis) {
    window.napcoLenis.scrollTo(top, { immediate: instant, force: true });
  } else {
    window.scrollTo({ top, behavior: instant ? 'instant' : 'smooth' });
  }
}

export default function RouteScrollManager() {
  const location = useLocation();
  // Track whether this is a genuine in-app navigation vs. a page load / refresh
  const isInAppNav = useRef(false);

  // Disable browser native scroll restoration — we handle it ourselves
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Continuously save current scroll position to localStorage for this route
  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        localStorage.setItem(
          `${SCROLL_KEY_PREFIX}${location.pathname}`,
          window.scrollY.toString()
        );
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [location.pathname]);

  // On every route change: restore or reset scroll
  useEffect(() => {
    // --- Handle hash links (#section) ---
    if (location.hash) {
      const id = setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) {
          if (window.napcoLenis) {
            window.napcoLenis.scrollTo(el, { duration: 1.05, offset: -90 });
          } else {
            window.scrollTo({
              top: el.getBoundingClientRect().top + window.scrollY - 90,
              behavior: 'smooth',
            });
          }
        }
      }, 60);
      isInAppNav.current = true;
      return () => clearTimeout(id);
    }

    // --- Determine intent ---
    // `SESSION_INIT_KEY` in sessionStorage means this tab has already
    // been initialised at least once (i.e. we are NOT on the very first
    // page load of a brand-new tab). Refreshes also survive sessionStorage,
    // so sessionStorage.getItem will return the value after a refresh too.
    const sessionAlreadyActive = sessionStorage.getItem(SESSION_INIT_KEY) !== null;

    if (!sessionAlreadyActive) {
      // Absolute first load of this tab → mark the session, go to top
      sessionStorage.setItem(SESSION_INIT_KEY, '1');
      isInAppNav.current = true;

      const id = setTimeout(() => scrollTo(0, true), 60);
      return () => clearTimeout(id);
    }

    // After the first load, every subsequent call here is either:
    //   a) An in-app navigation (link click) — already marked above
    //   b) A refresh — sessionStorage survives, so sessionAlreadyActive = true
    //   c) A return visit in the same tab — sessionStorage survives

    const savedScroll = localStorage.getItem(
      `${SCROLL_KEY_PREFIX}${location.pathname}`
    );

    const id = setTimeout(() => {
      if (isInAppNav.current) {
        // In-app navigation: always go to top of new page
        scrollTo(0, true);
      } else if (savedScroll !== null) {
        // Refresh or return visit: restore last position
        scrollTo(parseInt(savedScroll, 10) || 0, true);
      } else {
        // No saved position yet: go to top
        scrollTo(0, true);
      }
      // Mark that the next change will be an in-app navigation
      isInAppNav.current = true;
    }, 60);

    return () => clearTimeout(id);
  }, [location]);

  return null;
}

