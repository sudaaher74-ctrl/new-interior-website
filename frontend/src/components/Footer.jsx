import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICE_CATEGORIES, CAPABILITIES } from '../data/services';

const Footer = () => {
  return (
    <footer className="container">
      <div className="footer-cta reveal-stagger" style={{ backgroundColor: 'var(--cta-band)', borderRadius: 'var(--radius-lg)' }}>
        <div className="footer-cta-content">
          <h2 className="h2-section" style={{ color: 'white', maxWidth: '640px' }}>
            Planning a new space? Let's scope it together.
          </h2>
          <p className="body-large" style={{ color: 'var(--text-muted)', maxWidth: '520px' }}>
            Design, MEP, fit-out and handover — one contract, one accountable team.
          </p>
          <Link to="/contact" className="btn-primary btn-lg" style={{ marginTop: '12px', backgroundColor: 'white', color: 'black' }}>
            Request a quote
          </Link>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-col reveal-stagger">
          <div className="nav-brand" style={{ marginBottom: '16px' }}>
            <div className="nav-dot"></div>
            OS Interiors
          </div>
          <p className="body-text">
            Premium commercial interior and exterior contracting. Design, engineering and turnkey execution since 2014.
          </p>
        </div>
        
        <div className="footer-col reveal-stagger">
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
        
        <div className="footer-col reveal-stagger">
          <h4>Services</h4>
          <ul>
            {[...SERVICE_CATEGORIES, ...CAPABILITIES].map((item) => (
              <li key={item.slug}>
                <Link to={`/services#${item.slug}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="footer-col reveal-stagger">
          <h4>Contact</h4>
          <ul>
            <li><a href="tel:+918767067884">+91 8767067884</a></li>
            <li><a href="mailto:info@osinteriors.in">info@osinteriors.in</a></li>
            <li><a href="https://www.osinteriors.in">www.osinteriors.in</a></li>
            <li>Mumbai, India</li>
          </ul>
        </div>
      </div>

      <div className="footer-legal reveal-stagger">
        <div>© 2026 OS Interiors. All rights reserved.</div>
        <div>Commercial interiors · Turnkey execution · India</div>
      </div>
    </footer>
  );
};

export default Footer;
