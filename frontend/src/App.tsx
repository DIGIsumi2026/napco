import { Navigate, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Contact from './pages/Contact';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />

      {/* optional old URL support */}
      <Route path="/about" element={<Navigate to="/about-us" replace />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;