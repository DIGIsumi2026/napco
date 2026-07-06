import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const radius = 28;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = useTransform(
    smoothProgress,
    [0, 1],
    [circumference, 0]
  );

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 200);
    };

    toggleVisibility();

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    if (window.napcoLenis) {
      window.napcoLenis.scrollTo(0, { duration: 1.15 });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="napco-floating-actions">
      <motion.a
        className="napco-whatsapp-float"
        href="https://wa.me/94112910015"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with NAPCO on WhatsApp"
        data-cursor="WhatsApp"
        initial={{ opacity: 0, scale: 0.76, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
      >
        <span className="napco-whatsapp-float__glow" />

        <svg
          className="napco-whatsapp-float__icon"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M16.02 3.2c-7.05 0-12.78 5.63-12.78 12.56 0 2.22.6 4.39 1.72 6.29L3.13 28.8l6.98-1.79a12.98 12.98 0 0 0 5.91 1.46c7.05 0 12.78-5.63 12.78-12.56S23.07 3.2 16.02 3.2Zm0 22.98c-1.91 0-3.78-.51-5.41-1.49l-.39-.23-4.14 1.06 1.09-4.01-.26-.41a10.15 10.15 0 0 1-1.58-5.34c0-5.67 4.79-10.28 10.69-10.28s10.69 4.61 10.69 10.28-4.8 10.42-10.69 10.42Zm5.86-7.7c-.32-.16-1.9-.92-2.2-1.03-.3-.11-.51-.16-.73.16-.21.32-.84 1.03-1.03 1.24-.19.21-.38.24-.7.08-.32-.16-1.36-.49-2.59-1.54-.96-.84-1.6-1.88-1.79-2.2-.19-.32-.02-.49.14-.65.14-.14.32-.38.49-.57.16-.19.22-.32.32-.54.11-.22.05-.41-.03-.57-.08-.16-.73-1.72-1-2.35-.26-.62-.53-.54-.73-.55h-.62c-.21 0-.57.08-.86.41-.3.32-1.14 1.09-1.14 2.66 0 1.57 1.17 3.09 1.33 3.3.16.21 2.3 3.45 5.58 4.84.78.33 1.39.53 1.86.68.78.24 1.49.21 2.05.13.62-.09 1.9-.76 2.17-1.49.27-.73.27-1.36.19-1.49-.08-.14-.3-.22-.62-.38Z"
          />
        </svg>
      </motion.a>

      <motion.button
        className="napco-scroll-to-top"
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.72, y: 14 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.72,
          y: isVisible ? 0 : 14,
        }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
        aria-label="Scroll to top"
        data-cursor="Top"
      >
        <svg width="68" height="68" className="scroll-progress-svg">
          <circle
            cx="34"
            cy="34"
            r={radius}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="3.5"
            fill="none"
          />

          <motion.circle
            cx="34"
            cy="34"
            r={radius}
            stroke="url(#napcoScrollGradient)"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              rotate: -90,
              transformOrigin: '50% 50%',
            }}
          />

          <defs>
            <linearGradient
              id="napcoScrollGradient"
              x1="8"
              y1="8"
              x2="60"
              y2="60"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#00aeef" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>

        <span className="scroll-progress-icon">
          <ChevronUp size={28} strokeWidth={2.8} />
        </span>
      </motion.button>
    </div>
  );
}