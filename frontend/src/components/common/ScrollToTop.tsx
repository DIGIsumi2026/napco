import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  // Make the progress smooth
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Calculate circumference: 2 * pi * r (r=22)
  const circumference = 2 * Math.PI * 22;
  const strokeDashoffset = useTransform(smoothProgress, [0, 1], [circumference, 0]);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.button
      className="napco-scroll-to-top"
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
      aria-label="Scroll to top"
    >
      <svg width="52" height="52" className="scroll-progress-svg">
        {/* Background track */}
        <circle
          cx="26"
          cy="26"
          r="22"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="3"
          fill="none"
        />
        {/* Progress stroke */}
        <motion.circle
          cx="26"
          cy="26"
          r="22"
          stroke="#a855f7"
          strokeWidth="3"
          fill="rgba(10, 7, 28, 0.6)"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            rotate: -90,
            transformOrigin: "50% 50%"
          }}
        />
      </svg>
      <div className="scroll-progress-icon">
        <ChevronUp size={24} color="#fff" />
      </div>
    </motion.button>
  );
}
