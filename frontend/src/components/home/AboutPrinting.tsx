import { features } from '../../data/siteData';

export default function AboutPrinting() {
  return (
    <section className="about-section section-pad" id="pages">
      <div className="about-media" data-reveal data-parallax>
        <img src="/assets/about-visual.jpg" alt="Presvila custom printing model" />
        <div className="mini-product-card">
          <span>New Tee</span>
          <strong>Your Design Goes Here</strong>
        </div>
      </div>
      <div className="about-copy" data-reveal>
        <span className="section-label">MAKE YOUR IDEAS WITH PRESVILA</span>
        <h2>Presvila Provide<br />100% Complete Printing</h2>
        <p>Beautiful, customizable template, with a ton of web blocks to create an amazing website that looks and digita chapakhana in City</p>
        <div className="feature-list">
          {features.map(({ icon: Icon, title, text }) => (
            <article className="feature-line" key={title}>
              <span><Icon size={34} /></span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
