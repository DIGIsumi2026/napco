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

// Removed the strict 'as string[]' cast so we can safely handle Next.js image objects
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
          // Dynamically handle both Vite (string) and Next.js (StaticImageData object) imports
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

      {/* Gradient overlays */}
      <div className="hero-gradient-overlay" />

      {/* Bottom progress bar track */}
      <div className="hero-progress-track">
        {heroImages.map((_, i) => (
          <div
            key={i}
            className={`hero-progress-segment ${
              i === activeIndex ? 'active' : i < activeIndex ? 'done' : ''
            }`}
            onClick={() => swiperRef.current?.slideToLoop(i)}
          >
            <AnimatePresence>
              {i === activeIndex && (
                <motion.div
                  key={progressKey}
                  className="hero-progress-fill"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: AUTOPLAY_DELAY / 1000, ease: 'linear' }}
                  style={{ originX: 0 }}
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}