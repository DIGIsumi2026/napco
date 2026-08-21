import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, X } from 'lucide-react';

import { imageAssets } from '../../data/imageAssets';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Contact Us', path: '/contact' },
];

const WhatsAppIcon = ({ size = 19, className = '' }: { size?: number | string; className?: string }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 32 32"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M16.02 3.2c-7.05 0-12.78 5.63-12.78 12.56 0 2.22.6 4.39 1.72 6.29L3.13 28.8l6.98-1.79a12.98 12.98 0 0 0 5.91 1.46c7.05 0 12.78-5.63 12.78-12.56S23.07 3.2 16.02 3.2Zm0 22.98c-1.91 0-3.78-.51-5.41-1.49l-.39-.23-4.14 1.06 1.09-4.01-.26-.41a10.15 10.15 0 0 1-1.58-5.34c0-5.67 4.79-10.28 10.69-10.28s10.69 4.61 10.69 10.28-4.8 10.42-10.69 10.42Zm5.86-7.7c-.32-.16-1.9-.92-2.2-1.03-.3-.11-.51-.16-.73.16-.21.32-.84 1.03-1.03 1.24-.19.21-.38.24-.7.08-.32-.16-1.36-.49-2.59-1.54-.96-.84-1.6-1.88-1.79-2.2-.19-.32-.02-.49.14-.65.14-.14.32-.38.49-.57.16-.19.22-.32.32-.54.11-.22.05-.41-.03-.57-.08-.16-.73-1.72-1-2.35-.26-.62-.53-.54-.73-.55h-.62c-.21 0-.57.08-.86.41-.3.32-1.14 1.09-1.14 2.66 0 1.57 1.17 3.09 1.33 3.3.16.21 2.3 3.45 5.58 4.84.78.33 1.39.53 1.86.68.78.24 1.49.21 2.05.13.62-.09 1.9-.76 2.17-1.49.27-.73.27-1.36.19-1.49-.08-.14-.3-.22-.62-.38Z"
    />
  </svg>
);

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1EmKKmMVfr/?mibextid=wwXIfr',
    icon: Facebook,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/napcolk?igsh=MWk0ajNrdDFxODB5ZA==',
    icon: Instagram,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/napcopvtltd/',
    icon: Linkedin,
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/94716532112',
    icon: WhatsAppIcon,
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  useEffect(() => {
    document.documentElement.classList.toggle('napco-sidebar-is-open', isOpen);
    document.body.classList.toggle('napco-sidebar-is-open', isOpen);
    
    // @ts-ignore - access global lenis instance if it exists
    if (isOpen) window.napcoLenis?.stop();
    // @ts-ignore
    else window.napcoLenis?.start();

    return () => {
      document.documentElement.classList.remove('napco-sidebar-is-open');
      document.body.classList.remove('napco-sidebar-is-open');
      // @ts-ignore
      window.napcoLenis?.start();
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <button
        type="button"
        className={`napco-sidebar__backdrop ${
          isOpen ? 'napco-sidebar__backdrop--open' : ''
        }`}
        aria-label="Close sidebar"
        onClick={onClose}
      />

      <aside
        className={`napco-sidebar ${isOpen ? 'napco-sidebar--open' : ''}`}
        aria-hidden={!isOpen}
      >
        <div className="napco-sidebar__glow napco-sidebar__glow--cyan" />
        <div className="napco-sidebar__glow napco-sidebar__glow--purple" />

        <div className="napco-sidebar__top">
          <Link
            to="/"
            className="napco-sidebar__logo"
            onClick={onClose}
            aria-label="NAPCO Home"
          >
            <img src={imageAssets.brand.logo} alt="NAPCO" />
          </Link>

          <button
            type="button"
            className="napco-sidebar__close"
            onClick={onClose}
            aria-label="Close menu"
            data-cursor="Close"
          >
            <span />
            <X size={22} />
          </button>
        </div>

        <nav className="napco-sidebar__nav" aria-label="Sidebar navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                isActive
                  ? 'napco-sidebar__link napco-sidebar__link--active'
                  : 'napco-sidebar__link'
              }
            >
              <span className="napco-sidebar__link-text">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <Link
          to="/contact#contact-form"
          className="napco-sidebar__quote"
          onClick={onClose}
          data-cursor="Quote"
        >
          Get a Quote
        </Link>

        <div className="napco-sidebar__socials">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href === '#' ? undefined : '_blank'}
              rel={href === '#' ? undefined : 'noreferrer'}
              data-cursor={label}
            >
              <Icon size={19} />
            </a>
          ))}
        </div>
      </aside>
    </>
  );
}