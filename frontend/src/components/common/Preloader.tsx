import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// The video is served from the /public folder
const PRELOADER_VIDEO = '/assets/videos/pre-loader.webm';
const MAX_VISIBLE_MS = 1200;
const FADE_MS = 180;

export default function Preloader() {
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const dismissTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
    if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);
    document.body.style.overflow = '';
  }, []);

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
    if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
    setHiding(false);
    setActive(true);
    setRouteKey(location.pathname);
  }, [location.pathname]);

  // Whenever the overlay becomes active, play the video from the start
  useEffect(() => {
    if (!active) return;
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;

    // Prevent body scroll while preloader is up
    document.body.style.overflow = 'hidden';

    let dismissed = false;
    const triggerDismiss = () => {
      if (dismissed || cancelled) return;
      dismissed = true;
      if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);
      setHiding(true);
      document.body.style.overflow = '';
      dismissTimeoutRef.current = setTimeout(() => setActive(false), FADE_MS);
    };

    video.currentTime = 0;
    video.playbackRate = 1.5;
    maxTimeoutRef.current = setTimeout(triggerDismiss, MAX_VISIBLE_MS);
    video.play().catch(() => {
      triggerDismiss();
    });

    const onTimeUpdate = () => {
      if (video.duration && video.duration - video.currentTime <= 0.35) {
        triggerDismiss();
        video.removeEventListener('timeupdate', onTimeUpdate);
      }
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', triggerDismiss, { once: true });
    
    return () => {
      cancelled = true;
      if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);
      video.pause();
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', triggerDismiss);
    };
  }, [active, routeKey]);

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
