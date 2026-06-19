import { workflow } from '../../data/siteData';

export default function WhyChoose() {
  return (
    <section className="why-section section-pad">
      <div className="why-top" data-reveal>
        <div>
          <span className="section-label">LET’S PRINT WITH US</span>
          <h2>Why People Want<br />Printing With Our Presvila</h2>
          <p>Beautiful, customizable template, with a ton of web blocks to create an amazing website that looks and digita chapakhana in City</p>
        </div>
        <img src="/assets/why-print.jpg" alt="Printing workflow illustration" data-parallax />
      </div>
      <div className="workflow-grid" data-reveal>
        {workflow.map(({ icon: Icon, title, text }) => (
          <article className="workflow-card" key={title}>
            <div className="workflow-icon"><Icon size={54} /></div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
