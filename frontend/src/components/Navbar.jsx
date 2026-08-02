import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar" id="navbar">
        <Link to="/" className="nav-logo">OS <span>Interiors</span></Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        <Link to="/contact" className="nav-cta" style={{textDecoration: 'none'}}>Book Consultation</Link>
        <button 
          className="nav-mobile-toggle"  
          aria-label="Menu"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} id="mobile-menu">
        <button
          style={{ position: 'absolute', top: '28px', right: '24px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
          onClick={() => setIsMobileMenuOpen(false)}>
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
        <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
        <Link to="/projects" onClick={() => setIsMobileMenuOpen(false)}>Projects</Link>
        <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
      </div>
    </>
  );
};

export default Navbar;
