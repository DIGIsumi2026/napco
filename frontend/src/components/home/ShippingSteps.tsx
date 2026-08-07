import { shippingSteps } from '../../data/siteData';

export default function ShippingSteps() {
  return (
    <section className="shipping-section section-pad">
      <div className="shipping-list" data-reveal>
        {shippingSteps.map((step, index) => (
          <article className={index === 0 ? 'active' : ''} key={step}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{step}</h3>
          </article>
        ))}
      </div>
      <div className="shipping-media" data-reveal data-parallax>
        <img src="/assets/shipping-pack.jpg" alt="Custom product package" />
      </div>
    </section>
  );
}
