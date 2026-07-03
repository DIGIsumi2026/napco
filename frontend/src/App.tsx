import { Navigate, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about-us" element={<AboutUs />} />
      {/* active after the servise.tsx */}
      {/*<Route path="/services" element={<Services />} />*/}

      {/* optional old URL support */}
      <Route path="/about" element={<Navigate to="/about-us" replace />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;