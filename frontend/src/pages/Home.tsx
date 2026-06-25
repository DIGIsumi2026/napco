import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/pages/home.css';
import CustomCursor from '../components/common/CustomCursor';
import NavigationBar from '../components/common/NavigationBar';
import Sidebar from '../components/common/Sidebar';
import ScrollToTop from '../components/common/ScrollToTop';
import Hero from '../components/home/Hero';
import ServiceStats from '../components/home/ServiceStats';
import ServicesVisual from '../components/home/ServicesVisual';





import IdeaCards from '../components/home/IdeaCards';
import AboutPrinting from '../components/home/AboutPrinting';
import PromoBanners from '../components/home/PromoBanners';
import WhyChoose from '../components/home/WhyChoose';
import ProjectShowcase from '../components/home/ProjectShowcase';
import ProductSlider from '../components/home/ProductSlider';
import GradientCTA from '../components/home/GradientCTA';
import TeamSection from '../components/home/TeamSection';
import LogisticsSection from '../components/home/LogisticsSection';
import ShippingSteps from '../components/home/ShippingSteps';
import BlogSection from '../components/home/BlogSection';
import Footer from '../components/common/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 54, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 86%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
        gsap.to(element, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="home-page">
      <CustomCursor />
      
      <NavigationBar 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen} 
      />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <Hero />
      {/* <IdeaCards /> */}
      <AboutPrinting />
      <ServiceStats/>
      <ServicesVisual/>




      
      <PromoBanners />
      <WhyChoose />
      <ProjectShowcase />
      <ProductSlider />
      <GradientCTA />
      <TeamSection />
      <LogisticsSection />
      <ShippingSteps />
      <BlogSection />
      <Footer />
      
      <ScrollToTop />
    </main>
  );
}
