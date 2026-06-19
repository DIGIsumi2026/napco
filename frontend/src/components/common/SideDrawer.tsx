import { FormEvent, useState } from 'react';
import { Mail, MapPin, Phone, Send, X } from 'lucide-react';
import Logo from './Logo';

type SideDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const submitQuote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Quote request failed');
      setStatus('success');
      event.currentTarget.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className={`drawer-shell ${isOpen ? 'drawer-open' : ''}`} aria-hidden={!isOpen}>
      <button className="drawer-overlay" onClick={onClose} aria-label="Close drawer" />
      <aside className="drawer-panel">
        <button className="drawer-close" onClick={onClose} aria-label="Close menu">
          <X size={22} />
        </button>
        <Logo />
        <p className="drawer-copy">
          A modern printing shop interface with clean service previews, animated products and production workflow.
        </p>
        <div className="drawer-contact">
          <p><MapPin size={18} /> 301 Princes Street, Egypt-104</p>
          <p><Phone size={18} /> +1 343 5335 3545</p>
          <p><Mail size={18} /> presvila@mail.com</p>
        </div>
        <form className="drawer-form" onSubmit={submitQuote}>
          <h3>Get quote</h3>
          <input name="name" placeholder="Your name" required />
          <input name="email" type="email" placeholder="Email address" required />
          <textarea name="message" placeholder="Tell us what you need" rows={4} required />
          <button type="submit" disabled={status === 'sending'}>
            <Send size={17} /> {status === 'sending' ? 'Sending...' : 'Send Request'}
          </button>
          {status === 'success' && <small className="form-success">Request saved in the temporary backend.</small>}
          {status === 'error' && <small className="form-error">Backend is not running. Start npm run dev.</small>}
        </form>
      </aside>
    </div>
  );
}
