import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <main id="page-home">
      

    {/* Hero */}
    <section className="hero" id="hero">
      <div className="hero-slides" id="hero-slides"></div>
      <div className="hero-content container">
        <span className="label">Est. 2014 · Mumbai, India</span>
        <h1 className="hero-title">Design That<br /><em>Transforms</em><br />Lives</h1>
        <p className="hero-subtitle">We craft extraordinary interiors for those who demand nothing less. From a Mumbai /
          Navi mumbai
          penthouse to a corporate campus — every space, a masterpiece.</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate('/projects')}>
            View Our Work
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          <button className="btn-outline" onClick={() => navigate('/contact')}>Book Consultation</button>
        </div>
      </div>
      <div className="hero-counter container">
        <div>
          <div className="hero-stat-number">20+</div>
          <div className="hero-stat-label">Projects Delivered</div>
        </div>
        <div>
          <div className="hero-stat-number">₹50Cr+</div>
          <div className="hero-stat-label">Value Transformed</div>
        </div>
        <div>
          <div className="hero-stat-number">10</div>
          <div className="hero-stat-label">Years of Excellence</div>
        </div>
      </div>
      <div className="hero-slide-controls" id="hero-dots"></div>
      <div className="hero-scroll-indicator">Scroll</div>
    </section>

    {/* Intro Strip */}
    <div className="intro-strip">
      <div className="strip-inner" id="strip-inner">
        <span className="strip-item"><span className="dot"></span> Residential Design</span>
        <span className="strip-item"><span className="dot"></span> Corporate Interiors</span>
        <span className="strip-item"><span className="dot"></span> Turnkey Projects</span>
        <span className="strip-item"><span className="dot"></span> Space Planning</span>
        <span className="strip-item"><span className="dot"></span> 3D Visualization</span>
        <span className="strip-item"><span className="dot"></span> Furniture Curation</span>
        <span className="strip-item"><span className="dot"></span> Smart Home Integration</span>
        <span className="strip-item"><span className="dot"></span> Landscape Design</span>
        {/* duplicate for seamless loop */}
        <span className="strip-item"><span className="dot"></span> Residential Design</span>
        <span className="strip-item"><span className="dot"></span> Corporate Interiors</span>
        <span className="strip-item"><span className="dot"></span> Turnkey Projects</span>
        <span className="strip-item"><span className="dot"></span> Space Planning</span>
        <span className="strip-item"><span className="dot"></span> 3D Visualization</span>
        <span className="strip-item"><span className="dot"></span> Furniture Curation</span>
        <span className="strip-item"><span className="dot"></span> Smart Home Integration</span>
        <span className="strip-item"><span className="dot"></span> Landscape Design</span>
      </div>
    </div>

    {/* Services */}
    <section style={{padding: '0'}}>
      <div className="services-grid">
        <div className="service-card" onClick={() => navigate('/projects')} style={{cursor: 'pointer'}}>
          <img src="/images/IMG_2696.JPG" alt="Residential Design" loading="lazy" />
          <div className="service-card-overlay">
            <span className="service-number">02</span>
            <h3>Residential</h3>
            <p>Homes that whisper your story. From compact urban apartments to sprawling farmhouses, we create living
              spaces that nurture the soul.</p>
            <div className="service-arrow">
              Explore
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </div>
        <div className="service-card" onClick={() => navigate('/projects')} style={{cursor: 'pointer'}}>
          <img src="/images/IMG_2697.JPG" alt="Corporate Design" loading="lazy" />
          <div className="service-card-overlay">
            <span className="service-number">02</span>
            <h3>Corporate</h3>
            <p>Workplaces that inspire performance. We design offices, hotels, and commercial spaces where brand culture
              and human wellbeing converge.</p>
            <div className="service-arrow">
              Explore
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </div>
        <div className="service-card" onClick={() => navigate('/projects')} style={{cursor: 'pointer'}}>
          <img src="/images/IMG_2695.JPG" alt="Turnkey Projects" loading="lazy" />
          <div className="service-card-overlay">
            <span className="service-number">03</span>
            <h3>Turnkey</h3>
            <p>One contract, zero stress. We take complete ownership from concept to keys-in-hand — design, procurement,
              execution, and delivery.</p>
            <div className="service-arrow">
              Explore
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Featured Projects */}
    <section style={{background: 'var(--charcoal)'}}>
      <div className="container">
        <div className="section-header reveal">
          <span className="label">Our Portfolio</span>
          <h2>Featured <em style={{fontStyle: 'italic', color: 'var(--gold)'}}>Projects</em></h2>
          <div className="gold-line center"></div>
          <p>Each project is a chapter in our story of transforming raw spaces into exceptional environments that
            endure.</p>
        </div>
        <div className="projects-filter reveal" id="home-filter">
          <button className="filter-btn active" data-filter="All" >All</button>
          <button className="filter-btn" data-filter="Residential"
            >Residential</button>
          <button className="filter-btn" data-filter="Corporate" >Corporate</button>
          <button className="filter-btn" data-filter="Turnkey" >Turnkey</button>
        </div>
        <div className="projects-grid" id="featured-projects-grid"></div>
        <div style={{textAlign: 'center', marginTop: '56px'}}>
          <button className="btn-outline" onClick={() => navigate('/projects')}>
            View All Projects
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </section>

    {/* Process */}
    <section className="process-section">
      <div className="container">
        <div className="section-header reveal">
          <span className="label">How We Work</span>
          <h2>The OS Interiors <em style={{fontStyle: 'italic', color: 'var(--gold)'}}>Process</em></h2>
          <div className="gold-line center"></div>
          <p>A proven methodology refined over 200+ projects. Structured for certainty, designed for delight.</p>
        </div>
        <div className="process-steps reveal">
          <div className="process-step">
            <div className="process-step-num">01</div>
            <h4>Discovery</h4>
            <p>Deep dive into your lifestyle, aspirations, and spatial requirements. Every great design begins with
              listening.</p>
          </div>
          <div className="process-step">
            <div className="process-step-num">02</div>
            <h4>Design</h4>
            <p>Concept development, mood boards, 3D walkthroughs, and material selection. You visualize before we build.
            </p>
          </div>
          <div className="process-step">
            <div className="process-step-num">03</div>
            <h4>Execution</h4>
            <p>Precision project management with weekly reports. Our site teams operate to zero-defect quality
              standards.</p>
          </div>
          <div className="process-step">
            <div className="process-step-num">04</div>
            <h4>Delivery</h4>
            <p>White-glove handover, complete snagging, and a 2-year defects warranty. We stay until it's perfect.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section style={{background: 'var(--charcoal)'}}>
      <div className="container">
        <div className="section-header reveal">
          <span className="label">Client Stories</span>
          <h2>What Our Clients <em style={{fontStyle: 'italic', color: 'var(--gold)'}}>Say</em></h2>
          <div className="gold-line center"></div>
        </div>
        <div className="testimonials-wrapper reveal">
          <div className="testimonials-track" id="testimonials-track"></div>
          <div className="testimonial-controls">
            <button className="btn-icon" onClick={() => window.slideTestimonial(-1)} aria-label="Previous">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <button className="btn-icon" onClick={() => window.slideTestimonial(1)} aria-label="Next">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* Client Logos */}
    <section className="clients-section">
      <div className="container">
        <div className="section-header reveal" style={{marginBottom: '48px'}}>
          <span className="label">Trusted By</span>
          <h2>Our <em style={{fontStyle: 'italic', color: 'var(--gold)'}}>Clients</em></h2>
          <div className="gold-line center"></div>
        </div>
        <div className="clients-grid reveal">
          <div className="client-logo">TATA</div>
          <div className="client-logo">BIRLA</div>
          <div className="client-logo">GODREJ</div>
          <div className="client-logo">OBEROI</div>
          <div className="client-logo">MARRIOTT</div>
          <div className="client-logo">COGNIZANT</div>
          <div className="client-logo">MAHINDRA</div>
          <div className="client-logo">WIPRO</div>
          <div className="client-logo">INFOSYS</div>
          <div className="client-logo">HYATT</div>
          <div className="client-logo">ITC</div>
          <div className="client-logo">LODHA</div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="cta-section"
      style={{backgroundImage: `url('/images/IMG_2696.JPG')`}}>
      <div className="container reveal">
        <span className="label">Begin Your Journey</span>
        <h2>Ready to <em style={{fontStyle: 'italic', color: 'var(--gold)'}}>Transform</em> Your Space?</h2>
        <div className="gold-line center"></div>
        <p>Book a complimentary consultation with our senior design directors. We'll discuss your vision, timeline, and
          investment range — no obligation.</p>
        <div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <button className="btn-primary" onClick={() => navigate('/contact')}>
            Book Free Consultation
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          <a className="btn-outline" href="tel:+919773597150">+91 97735 97150</a>
        </div>
      </div>
    </section>

    {/* Gallery Preview */}
    <section style={{padding: '0'}}>
      <div className="gallery-grid">
        <div className="gallery-item"><img src="/images/IMG_2701.JPG" alt="Gallery" loading="lazy" />
          <div className="gallery-item-overlay"><svg width="24" height="24" fill="none" stroke="white" strokeWidth="1.5"
              viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg></div>
        </div>
        <div className="gallery-item"><img src="/images/IMG_2698.JPG" alt="Gallery" loading="lazy" />
          <div className="gallery-item-overlay"><svg width="24" height="24" fill="none" stroke="white" strokeWidth="1.5"
              viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg></div>
        </div>
        <div className="gallery-item"><img src="/images/IMG_2702.JPG" alt="Gallery" loading="lazy" />
          <div className="gallery-item-overlay"><svg width="24" height="24" fill="none" stroke="white" strokeWidth="1.5"
              viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg></div>
        </div>
        <div className="gallery-item"><img src="/images/IMG_2705.JPG" alt="Gallery" loading="lazy" />
          <div className="gallery-item-overlay"><svg width="24" height="24" fill="none" stroke="white" strokeWidth="1.5"
              viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg></div>
        </div>
        <div className="gallery-item"><img src="/images/IMG_2706.JPG" alt="Gallery" loading="lazy" />
          <div className="gallery-item-overlay"><svg width="24" height="24" fill="none" stroke="white" strokeWidth="1.5"
              viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg></div>
        </div>
      </div>
    </section>

    {/* Footer */}
    

  
    </main>
  );
};

export default Home;
