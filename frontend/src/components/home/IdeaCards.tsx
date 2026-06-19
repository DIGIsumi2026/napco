import { ideaCards, quickStats } from '../../data/siteData';

export default function IdeaCards() {
  return (
    <section className="ideas-section section-pad" id="services">
      <div className="quick-stat-row" data-reveal>
        {quickStats.map(({ icon: Icon, title, text }) => (
          <article className="quick-stat" key={title}>
            <div className="quick-icon"><Icon size={45} /></div>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="section-heading center" data-reveal>
        <h2>Make Your Ideas With Presvila</h2>
        <p>Turn your ideas into premium products fot that leave a lasting<br />for better experience immpression</p>
      </div>

      <div className="idea-grid" data-reveal>
        {ideaCards.map((card) => (
          <article className="idea-card cursor-target" key={card.title}>
            <div className="idea-image"><img src={card.image} alt={card.title} /></div>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
