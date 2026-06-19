import { useState } from 'react';
import { Grid2X2, Heart, MapPin, Search, ShoppingCart, UserRound } from 'lucide-react';
import { navItems, pageDropdown, serviceDropdown } from '../../data/siteData';
import Logo from './Logo';
import SideDrawer from './SideDrawer';

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="site-header" id="home">
      <div className="top-strip">
        <div className="top-left"><MapPin size={18} /> NT Road. North West</div>
        <p>Free metro delivery* Sign Up for $30 off your order!</p>
        <div className="top-socials" aria-label="social links">
          <i className="fa-brands fa-facebook-f" />
          <i className="fa-brands fa-dribbble" />
          <i className="fa-brands fa-twitter" />
          <i className="fa-brands fa-vimeo-v" />
        </div>
      </div>

      <div className="brand-row">
        <label className="search-box" aria-label="Search products">
          <input placeholder="Search..." />
          <Search size={31} strokeWidth={2.2} />
        </label>
        <Logo />
        <div className="header-actions">
          <button aria-label="Account"><UserRound /></button>
          <button aria-label="Cart"><ShoppingCart /></button>
          <button aria-label="Wishlist"><Heart /></button>
        </div>
      </div>

      <nav className="nav-row">
        <ul>
          {navItems.map((item) => (
            <li key={item} className={item === 'Services' || item === 'Pages' ? 'has-dropdown' : ''}>
              <a href={`#${item.toLowerCase()}`}>{item}</a>
              {item === 'Services' && (
                <div className="dropdown compact-dropdown">
                  {serviceDropdown.map((label) => <a key={label}>{label}</a>)}
                </div>
              )}
              {item === 'Pages' && (
                <div className="dropdown pages-dropdown">
                  {pageDropdown.map((label) => <a key={label}>{label}</a>)}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <a className="quote-button" href="#contact">Get a Quete</a>
          <button className="grid-button" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            <Grid2X2 size={30} />
          </button>
        </div>
      </nav>

      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
