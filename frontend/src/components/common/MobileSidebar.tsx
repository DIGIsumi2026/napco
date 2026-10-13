import { useEffect, useRef } from 'react';
import type { MouseEvent, RefObject } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { ContactLink, NavigationLink, SocialLink } from '../../data/siteNavigation';
import './MobileSidebar.css';

const mobileMenuVariants: Variants = {
  closed: {
    opacity: 0, y: -10, scale: 0.988,
    transition: { duration: 0.24, ease: [0.4, 0, 1, 1], staggerChildren: 0.015, staggerDirection: -1 },
  },
  open: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1], delayChildren: 0.02, staggerChildren: 0.03 },
  },
};

const linkVariants: Variants = {
  closed: { opacity: 0, y: 5, transition: { duration: 0.14 } },
  open: { opacity: 1, y: 0, transition: { duration: 0.24 } },
};

const reducedVariants: Variants = {
  closed: { opacity: 0, transition: { duration: 0.06 } },
  open: { opacity: 1, transition: { duration: 0.08 } },
};

type MobileSidebarProps = {
  open: boolean;
  onClose: () => void;
  onExitComplete: () => void;
  onNavigate: (href: string) => void;
  containerRef: RefObject<HTMLDivElement>;
  toggleRef: RefObject<HTMLButtonElement>;
  links: NavigationLink[];
  contacts: ContactLink[];
  socials: SocialLink[];
};

function MobileMenuPanel({ onClose, onNavigate, containerRef, toggleRef, links, contacts, socials }: MobileSidebarProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate(href);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    const lenis = window.napcoLenis;
    const resumeLenis = lenis && !lenis.isStopped;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (resumeLenis) lenis.stop();

    // Inert every sibling along the navbar's ancestor chain, without disabling the navbar.
    const background: { element: HTMLElement; inert: boolean }[] = [];
    for (let branch: HTMLElement | null = container; branch && branch !== document.body; branch = branch.parentElement) {
      for (const sibling of Array.from(branch.parentElement?.children ?? [])) {
        if (sibling instanceof HTMLElement && sibling !== branch) {
          background.push({ element: sibling, inert: sibling.inert });
          sibling.inert = true;
        }
      }
    }

    const focusable = () => Array.from(container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
    )).filter((element) => element.getClientRects().length && !element.closest('[inert]'));
    const focusFirst = () => (panelRef.current?.querySelector<HTMLElement>('a') ?? toggleRef.current)?.focus({ preventScroll: true });
    const initialFocus = requestAnimationFrame(focusFirst);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key !== 'Tab') return;
      const elements = focusable();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) {
        event.preventDefault();
        first?.focus();
      }
    };
    const handleFocus = (event: FocusEvent) => {
      if (!container.contains(event.target as Node)) focusFirst();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocus);

    return () => {
      cancelAnimationFrame(initialFocus);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocus);
      for (const { element, inert } of background) element.inert = inert;
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      if (resumeLenis) lenis.start();
      if (toggleRef.current?.isConnected) toggleRef.current.focus({ preventScroll: true });
    };
  }, [containerRef, toggleRef, onClose]);

  return (
    <motion.div
      ref={panelRef}
      id="napco-mobile-menu"
      className="napco-mobile-menu"
      data-lenis-prevent
      variants={reducedMotion ? reducedVariants : mobileMenuVariants}
      initial="closed"
      animate="open"
      exit="closed"
    >
      <nav className="napco-mobile-menu__links" aria-label="Mobile navigation">
        {links.map(({ label, href }) => (
          <motion.div key={href} variants={reducedMotion ? reducedVariants : linkVariants}>
            <NavLink to={href} end={href === '/'} onClick={(event) => handleNavigation(event, href)} className="napco-mobile-menu__link">
              <span>{label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>
      <motion.div
        className="napco-mobile-menu__contacts"
        variants={reducedMotion ? reducedVariants : {
          closed: { opacity: 0, y: 5, transition: { duration: 0.14 } },
          open: { opacity: 1, y: 0, transition: { duration: 0.22, delay: 0.08 } },
        }}
      >
        {contacts.map(({ label, href }) => <a key={href} href={href}>{label}</a>)}
      </motion.div>
      {socials.length > 0 && (
        <motion.div
          className="napco-mobile-menu__socials"
          variants={reducedMotion ? reducedVariants : {
            closed: { opacity: 0, scale: 0.94, y: 4, transition: { duration: 0.14 } },
            open: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.24 } },
          }}
        >
          {socials.map(({ label, href, Icon }) => (
            <a key={label} href={href} aria-label={label} title={label} target="_blank" rel="noreferrer">
              <Icon size={19} />
            </a>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function MobileSidebar(props: MobileSidebarProps) {
  const reducedMotion = useReducedMotion();
  return (
    <AnimatePresence onExitComplete={props.onExitComplete}>
      {props.open && (
        <motion.button
          key="backdrop"
          type="button"
          className="napco-mobile-menu-backdrop"
          tabIndex={-1}
          aria-hidden="true"
          onClick={props.onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: reducedMotion ? 0.08 : 0.22 } }}
          exit={{ opacity: 0, transition: { duration: reducedMotion ? 0.06 : 0.18 } }}
        />
      )}
      {props.open && <MobileMenuPanel key="panel" {...props} />}
    </AnimatePresence>
  );
}
