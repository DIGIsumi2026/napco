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

const socialLinks = [
  {
    label: 'Facebook',
    href: '#',
    icon: Facebook,
  },
  {
    label: 'Instagram',
    href: '#',
    icon: Instagram,
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: Linkedin,
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  useEffect(() => {
    document.body.classList.toggle('napco-sidebar-is-open', isOpen);

    return () => {
      document.body.classList.remove('napco-sidebar-is-open');
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
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/contact"
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