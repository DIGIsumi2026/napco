import { processSteps } from '../../data/siteData';

export default function LogisticsSection() {
  return (
    <section className="logistics-section section-pad">
      <div className="section-heading center" data-reveal>
        <span className="section-label">ORDER PROCESS</span>
        <h2>We Aim to Contribute Well<br />to Your Company</h2>
      </div>
      <div className="process-chain" data-reveal>
        {processSteps.map(({ icon: Icon, title, active }, index) => (
          <article className={`process-step ${active ? 'active' : ''}`} key={title}>
            <div className="gear-ring">
              <Icon size={52} />
            </div>
            {index !== processSteps.length - 1 && <span className="process-curve" />}
            <h3>{title}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
