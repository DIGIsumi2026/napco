import {
  BadgeCheck,
  Box,
  Heart,
  Images,
  PackageOpen,
  Printer,
  Search,
  ShoppingCart,
  Star,
  Store,
  Truck,
  UploadCloud,
  User,
  WandSparkles
} from 'lucide-react';

export const navItems = ['Home', 'Services', 'Shop', 'Blog', 'Pages', 'Contact'];

export const serviceDropdown = ['Our Services', 'Services Details'];
export const pageDropdown = ['About Us', 'Our Team', 'Team Details', 'Testimonials', 'Pricing', 'Our Project', 'Project Details', 'Our Faq', 'Error'];

export const quickStats = [
  {
    icon: WandSparkles,
    title: 'Quality Design',
    text: 'Customize your design with graphics text or your own uploaded'
  },
  {
    icon: BadgeCheck,
    title: '100% Satisfaction',
    text: 'Customize your design with graphics text or your own uploaded'
  },
  {
    icon: Printer,
    title: 'Fast Printing',
    text: 'Premium tools, clean finishing and ready-to-ship output.'
  }
];

export const ideaCards = [
  {
    title: 'Show Your Products',
    text: 'Our online tools make the process simple and clear as possible, and',
    image: '/assets/idea-products.jpg'
  },
  {
    title: 'Create Your Design',
    text: 'Our online tools make the process simple and clear as possible, and',
    image: '/assets/idea-design.jpg'
  },
  {
    title: 'Give Us a Rating',
    text: 'Our online tools make the process simple and clear as possible, and',
    image: '/assets/idea-rating.jpg'
  }
];

export const features = [
  {
    icon: BadgeCheck,
    title: 'Reliable Quality',
    text: 'Make a lasting impression by using our industry leading quality premium metairal'
  },
  {
    icon: Printer,
    title: 'Smooth Automation',
    text: 'Make a lasting impression by using our industry leading quality premium metairal'
  }
];

export const workflow = [
  {
    icon: Store,
    title: 'Connect Your Store',
    text: 'On the other hand, we denounce with right us indignation and dislike men who are so beguiled and dem'
  },
  {
    icon: Images,
    title: 'Print Fullfill the Order',
    text: 'On the other hand, we denounce with right us indignation and dislike men who are so beguiled and dem'
  },
  {
    icon: UploadCloud,
    title: 'Customer Place Order',
    text: 'On the other hand, we denounce with right us indignation and dislike men who are so beguiled and dem'
  },
  {
    icon: Printer,
    title: 'Order Ship Your Customer',
    text: 'On the other hand, we denounce with right us indignation and dislike men who are so beguiled and dem'
  }
];

export const projects = [
  { title: 'Digital Printing', tag: 'Digital Products', image: '/assets/project-press.jpg' },
  { title: 'Office Print Making', tag: 'Digital Products', image: '/assets/project-factory.jpg' },
  { title: 'Custom Print Designing', tag: 'Digital Products', image: '/assets/project-custom.jpg' },
  { title: 'T-Shirt Manufacture', tag: 'Digital Products', image: '/assets/project-cloth.jpg' }
];

export const products = [
  { title: 'Stylish Bag', price: '$45.00', image: '/assets/product-bag.jpg' },
  { title: 'Coffee Mug', price: '$99.00', image: '/assets/product-mug.jpg' },
  { title: 'Winter Hoodie', price: '$68.00', image: '/assets/product-hoodie.jpg' },
  { title: 'Packaging', price: '$35.00', image: '/assets/product-packet.jpg' }
];

export const team = [
  { name: 'Shajib Hasan', role: 'Designer', image: '/assets/team-shajib.jpg' },
  { name: 'Janes Cooper', role: 'Consultant', image: '/assets/team-janes.jpg' },
  { name: 'Leena Dcruz', role: 'Content Creator', image: '/assets/team-leena.jpg' }
];

export const processSteps = [
  { icon: Box, title: 'Replenishment & Picking' },
  { icon: PackageOpen, title: 'Packaging & Distribution', active: true },
  { icon: Truck, title: 'Transportation Process' }
];

export const shippingSteps = [
  'Choose from 234 Custom Products in Our Catalog',
  'Customize Your Design with Graphics or Your Own Uploaded images',
  'Get Your Order sent to Your door With free Standard Shipping'
];

export const blogs = [
  {
    title: 'We’re an Online Print and Design Dompany',
    date: 'March 23, 2023',
    category: 'Printing',
    image: '/assets/blog-printer.jpg'
  },
  {
    title: 'Necessity May Give us Best Virtual Court',
    date: 'March 23, 2023',
    category: 'Printing',
    image: '/assets/blog-rolls.jpg'
  },
  {
    title: 'Easy and Most Powerful Server and Platform',
    date: 'March 23, 2023',
    category: 'Printing',
    image: '/assets/blog-palette.jpg'
  }
];

export const footerGallery = [1, 2, 3, 4, 5, 6].map((item) => `/assets/gallery-${item}.jpg`);

export const headerActions = [User, ShoppingCart, Heart, Search, Star];
