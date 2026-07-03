import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import ProjectDetail from './pages/ProjectDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import PremiumPage from './pages/PremiumPage';

import './assets/style.css';
import './assets/admin.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Override vanilla navigateTo to use React Router
    window.navigateTo = (pageId, data) => {
      const routes = {
        'page-home': '/',
        'page-about': '/about',
        'page-projects': '/projects',
        'page-contact': '/contact'
      };
      if (routes[pageId]) {
        navigate(routes[pageId]);
      } else if (pageId === 'page-project-detail' && data) {
        if (location.pathname !== `/projects/${data.id}`) {
          navigate(`/projects/${data.id}`);
        }
        setTimeout(() => {
          if (window.renderProjectDetail) window.renderProjectDetail(data);
        }, 100);
      }
      if (window.closeMobileMenu) window.closeMobileMenu();
    };
    // Re-trigger global JS initialization logic on route change
    setTimeout(() => {
      if (window.initNavbar) window.initNavbar();
      if (window.initRevealAnimations) window.initRevealAnimations();
      if (window.initCursor) window.initCursor();
      if (location.pathname === '/') {
        if (window.initHeroSlider) window.initHeroSlider();
        if (window.initTestimonials) window.initTestimonials();
        if (window.renderFeaturedProjects) window.renderFeaturedProjects();
      } else if (location.pathname === '/projects') {
        if (window.renderProjectsPage) window.renderProjectsPage();
      } else if (location.pathname.startsWith('/projects/')) {
        if (window.openProject) window.openProject(Number(location.pathname.split('/').pop()));
      } else if (location.pathname === '/admin') {
        if (window.initAdminDashboard) window.initAdminDashboard();
      } else if (location.pathname === '/employee') {
        if (window.initEmployeeDashboard) window.initEmployeeDashboard();
      }
    }, 100);
  }, [location.pathname]);

  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/employee/*" element={<EmployeeDashboard />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
