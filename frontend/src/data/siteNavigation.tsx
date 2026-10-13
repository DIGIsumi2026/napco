import { Facebook, Instagram, Linkedin } from 'lucide-react';
import type { ComponentType } from 'react';

export type NavigationLink = { label: string; href: string; footerLabel?: string };
export type ContactLink = { label: string; href: string };
export type SocialLink = {
  label: string;
  href: string;
  Icon: ComponentType<{ size?: number | string }>;
};

export const navigationLinks: NavigationLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact Us', href: '/contact', footerLabel: 'Contact' },
];

export const contactDetails = {
  email: { label: 'admin@napco.lk', href: 'mailto:admin@napco.lk' },
  phone: { label: '+94 11 2910015', href: 'tel:+94112910015' },
};

export const contactLinks: ContactLink[] = [contactDetails.email, contactDetails.phone];

export const socialLinks: SocialLink[] = [
  { Icon: Facebook, href: 'https://www.facebook.com/share/1EmKKmMVfr/?mibextid=wwXIfr', label: 'Facebook' },
  { Icon: Instagram, href: 'https://www.instagram.com/napcolk?igsh=MWk0ajNrdDFxODB5ZA==', label: 'Instagram' },
  { Icon: Linkedin, href: 'https://www.linkedin.com/company/napcopvtltd/', label: 'LinkedIn' },
];

const WhatsAppIcon = ({ size = 19 }: { size?: number | string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
    <path fill="currentColor" d="M16.02 3.2c-7.05 0-12.78 5.63-12.78 12.56 0 2.22.6 4.39 1.72 6.29L3.13 28.8l6.98-1.79a12.98 12.98 0 0 0 5.91 1.46c7.05 0 12.78-5.63 12.78-12.56S23.07 3.2 16.02 3.2Zm0 22.98c-1.91 0-3.78-.51-5.41-1.49l-.39-.23-4.14 1.06 1.09-4.01-.26-.41a10.15 10.15 0 0 1-1.58-5.34c0-5.67 4.79-10.28 10.69-10.28s10.69 4.61 10.69 10.28-4.8 10.42-10.69 10.42Zm5.86-7.7c-.32-.16-1.9-.92-2.2-1.03-.3-.11-.51-.16-.73.16-.21.32-.84 1.03-1.03 1.24-.19.21-.38.24-.7.08-.32-.16-1.36-.49-2.59-1.54-.96-.84-1.6-1.88-1.79-2.2-.19-.32-.02-.49.14-.65.14-.14.32-.38.49-.57.16-.19.22-.32.32-.54.11-.22.05-.41-.03-.57-.08-.16-.73-1.72-1-2.35-.26-.62-.53-.54-.73-.55h-.62c-.21 0-.57.08-.86.41-.3.32-1.14 1.09-1.14 2.66 0 1.57 1.17 3.09 1.33 3.3.16.21 2.3 3.45 5.58 4.84.78.33 1.39.53 1.86.68.78.24 1.49.21 2.05.13.62-.09 1.9-.76 2.17-1.49.27-.73.27-1.36.19-1.49-.08-.14-.3-.22-.62-.38Z" />
  </svg>
);

export const sidebarSocialLinks: SocialLink[] = [
  ...socialLinks,
  { label: 'WhatsApp', href: 'https://wa.me/94716532112', Icon: WhatsAppIcon },
];
