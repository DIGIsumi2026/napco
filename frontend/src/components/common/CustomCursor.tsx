import { useEffect, useRef, useState } from 'react';

// Easing function for the outer ring trailing
const lerp = (start: number, end: number, amt: number) => {
  return (1 - amt) * start + amt * end;
};

export default function CustomCursor() {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  const requestRef = useRef<number>();
  const mouse = useRef({ x: 0, y: 0 });
  const outer = useRef({ x: 0, y: 0 });
  
  // Track previous position for velocity calculation
  const lastMouse = useRef({ x: 0, y: 0 });
  const lastTime = useRef(performance.now());
  const velocity = useRef({ x: 0, y: 0 });

  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [cursorState, setCursorState] = useState({
    type: 'default',
    label: ''
  });

  // Check if custom cursor should be enabled
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Enable only on fine pointers and wide screens, respecting reduced motion
    const checkEnvironment = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      const isDesktop = window.innerWidth > 1024;
      
      setIsEnabled(isDesktop && !isTouch && !prefersReducedMotion);
      
      if (isDesktop && !isTouch && !prefersReducedMotion) {
        document.body.classList.add('custom-cursor-active');
      } else {
        document.body.classList.remove('custom-cursor-active');
      }
    };
    
    checkEnvironment();
    window.addEventListener('resize', checkEnvironment, { passive: true });
    
    // Initial reveal animation delay
    const t = setTimeout(() => setIsReady(true), 100);
    
    return () => {
      window.removeEventListener('resize', checkEnvironment);
      document.body.classList.remove('custom-cursor-active');
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      
      // Immediately update inner dot to completely avoid lag
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      
      if (!isVisible) setIsVisible(true);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();

      // Highest priority: buttons and links (read label if available)
      const btnOrLink = target.closest('button, a');
      if (btnOrLink) {
        let label = btnOrLink.getAttribute('data-cursor-label');
        
        // EXCLUSIONS: The user requested no labels for specific areas.
        // We check if the button/link is inside an excluded container.
        const isExcluded = btnOrLink.closest(
          'nav, header, footer, .sidebar, .services-visual, .about-printing, .napco-about, .quality-metrics, .contact-form, .feedback-form, form'
        );

        // Only apply automatic href mappings if NOT excluded
        if (!label && !isExcluded && btnOrLink instanceof HTMLAnchorElement) {
          const href = btnOrLink.getAttribute('href') || '';
          if (href.startsWith('mailto:')) {
            label = 'Mail';
          } else if (href.startsWith('tel:')) {
            label = 'Call';
          } else if (href.includes('wa.me') || href.includes('whatsapp')) {
            label = 'Chat';
          } else if (href.includes('maps') || href.includes('directions')) {
            label = 'Map';
          } else if (href.includes('facebook.com')) {
            label = 'Facebook';
          } else if (href.includes('linkedin.com')) {
            label = 'LinkedIn';
          } else if (href.includes('twitter.com') || href.includes('x.com')) {
            label = 'Twitter';
          } else if (href.includes('instagram.com')) {
            label = 'Instagram';
          }
        }

        if (!label && !isExcluded && btnOrLink.textContent?.toLowerCase().includes('quote')) {
          label = 'Quote';
        }
        
        // Final sanity check: if it's explicitly excluded, ensure label is empty
        if (isExcluded) {
          label = '';
        }

        let explicitType = btnOrLink.getAttribute('data-cursor-type') || 'button';
        
        // If there's no label to show (or it's excluded), use the subtle 'nav' pop effect
        if (!label || isExcluded) {
          explicitType = 'nav';
        }

        setCursorState({ type: explicitType, label: label || '' });
        return;
      }

      // Second priority: text elements
      if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'strong', 'small', 'li', 'em'].includes(tag)) {
        setCursorState({ type: 'text', label: '' });
        return;
      }

      // Third priority: explicit data-cursor on parents
      const cursorTarget = target.closest('[data-cursor-type]');
      if (cursorTarget) {
        const type = cursorTarget.getAttribute('data-cursor-type') || 'default';
        const label = cursorTarget.getAttribute('data-cursor-label') || '';
        setCursorState({ type, label });
        return;
      } 
      
      // Default
      setCursorState({ type: 'default', label: '' });
    };

    const onScroll = () => {
      // Small vertical stretch when scrolling is handled in the animation loop via velocity
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const animate = (time: number) => {
      const dt = Math.max(1, time - lastTime.current);
      lastTime.current = time;

      // Calculate trailing position for outer ring
      outer.current.x = lerp(outer.current.x, mouse.current.x, 0.2);
      outer.current.y = lerp(outer.current.y, mouse.current.y, 0.2);

      // Calculate velocity for stretching effect
      velocity.current.x = (mouse.current.x - lastMouse.current.x) / dt;
      velocity.current.y = (mouse.current.y - lastMouse.current.y) / dt;
      
      lastMouse.current = { x: mouse.current.x, y: mouse.current.y };

      if (outerRef.current) {
        // Stretch based on Y velocity for scroll effect
        const stretch = Math.min(1 + Math.abs(velocity.current.y) * 0.15, 1.3);
        
        outerRef.current.style.transform = `translate3d(${outer.current.x}px, ${outer.current.y}px, 0) scaleY(${stretch})`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    // Initialize outer to mouse position quickly
    outer.current = { x: mouse.current.x, y: mouse.current.y };
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isEnabled, isVisible]);

  if (!isEnabled) return null;

  return (
    <div className={`napco-custom-cursor ${isVisible && isReady ? 'is-visible' : ''} type-${cursorState.type}`}>
      <div ref={outerRef} className="napco-cursor-outer">
        <div className="napco-cursor-label">{cursorState.label}</div>
      </div>
      <div ref={innerRef} className="napco-cursor-inner" />
    </div>
  );
}
