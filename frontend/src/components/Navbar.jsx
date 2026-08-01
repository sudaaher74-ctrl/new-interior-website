import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <div className="nav-dot"></div>
        OS Interiors
      </Link>
      
      <div className="nav-links">
        <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
        <NavLink to="/about" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>About</NavLink>
        <NavLink to="/services" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Services</NavLink>
        <NavLink to="/portfolio" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Portfolio</NavLink>
        <NavLink to="/process" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Process</NavLink>
        <NavLink to="/contact" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>
      </div>

      <Link to="/contact" className="pill-btn-black">Request a Quote</Link>
    </nav>
  );
};

export default Navbar;
