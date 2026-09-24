import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import RouteScrollManager from './components/common/RouteScrollManager';
import CustomCursor from './components/common/CustomCursor';
import Preloader from './components/common/Preloader';
import { shouldUseRichEffects } from './utils/performance';

const AboutUs = lazy(() => import('./pages/AboutUs'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  const [showPreloader, setShowPreloader] = useState(
    shouldUseRichEffects
  );

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1025px)');
    const updatePreloader = () => setShowPreloader(shouldUseRichEffects());
    desktop.addEventListener('change', updatePreloader);
    return () => desktop.removeEventListener('change', updatePreloader);
  }, []);

  return (
    <>
      {showPreloader && <Preloader />}
      <CustomCursor />
      <RouteScrollManager />
      <Suspense fallback={<div className="route-placeholder" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
