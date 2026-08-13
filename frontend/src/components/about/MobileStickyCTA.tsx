import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import gsap from 'gsap';

export default function MobileStickyCTA() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 1024
  );
  const [isScrolling, setIsScrolling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    let scrollTimeout: number;

    const handleScroll = () => {
      setIsScrolling(true);
      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(scrollTimeout);
    };
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;

    // Entrance animation
    gsap.fromTo(
      '.mobile-sticky-cta',
      { autoAlpha: 0, y: 50, scale: 0.8 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.5)', delay: 1 }
    );
  }, [isMobile]);

  if (!isMobile) return null;

  return (
    <button
      className={`mobile-sticky-cta ${isScrolling ? 'mobile-sticky-cta--scrolling' : ''}`}
      onClick={() => navigate('/contact')}
      aria-label="Get a Quote"
    >
      <MessageSquare size={20} />
      <span>Get a Quote</span>
    </button>
  );
}
