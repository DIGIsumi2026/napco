import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactLenis } from '@studio-freight/react-lenis';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles/global.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* Snappier Lenis config: increased lerp to 0.12, duration to 1.0 */}
    <ReactLenis root options={{ lerp: 0.12, duration: 1.0, smoothWheel: true }}>
      <App />
    </ReactLenis>
  </React.StrictMode>
);
