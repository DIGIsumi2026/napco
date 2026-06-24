"use client";

import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { imageAssets } from '../../data/imageAssets';
import 'swiper/css';
import 'swiper/css/effect-fade';

const AUTOPLAY_DELAY = 4500;

const heroImages = Object.values(imageAssets.hero) as any[];

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
    setProgressKey((k) => k + 1);
  }, []);

  return (
    <div className="hero-carousel-wrap">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: AUTOPLAY_DELAY, disableOnInteraction: false }}
        loop
        speed={900}
        onSwiper={(s) => (swiperRef.current = s)}
        onSlideChange={handleSlideChange}
        className="hero-swiper"
      >
        {heroImages.map((img, i) => {
          const imageSource = typeof img === 'string' ? img : img.src;

          return (
            <SwiperSlide key={i}>
              <div className="hero-slide">
                <img 
                  src={imageSource} 
                  alt={`Napco slide ${i + 1}`} 
                  className="hero-slide-img" 
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Dark gradient overlay */}
      <div className="hero-gradient-overlay" />

      {/* Custom Pagination Container (Pill Style) */}
      <div className="hero-pagination-container">
        {heroImages.map((_, i) => {
          const isActive = i === activeIndex;

          return (
            <div
              key={i}
              className={`hero-pagination-pill ${isActive ? 'active' : 'inactive'}`}
              onClick={() => swiperRef.current?.slideToLoop(i)}
            >
              {isActive && (
                <motion.div
                  key={progressKey}
                  layoutId="activePill"
                  className="hero-pagination-fill"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: AUTOPLAY_DELAY / 1000, ease: 'linear' }}
                  style={{ originX: 0 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}