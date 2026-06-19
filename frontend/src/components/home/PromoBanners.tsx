export default function PromoBanners() {
  return (
    <section className="promo-section section-pad" id="shop">
      <div className="promo-grid" data-reveal>
        <a className="promo-card cursor-target" href="#shop">
          <img src="/assets/promo-book.jpg" alt="Book cover design" />
          <span>Shop Now</span>
        </a>
        <a className="promo-card cursor-target" href="#shop">
          <img src="/assets/promo-shirt.jpg" alt="T-shirt printing" />
          <span>Shop Now</span>
        </a>
      </div>
    </section>
  );
}
