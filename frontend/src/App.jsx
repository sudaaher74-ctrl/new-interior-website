import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { getToken, isAdmin } from './api/session';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import InstallPWA from './components/InstallPWA';
import Portfolio from './pages/Portfolio';
import Process from './pages/Process';
import Contact from './pages/Contact';
import ProjectDetail from './pages/ProjectDetail';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';

// The dashboards are a separate application from the marketing site and drag in
// the PDF stack with them. Loading them lazily keeps ~1.3MB of ERP code out of
// the bundle a visitor downloads to read about interior design.
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const EmployeeDashboard = lazy(() => import('./pages/EmployeeDashboard'));
const PremiumPage = lazy(() => import('./pages/PremiumPage'));
const Login = lazy(() => import('./pages/Login'));

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

// Synchronizes Web App Manifest, Apple mobile web app metadata, and handles
// home-screen standalone launch redirection directly to dashboards.
function PWAHandler() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isEmp = pathname.startsWith('/employee');
    const isAdminRoute = pathname.startsWith('/admin');
    const isLogin = pathname.startsWith('/login');

    let manifestHref = '/manifest.webmanifest';
    let appTitle = 'OS Interiors';

    if (isEmp) {
      manifestHref = '/manifest-employee.webmanifest';
      appTitle = 'OS Portal';
    } else if (isAdminRoute) {
      manifestHref = '/manifest-admin.webmanifest';
      appTitle = 'OS Admin';
    } else if (isLogin) {
      manifestHref = '/manifest-employee.webmanifest';
      appTitle = 'OS Portal';
    }

    const links = document.querySelectorAll('link[rel="manifest"]');
    if (links.length === 0) {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = manifestHref;
      document.head.appendChild(link);
    } else {
      links[0].href = manifestHref;
      for (let i = 1; i < links.length; i++) {
        links[i].parentNode && links[i].parentNode.removeChild(links[i]);
      }
    }

    let appleTitle = document.getElementById('apple-mobile-title');
    if (!appleTitle) {
      appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    }
    if (!appleTitle) {
      appleTitle = document.createElement('meta');
      appleTitle.id = 'apple-mobile-title';
      appleTitle.name = 'apple-mobile-web-app-title';
      document.head.appendChild(appleTitle);
    }
    appleTitle.content = appTitle;

    // When the app is launched from the mobile home screen in standalone mode,
    // prevent landing on the customer marketing homepage if an employee is logged in.
    const inStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (inStandalone && pathname === '/') {
      const token = getToken();
      if (token) {
        navigate(isAdmin() ? '/admin' : '/employee', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [pathname, navigate]);

  return null;
}

// Dashboards are behind a login and load on their own route, so a plain text
// fallback is enough — nothing here is on the marketing critical path.
const Lazily = ({ children }) => (
  <Suspense fallback={<div style={{ padding: '48px' }}>Loading…</div>}>{children}</Suspense>
);

function App() {
  return (
    <Router>
      <PWAHandler />
      <InstallPWA />
      <ScrollToTop />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Lazily><Login /></Lazily>} />
        <Route
          path="/admin/*"
          element={
            <Lazily>
              <RequireAuth adminOnly>
                <AdminDashboard />
              </RequireAuth>
            </Lazily>
          }
        />
        <Route
          path="/employee/*"
          element={
            <Lazily>
              <RequireAuth>
                <EmployeeDashboard />
              </RequireAuth>
            </Lazily>
          }
        />
        <Route
          path="/premium"
          element={
            <Lazily>
              <RequireAuth>
                <PremiumPage />
              </RequireAuth>
            </Lazily>
          }
        />

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
            <WhatsAppButton />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
