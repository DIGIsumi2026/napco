import { useRef } from 'react';
import { Eye, Heart, Repeat2, ShoppingCart, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { products } from '../../data/siteData';

export default function ProductSlider() {
  const swiperRef = useRef<SwiperType>();

  return (
    <section className="products-section section-pad" id="shop-products">
      <div className="product-heading" data-reveal>
        <div>
          <span className="section-label">FEATURED PRODUCTS</span>
          <h2>Amazing Products Ready<br />for Your Needs</h2>
        </div>
        <div className="round-nav">
          <button onClick={() => swiperRef.current?.slidePrev()} aria-label="Previous product">←</button>
          <button onClick={() => swiperRef.current?.slideNext()} aria-label="Next product">→</button>
        </div>
      </div>
      <div data-reveal>
        <Swiper
          modules={[Navigation, Autoplay]}
          slidesPerView={4}
          spaceBetween={40}
          loop
          autoplay={{ delay: 3200, disableOnInteraction: false }}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          breakpoints={{
            0: { slidesPerView: 1.1, spaceBetween: 18 },
            720: { slidesPerView: 2, spaceBetween: 24 },
            1050: { slidesPerView: 4, spaceBetween: 36 }
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.title}>
              <article className="product-card cursor-target">
                <div className="product-price-row"><span>{product.title.includes('Bag') ? 'Bag' : product.title.includes('Mug') ? 'Mug' : product.title.includes('Hoodie') ? 'Hoodie' : 'Packet'}</span><strong>{product.price}</strong></div>
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.title} />
                  <div className="product-tools">
                    <button aria-label="Wishlist"><Heart size={20} /></button>
                    <button aria-label="Quick view"><Eye size={20} /></button>
                    <button aria-label="Compare"><Repeat2 size={20} /></button>
                  </div>
                  <button className="add-cart"><ShoppingCart size={17} /> Add to Cart</button>
                </div>
                <h3>{product.title}</h3>
                <div className="stars" aria-label="5 stars">
                  {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={18} fill="currentColor" />)}
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
