import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="container">
      <div className="footer-cta reveal">
        <div className="footer-cta-content">
          <h2 className="h2-section" style={{ color: '#fff', marginBottom: '16px' }}>
            Planning a new space? Let's scope it together.
          </h2>
          <p className="body-large" style={{ color: '#fff', maxWidth: '480px', marginBottom: '32px' }}>
            Design, MEP, fit-out and handover — one contract, one accountable team.
          </p>
          <Link to="/contact" className="pill-btn-black" style={{ backgroundColor: '#1a1a18', color: '#fff' }}>
            Request a Quote
          </Link>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-col reveal">
          <div className="nav-brand" style={{ marginBottom: '16px' }}>
            <div className="nav-dot"></div>
            OS Interiors
          </div>
          <p className="body-text">
            Premium commercial interior and exterior contracting. Design, engineering and turnkey execution since 2014.
          </p>
        </div>
        
        <div className="footer-col reveal">
          <h4>Pages</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/portfolio">Portfolio</Link></li>
            <li><Link to="/process">Process</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div className="footer-col reveal">
          <h4>Services</h4>
          <ul>
            <li><Link to="/services">Restaurant Interiors</Link></li>
            <li><Link to="/services">Office & Corporate</Link></li>
            <li><Link to="/services">Retail & Showrooms</Link></li>
            <li><Link to="/services">Healthcare & Education</Link></li>
            <li><Link to="/services">Turnkey fit-out</Link></li>
            <li><Link to="/services">MEP services</Link></li>
            <li><Link to="/services">Exteriors & painting</Link></li>
          </ul>
        </div>
        
        <div className="footer-col reveal">
          <h4>Contact</h4>
          <ul>
            <li><a href="tel:+918767067884">+91 8767067884</a></li>
            <li><a href="mailto:info@osinteriors.in">info@osinteriors.in</a></li>
            <li><a href="https://www.osinteriors.in">www.osinteriors.in</a></li>
            <li>Mumbai, India</li>
          </ul>
        </div>
      </div>

      <div className="footer-legal reveal">
        <div>© 2026 OS Interiors. All rights reserved.</div>
        <div>Commercial interiors · Turnkey execution · India</div>
      </div>
    </footer>
  );
};

export default Footer;
