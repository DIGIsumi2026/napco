import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    napcoLenis?: any;
  }
}

export default function RouteScrollManager() {
  const location = useLocation();
  const lastPathname = useRef(location.pathname);

  // Function to save current scroll position
  const saveScrollPosition = (pathname: string) => {
    const scrollY = window.scrollY;
    sessionStorage.setItem(`napco-scroll:${pathname}`, scrollY.toString());
  };

  useEffect(() => {
    // 1. Save scroll position of the previous page before we handle the new one
    if (lastPathname.current !== location.pathname) {
      saveScrollPosition(lastPathname.current);
      lastPathname.current = location.pathname;
    }

    // 2. Mark this route as visited
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

    // We use a small timeout to allow DOM to render before measuring offsets
    const timeoutId = setTimeout(() => {
      // A. If there's a hash, scroll to that element
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

      // B. If no hash, and we've visited this route before, restore position
      const savedScroll = sessionStorage.getItem(`napco-scroll:${location.pathname}`);
      
      if (!isFirstVisit && savedScroll !== null) {
        const top = parseInt(savedScroll, 10) || 0;
        if (window.napcoLenis) {
          window.napcoLenis.scrollTo(top, { immediate: true });
        } else {
          window.scrollTo({ top, behavior: 'auto' });
        }
      } 
      // C. First visit (or no saved scroll), scroll to top
      else {
        if (window.napcoLenis) {
          window.napcoLenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo({ top: 0, behavior: 'auto' });
        }
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [location]);

  // Optionally, save on beforeunload so we don't lose the position if user refreshes
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition(location.pathname);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);

  return null;
}
