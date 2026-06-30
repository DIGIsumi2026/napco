import { Mail, Phone } from 'lucide-react';
import { footerGallery } from '../../data/siteData';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-grid" data-reveal>
        <div>
          <Logo />
          <p>Address 301 Princes Street, Ei<br />class Mahall Damietta Egypt-104</p>
          <a href="tel:+134353353545"><Phone size={19} /> +1 343 5335 3545</a>
          <a href="mailto:presvila@mail.com"><Mail size={19} /> presvila@mail.com</a>
        </div>
        <div>
          <h3>Navigation</h3>
          <a>Home</a>
          <a>About US</a>
          <a>Services</a>
          <a>Contact</a>
          <a>Blog</a>
        </div>
        <div>
          <h3>Quick Link</h3>
          <a>Digital Printing</a>
          <a>3d Printing</a>
          <a>Ofset Printing</a>
          <a>Logo Design</a>
          <a className="purple-link">+ T-Shirt Printing</a>
        </div>
        <div>
          <h3>Our Gallery</h3>
          <div className="gallery-grid">
            {footerGallery.map((image) => <img src={image} alt="Gallery item" key={image} />)}
          </div>
        </div>
      </div>
      <p className="copyright">Copyright © 2026 <strong>Napco</strong>. All Rights Reserved</p>
    </footer>
  );
}
