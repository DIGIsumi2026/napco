import { Share2 } from 'lucide-react';
import { team } from '../../data/siteData';

export default function TeamSection() {
  return (
    <section className="team-section section-pad" id="team">
      <div className="team-heading" data-reveal>
        <div>
          <span className="section-label">OUR TEAM MEMBERS</span>
          <h2>Meet With Our<br />Awesome Team Mates</h2>
        </div>
        <a className="purple-button" href="#team">View all Team</a>
      </div>
      <div className="team-grid" data-reveal>
        {team.map((member, index) => (
          <article className="team-card cursor-target" key={member.name}>
            <img src={member.image} alt={member.name} />
            <div className="team-info">
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <button aria-label={`Share ${member.name}`}><Share2 size={20} /></button>
            </div>
            {index === 1 && (
              <div className="social-ribbon">
                <i className="fa-brands fa-linkedin-in" />
                <i className="fa-brands fa-instagram" />
                <i className="fa-brands fa-facebook-f" />
                <Share2 size={18} />
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
