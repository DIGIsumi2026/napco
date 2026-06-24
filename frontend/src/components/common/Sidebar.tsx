import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact Us', href: '#contact' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="napco-sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="napco-sidebar-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="napco-sidebar-close">
              <button onClick={onClose} aria-label="Close menu">
                <motion.div className="hamburger-line" style={{ rotate: 45, y: 8 }} />
                <motion.div className="hamburger-line" style={{ opacity: 0 }} />
                <motion.div className="hamburger-line" style={{ rotate: -45, y: -8 }} />
              </button>
            </div>
            <motion.nav
              className="napco-sidebar-links"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
              }}
            >
              {navLinks.map(({ label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  className="napco-sidebar-link"
                  onClick={onClose}
                  variants={{
                    closed: { x: 24, opacity: 0 },
                    open: { x: 0, opacity: 1 },
                  }}
                  whileHover={{ x: 8, color: '#a855f7' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {label}
                </motion.a>
              ))}
            </motion.nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
