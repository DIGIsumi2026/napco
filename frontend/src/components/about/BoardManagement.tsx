import { imageAssets } from '../../data/imageAssets';

const boardMembers = [
  {
    name: 'Mr. Thilanga Sumathipala',
    role: 'Chairman',
    image: imageAssets.aboutBoardManagement.thilanga,
    profile:
      'Business professional known for strategic vision; co-founder of the Sumathi Group of Companies and founder of the Thilanga Sumathipala Foundation.',
    details: [
      {
        label: 'Industries Led',
        value:
          'Printing, Hospitality, Commerce, Energy, Technology & Entertainment, and Leisure.',
      },
      {
        label: 'Key Achievement',
        value:
          'Conceptualized and led the Sumathi Awards, the National Television Awards.',
      },
    ],
  },
  {
    name: 'Mr. Udhantha Sumathipala',
    role: 'Executive Director',
    image: imageAssets.aboutBoardManagement.udhantha,
    profile:
      'Oldest son of Mr. Thilanga Sumathipala; joined Sumathi Universal (Pvt) Ltd in 2018 and currently leads its subsidiary companies.',
    details: [
      {
        label: 'Education',
        value:
          "Bachelor's degree in Architectural Science from Curtin University, Perth, Australia. Awarded university colors from the University of Limkokwing.",
      },
      {
        label: 'Alma Mater',
        value: 'Royal College, Colombo.',
      },
    ],
  },
  {
    name: 'Mrs. Samadara Sumathipala',
    role: 'Director',
    image: imageAssets.aboutBoardManagement.samadara,
    profile:
      'Wife of Mr. Thilanga Sumathipala; recognized as a strategic, forward-thinking leader who makes critical growth and leadership decisions.',
    details: [
      {
        label: 'Leadership Focus',
        value:
          'Strategic growth, forward-thinking leadership and critical decision-making.',
      },
    ],
  },
  {
    name: 'Mr. Dulantha Sumathipala',
    role: 'Director',
    image: imageAssets.aboutBoardManagement.dulantha,
    profile:
      'Second son of Mr. Thilanga Sumathipala. Climbed the ranks from Sumathi Printers and NAPCO Pvt Ltd to become a Segment Director, joining the holding company board in 2020.',
    details: [
      {
        label: 'Education',
        value:
          'BSc. Hons. in International Management & Business from the University of Plymouth, England.',
      },
      {
        label: 'Alma Mater',
        value: 'Royal College, Colombo.',
      },
    ],
  },
  {
    name: 'Mr. Sajantha Sumathipala',
    role: 'Director',
    image: imageAssets.aboutBoardManagement.sajantha,
    profile: 'Focusing on organizational development, strategic investments, and delivering ultimate client satisfaction.',
    details: [
      {
        label: 'Education',
        value:
          "Master's degree in Business Management from foreign universities.",
      },
      {
        label: 'Alma Mater',
        value: 'Royal College, Colombo.',
      },
    ],
  },
];

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ... existing boardMembers array ...

function MobileBoardManagement({ members }: { members: typeof boardMembers }) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (section) {
      gsap.fromTo(
        section,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            once: true,
          }
        }
      );
    }

    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>('.board-management__mobile-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-active');
        } else {
          entry.target.classList.remove('is-active');
        }
      });
    }, {
      root: container,
      threshold: 0.6,
    });

    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="board-management board-management--mobile" ref={sectionRef}>
      <div className="board-management__heading">
        <span>Leadership</span>
        <h2>Board of Management</h2>
        <p>
          Meet the leadership team guiding NAPCO with strategic direction,
          industry experience and a commitment to long-term growth.
        </p>
      </div>

      <div className="board-management__carousel" ref={containerRef}>
        <div className="board-management__carousel-track">
          {members.map((member) => (
            <article className="board-management__mobile-card" key={member.name}>
              <div className="board-management__image-wrap">
                <img
                  src={member.image}
                  alt={member.name}
                  className="board-management__image"
                />
              </div>
              <div className="board-management__content">
                <span className="board-management__role">{member.role}</span>
                <h3>{member.name}</h3>
                <p>{member.profile}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function BoardManagement() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 1024
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return <MobileBoardManagement members={boardMembers} />;
  }


  return (
    <section className="board-management">
      <div className="board-management__inner">
        <div className="board-management__heading">

          <h2>
            Board of
            <br />
            Management
          </h2>

          <p>
            Meet the leadership team guiding NAPCO with strategic direction,
            industry experience and a commitment to long term growth.
          </p>
        </div>

        <div className="board-management__grid">
          {boardMembers.map((member) => (
            <article
              className="board-management__card"
              key={member.name}
              tabIndex={0}
              data-cursor-type="profile"
              data-cursor-label="Profile"
            >
              <div className="board-management__image-wrap">
                <img
                  src={member.image}
                  alt={member.name}
                  className="board-management__image"
                />
              </div>

              <div className="board-management__content">
                <span className="board-management__role">{member.role}</span>

                <h3>{member.name}</h3>

                <p>{member.profile}</p>
              </div>

              <div className="board-management__details">
                {member.details.map((detail) => (
                  <div className="board-management__detail" key={detail.label}>
                    <strong>{detail.label}</strong>
                    <span>{detail.value}</span>
                  </div>
                ))}
              </div>

              <span className="board-management__hint">view more</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}