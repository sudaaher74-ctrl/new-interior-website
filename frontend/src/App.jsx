import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Process from './pages/Process';
import Contact from './pages/Contact';
import ProjectDetail from './pages/ProjectDetail';

import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import PremiumPage from './pages/PremiumPage';

// The dashboards style themselves with CSS modules; admin.css is legacy global
// CSS from the old static admin page and only clobbered the site's own tokens.
import './assets/style.css';

// Land at the top of each new page instead of keeping the previous scroll
// offset — unless the link carried a hash, in which case go to that section.
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }

    // The target may belong to a page that is still mounting, so look for it
    // after the paint rather than synchronously.
    const timer = setTimeout(() => {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo(0, 0);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/employee/*" element={<EmployeeDashboard />} />
        <Route path="/premium" element={<PremiumPage />} />
        
        {/* Marketing Website Routes */}
        <Route path="*" element={
          <>
            {/* Seven nav links sit ahead of the content on every page, so
                keyboard and screen-reader users get a way past them. */}
            <a className="skip-link" href="#main-content">Skip to content</a>
            <Navbar />
            <div id="main-content" tabIndex={-1}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:id" element={<ProjectDetail />} />
                <Route path="/process" element={<Process />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </div>
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
