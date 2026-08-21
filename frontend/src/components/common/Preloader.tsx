import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// The video is served from the /public folder
const PRELOADER_VIDEO = '/assets/videos/pre-loader.webm';

export default function Preloader() {
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);

  // `active` = overlay is mounted and visible
  const [active, setActive] = useState(true);
  // `hiding` = video ended, now fading out
  const [hiding, setHiding] = useState(false);

  // Key changes every time the route changes so the component remounts
  const [routeKey, setRouteKey] = useState(location.pathname);

  // On every route change (except the very first paint which is handled by `active: true`)
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    // New route → bring the preloader back
    setHiding(false);
    setActive(true);
    setRouteKey(location.pathname);
  }, [location.pathname]);

  // Whenever the overlay becomes active, play the video from the start
  useEffect(() => {
    if (!active) return;
    const video = videoRef.current;
    if (!video) return;

    // Prevent body scroll while preloader is up
    document.body.style.overflow = 'hidden';

    video.currentTime = 0;
    video.play().catch(() => {
      // Auto-play blocked – still dismiss after a short delay
      setTimeout(dismiss, 1200);
    });

    let dismissed = false;
    
    const triggerDismiss = () => {
      if (!dismissed) {
        dismissed = true;
        dismiss();
      }
    };

    const onTimeUpdate = () => {
      // Dismiss 1 second before the video actually ends to reduce preloader time
      if (video.duration && video.duration - video.currentTime <= 1) {
        triggerDismiss();
        video.removeEventListener('timeupdate', onTimeUpdate);
      }
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', triggerDismiss, { once: true });
    
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', triggerDismiss);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, routeKey]);

  function dismiss() {
    setHiding(true);
    // Wait for the fade-out transition, then remove the overlay
    setTimeout(() => {
      setActive(false);
      document.body.style.overflow = '';
    }, 600);
  }

  if (!active) return null;

  return (
    <div className={`napco-preloader${hiding ? ' napco-preloader--hiding' : ''}`}>
      {/* Blurred page backdrop */}
      <div className="napco-preloader__blur" />

      {/* Video */}
      <div className="napco-preloader__stage">
        <video
          ref={videoRef}
          className="napco-preloader__video"
          src={PRELOADER_VIDEO}
          muted
          playsInline
          disablePictureInPicture
          preload="auto"
        />
      </div>
    </div>
  );
}
