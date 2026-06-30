import { useEffect, useRef, useState } from 'react';
import { BookOpen, CalendarDays, Printer } from 'lucide-react';

import { imageAssets } from '../../data/imageAssets';
import { videoAssets } from '../../data/videoAssets';

const aboutHighlights = [
  {
    icon: CalendarDays,
    title: 'Established',
    text: 'Since 2003',
  },
  {
    icon: Printer,
    title: 'Commercial',
    text: 'Printing Solutions',
  },
  {
    icon: BookOpen,
    title: 'Publishing',
    text: 'Books & Finishing',
  },
];

export default function AboutPrinting() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [showContent, setShowContent] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(false);

  useEffect(() => {
    const contentTimer = window.setTimeout(() => {
      setShowContent(true);
    }, 2200);

    return () => window.clearTimeout(contentTimer);
  }, []);

  const handleVideoEnded = () => {
    setShowThumbnail(true);
  };

  const playVideoAgain = async () => {
    const video = videoRef.current;

    if (!video) return;

    setShowThumbnail(false);
    video.currentTime = 0;

    try {
      await video.play();
    } catch (error) {
      console.error('NAPCO logo reveal video replay failed:', error);
    }
  };

  return (
    <section className="napco-about--video" id="about">
      <video
        ref={videoRef}
        className="napco-about__video"
        src={videoAssets.about.logoReveal}
        poster={imageAssets.about.logoRevealThumbnail}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnded}
      />

      <div className="napco-about__shade" />

      {showThumbnail && (
        <button
          type="button"
          className="napco-about__thumbnail"
          onMouseEnter={playVideoAgain}
          onFocus={playVideoAgain}
          onClick={playVideoAgain}
          aria-label="Replay NAPCO logo reveal video"
          data-cursor="Replay"
        >
          <img
            src={imageAssets.about.logoRevealThumbnail}
            alt="NAPCO logo reveal preview"
          />

          <span className="napco-about__thumbnail-play">
            <i className="fa-solid fa-play" />
            Replay Video
          </span>
        </button>
      )}

      <div className="napco-about__inner">
        <div
          className={`napco-about__content ${
            showContent ? 'napco-about__content--visible' : ''
          }`}
        >
          <span className="section-pill">About NAPCO</span>

          <h2>
            Professional
            <br />
            Printing &amp;
            <br />
            Publishing
            <br />
            Solutions
          </h2>

          <h3>NAPCO Printers (Pvt) Ltd</h3>

          <p>
            Established in 2003, NAPCO Printers is a trusted Sri Lankan printing
            and publishing company delivering reliable, high-quality solutions
            for corporate, institutional and commercial clients. From
            newspapers, magazines and books to brochures, catalogues, labels and
            annual reports, NAPCO combines modern printing technology,
            experienced professionals and strong finishing standards to bring
            every brand’s impression to life.
          </p>

          <div className="napco-about__highlights">
            {aboutHighlights.map(({ icon: Icon, title, text }) => (
              <article className="napco-about__card" key={title}>
                <span className="napco-about__card-icon">
                  <Icon size={24} />
                </span>

                <div>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </div>
              </article>
            ))}
          </div>

          <a href="/about-us" className="napco-about__button" data-cursor="Read More">
            Read More
          </a>
        </div>
      </div>
    </section>
  );
}