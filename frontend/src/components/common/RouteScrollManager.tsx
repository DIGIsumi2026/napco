import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    napcoLenis?: any;
  }
}

export default function RouteScrollManager() {
  const location = useLocation();

  // Disable browser's default scroll restoration to prevent jumping
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Continuously save the scroll position for the CURRENT route
  useEffect(() => {
    let timeoutId: number;
    const handleScroll = () => {
      if (timeoutId) cancelAnimationFrame(timeoutId);
      timeoutId = requestAnimationFrame(() => {
        sessionStorage.setItem(`napco-scroll:${location.pathname}`, window.scrollY.toString());
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(timeoutId);
    };
  }, [location.pathname]);

  useEffect(() => {
    // 1. Mark this route as visited
    const visitedRoutesStr = sessionStorage.getItem('napco-visited-routes') || '[]';
    let visitedRoutes: string[] = [];
    try {
      visitedRoutes = JSON.parse(visitedRoutesStr);
    } catch (e) {
      // Ignore
    }

    const isFirstVisit = !visitedRoutes.includes(location.pathname);
    if (isFirstVisit) {
      visitedRoutes.push(location.pathname);
      sessionStorage.setItem('napco-visited-routes', JSON.stringify(visitedRoutes));
    }

    // 2. Restore or reset scroll position
    // Use a small timeout to allow DOM layout to calculate before scrolling
    const timeoutId = setTimeout(() => {
      if (location.hash) {
        const targetElement = document.querySelector(location.hash);
        if (targetElement) {
          if (window.napcoLenis) {
            window.napcoLenis.scrollTo(targetElement, { duration: 1.05, offset: -90 });
          } else {
            const top = targetElement.getBoundingClientRect().top + window.scrollY - 90;
            window.scrollTo({ top, behavior: 'smooth' });
          }
          return;
        }
      }

      const savedScroll = sessionStorage.getItem(`napco-scroll:${location.pathname}`);
      
      if (!isFirstVisit && savedScroll !== null) {
        // Restore position
        const top = parseInt(savedScroll, 10) || 0;
        if (window.napcoLenis) {
          window.napcoLenis.scrollTo(top, { immediate: true, force: true });
        } else {
          window.scrollTo({ top, behavior: 'instant' });
        }
      } else {
        // First visit: go to hero section
        if (window.napcoLenis) {
          window.napcoLenis.scrollTo(0, { immediate: true, force: true });
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      }
    }, 60);

    return () => clearTimeout(timeoutId);
  }, [location]);

  return null;
}
