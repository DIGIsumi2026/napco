import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Link2, Search } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { projects } from '../../data/siteData';

export default function ProjectShowcase() {
  const swiperRef = useRef<SwiperType>();

  return (
    <section className="projects-section section-pad" id="projects">
      <div className="section-heading center" data-reveal>
        <span className="section-label">SEE OUR PROJECTS</span>
        <h2>Our Latest Printing Works</h2>
      </div>
      <div className="projects-shell" data-reveal>
        <Swiper
          modules={[Navigation, Autoplay]}
          slidesPerView={3}
          spaceBetween={40}
          loop
          autoplay={{ delay: 2600, disableOnInteraction: false }}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          breakpoints={{
            0: { slidesPerView: 1.1, spaceBetween: 18 },
            700: { slidesPerView: 2, spaceBetween: 24 },
            1100: { slidesPerView: 3, spaceBetween: 40 }
          }}
        >
          {projects.map((project) => (
            <SwiperSlide key={project.title}>
              <article className="project-card cursor-target">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <div>
                    <span>{project.tag}</span>
                    <h3>{project.title}</h3>
                  </div>
                  <div className="project-actions">
                    <button aria-label="View project"><Search size={24} /></button>
                    <button aria-label="Open project"><Link2 size={24} /></button>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="slider-line"><span /></div>
        <div className="project-nav">
          <button onClick={() => swiperRef.current?.slidePrev()}><ChevronLeft /></button>
          <button onClick={() => swiperRef.current?.slideNext()}><ChevronRight /></button>
        </div>
      </div>
    </section>
  );
}
