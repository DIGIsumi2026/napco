import { useEffect } from 'react';
import { motion } from 'framer-motion';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Services', href: '/#services' },
  { label: 'Contact Us', href: '/#contact' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`napco-sidebar ${isOpen ? 'napco-sidebar--open' : ''}`}
      aria-hidden={!isOpen}
    >
      <motion.div
        className="napco-sidebar-overlay"
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        onClick={onClose}
      />

      <motion.aside
        className="napco-sidebar-panel"
        initial={false}
        animate={{
          x: isOpen ? '0%' : '105%',
        }}
        transition={{
          type: 'spring',
          damping: 28,
          stiffness: 220,
        }}
        aria-label="Site navigation"
      >
        <div className="napco-sidebar-close">
          <button type="button" onClick={onClose} aria-label="Close menu">
            <span className="hamburger-line hamburger-line--close-1" />
            <span className="hamburger-line hamburger-line--close-2" />
            <span className="hamburger-line hamburger-line--close-3" />
          </button>
        </div>

        <motion.nav
          className="napco-sidebar-links"
          initial={false}
          animate={isOpen ? 'open' : 'closed'}
          variants={{
            open: {
              transition: {
                staggerChildren: 0.07,
                delayChildren: 0.16,
              },
            },
            closed: {
              transition: {
                staggerChildren: 0.04,
                staggerDirection: -1,
              },
            },
          }}
        >
          {navLinks.map(({ label, href }) => (
            <motion.a
              key={label}
              href={href}
              className="napco-sidebar-link"
              onClick={onClose}
              variants={{
                closed: {
                  x: 24,
                  opacity: 0,
                },
                open: {
                  x: 0,
                  opacity: 1,
                },
              }}
              whileHover={{
                x: 8,
                color: '#a855f7',
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 22,
              }}
            >
              {label}
            </motion.a>
          ))}
        </motion.nav>
      </motion.aside>
    </div>
  );
}