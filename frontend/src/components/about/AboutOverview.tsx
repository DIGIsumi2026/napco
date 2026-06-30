import { ArrowRight } from 'lucide-react';

export default function AboutOverview() {
  return (
    <section className="about-overview">
      <div className="about-overview__inner">
        <span className="about-overview__eyebrow">Who We Are</span>

        <h2>Reliable print solutions for every brand impression.</h2>

        <p>
          From newspapers, magazines and books to brochures, catalogues, labels,
          calendars, diaries and annual reports, NAPCO combines modern printing
          technology, experienced professionals and strong finishing standards to
          bring every brand’s impression to life.
        </p>

        <a href="/contact-us" className="about-overview__button">
          Start a Project
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}