import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar" id="navbar">
      
    <a className="nav-logo" >OS <span>Interiors</span></a>
    <ul className="nav-links">
      <li><a data-page="page-home" >Home</a></li>
      <li><a data-page="page-about" >About</a></li>
      <li><a data-page="page-projects" >Projects</a></li>
      <li><a data-page="page-contact" >Contact</a></li>
    </ul>
    <button className="nav-cta" >Book Consultation</button>
    <button className="nav-mobile-toggle"  aria-label="Menu">
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  
    </nav>
  );
};

export default Navbar;
