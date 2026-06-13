import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <main id="page-project-detail">
      <div className="project-detail-hero" style={{paddingTop: '80px'}}>
        <img id="detail-hero-img" src="" alt="" />
        <div className="project-detail-hero-content">
          <span className="label" id="detail-category-tag"></span>
          <div className="gold-line"></div>
          <h1 id="detail-title">Project {id}</h1>
        </div>
      </div>

      <section>
        <div className="container">
          <div style={{marginBottom: '32px'}}>
            <button className="btn-outline" onClick={() => navigate('/projects')} style={{fontSize: '0.6rem'}}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Projects
            </button>
          </div>
          <div className="project-detail-body">
            <div>
              {/* Gallery Slider */}
              <div className="project-gallery-slider">
                <div className="project-gallery-track" id="gallery-track"></div>
                <div className="project-gallery-controls">
                  <div className="project-gallery-dots" id="gallery-dots"></div>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button className="btn-icon" onClick={() => window.slideGallery(-1)} style={{width: '40px', height: '40px'}}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                      </svg>
                    </button>
                    <button className="btn-icon" onClick={() => window.slideGallery(1)} style={{width: '40px', height: '40px'}}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{marginBottom: '40px'}}>
                <span className="label">About This Project</span>
                <div className="gold-line"></div>
                <p id="detail-description" style={{fontSize: '0.95rem', lineHeight: '1.9', color: 'var(--text-secondary)', marginTop: '16px'}}></p>
              </div>

              {/* Tags */}
              <div id="detail-tags" style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '48px'}}></div>

              {/* Testimonial */}
              <div className="project-testimonial">
                <blockquote id="detail-testimonial-text"></blockquote>
                <p style={{fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500', marginBottom: '2px'}} id="detail-testimonial-name"></p>
                <p style={{fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)'}} id="detail-testimonial-role"></p>
              </div>
            </div>

            {/* Sidebar Specs */}
            <div className="project-specs">
              <h4 style={{fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '24px'}}>
                Project Details
              </h4>
              <div className="spec-item">
                <div className="spec-label">Category</div>
                <div className="spec-value" id="spec-category"></div>
              </div>
              <div className="spec-item">
                <div className="spec-label">Location</div>
                <div className="spec-value" id="spec-location"></div>
              </div>
              <div className="spec-item">
                <div className="spec-label">Budget Range</div>
                <div className="spec-value" id="spec-budget"></div>
              </div>
              <div className="spec-item">
                <div className="spec-label">Area</div>
                <div className="spec-value" id="spec-area"></div>
              </div>
              <div className="spec-item">
                <div className="spec-label">Completion</div>
                <div className="spec-value" id="spec-date"></div>
              </div>
              <div className="spec-item">
                <div className="spec-label">Project Views</div>
                <div className="spec-value" id="spec-views"></div>
              </div>
              <div style={{marginTop: '32px'}}>
                <button className="btn-primary" onClick={() => navigate('/contact')} style={{width: '100%', justifyContent: 'center'}}>
                  Start Similar Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProjectDetail;
