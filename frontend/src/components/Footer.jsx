import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">OS <span>Interiors</span></div>
            <p className="footer-tagline">India's premier luxury interior design studio. Transforming spaces into timeless
              experiences since 2014.</p>
            <div className="footer-social">
              <button className="social-btn">IN</button>
              <button className="social-btn">IG</button>
              <button className="social-btn">FB</button>
              <button className="social-btn">YT</button>
            </div>
          </div>
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li><a >Home</a></li>
              <li><a >About Us</a></li>
              <li><a >Projects</a></li>
              <li><a >Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-col-title">Services</h4>
            <ul className="footer-links">
              <li><a>Residential Design</a></li>
              <li><a>Corporate Interiors</a></li>
              <li><a>Turnkey Projects</a></li>
              <li><a>Space Planning</a></li>
              <li><a>3D Visualization</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-col-title">Contact</h4>
            <ul className="footer-links">
              <li><a>+91 22 6642 4242</a></li>
              <li><a>OS_Interior@gmail.com</a></li>
              <li><a>Level 12, Wwork, Belapur CBD<br />Navi Mumbai 400 051</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 OS Interiors Pvt. Ltd. All rights reserved.</p>
          <p>Privacy Policy · Terms of Service</p>
        </div>
      </div>
    
    </footer>
  );
};

export default Footer;
