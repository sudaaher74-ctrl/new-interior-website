import React from 'react';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();
  return (
    <main id="page-projects">
      

    <div className="page-hero" style={{paddingTop: '80px'}} id="projects-page">
      <div className="page-hero-bg"
        style={{backgroundImage: `url('images/bombayB1.jpeg')`}}></div>
      <div className="page-hero-content">
        <span className="label">Our Portfolio</span>
        <h1>200+ Projects of <em style={{color: 'var(--gold)', fontStyle: 'italic'}}>Pure Design</em></h1>
      </div>
    </div>

    <section>
      <div className="container">
        <div className="projects-search reveal">
          <input type="text" id="project-search" className="search-input"
            placeholder="Search projects by name, location, tag..."
             />
        </div>
        <div className="projects-filter reveal" id="projects-page">
          <button className="filter-btn active" data-filter="All" >All Projects</button>
          <button className="filter-btn" data-filter="Residential"
            >Residential</button>
          <button className="filter-btn" data-filter="Corporate" >Corporate</button>
          <button className="filter-btn" data-filter="Turnkey" >Turnkey</button>
        </div>
        <div className="projects-grid" id="all-projects-grid"></div>
      </div>
    </section>

    {/* CTA */}
    <section style={{background: 'var(--graphite)', textAlign: 'center'}}>
      <div className="container reveal">
        <span className="label">Start a Project</span>
        <h2 style={{fontSize: '2.4rem', margin: '16px 0 24px'}}>Have a Space in Mind?</h2>
        <div className="gold-line center"></div>
        <p style={{maxWidth: '480px', margin: '0 auto 40px'}}>Tell us about your project and our team will get in touch within
          24 hours.</p>
        <button className="btn-primary" >Get in Touch</button>
      </div>
    </section>

    <footer>
      <div className="container">
        <div className="footer-bottom" style={{paddingTop: '0', borderTop: 'none'}}>
          <p>© 2024 OS Interiors Pvt. Ltd.</p>
          <button className="btn-outline" >Back to Home</button>
        </div>
      </div>
    </footer>

  
    </main>
  );
};

export default Projects;
