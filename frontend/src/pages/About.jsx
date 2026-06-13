import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  return (
    <main id="page-about">
      

    <div className="about-hero" style={{paddingTop: '80px'}}>
      <div className="about-hero-bg"
        style={{backgroundImage: `url('/images/IMG_2697.JPG')`}}></div>
      <div className="about-hero-content">
        <span className="label">About OS Interiors</span>
        <h1>A Decade of <em style={{color: 'var(--gold)', fontStyle: 'italic'}}>Excellence</em></h1>
      </div>
    </div>

    <section>
      <div className="container">
        <div className="about-story reveal">
          <div className="about-story-img">
            <img src="/images/IMG_2695.JPG" alt="OS Interiors Studio"
              loading="lazy" />
          </div>
          <div>
            <span className="label">Our Story</span>
            <div className="gold-line"></div>
            <h2 style={{fontSize: '2.4rem', marginBottom: '24px'}}>Born from a Belief That <em
                style={{color: 'var(--gold)', fontStyle: 'italic'}}>Space Shapes Life</em></h2>
            <p style={{marginBottom: '20px'}}>OS Interiors was founded in 2014 by Ajay Jadhav with a singular
              conviction: that exceptional design is not a luxury reserved for the few, but a fundamental right that
              transforms how we live, work, and experience the world.</p>
            <p style={{marginBottom: '20px'}}>Beginning with a single residential project in South Mumbai, we have grown
              into a 48-person studio delivering ₹500 crore+ of interior transformation across India. Our portfolio
              spans penthouses in Mumbai to corporate campuses in Hyderabad, boutique hotels in Goa to family villas in
              Lonavala.</p>
            <p style={{marginBottom: '40px'}}>Through it all, one thing has remained constant: our obsessive attention to
              detail and our belief that every project deserves our very best.</p>
            <button className="btn-outline" >
              See Our Work
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* Founder Message */}
    <section style={{background: 'var(--charcoal)', padding: '80px 0'}}>
      <div className="container">
        <div className="founder-card reveal">
          <div className="founder-card-grid">
            <img className="founder-avatar" src=""
              alt="Ajay Jadhav" />
            <div>
              <span className="label">Founder's Message</span>
              <div className="gold-line"></div>
              <p className="founder-quote">"Every space we touch carries a responsibility — to the person who will inhabit
                it, to the craft of design, and to the idea that beautiful environments make better human beings. We
                take that responsibility with tremendous seriousness and even greater joy."</p>
              <p style={{fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '4px', fontWeight: '500'}}>Ajay Jadhav
              </p>
              <p style={{fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)'}}>Founder &
                Principal Designer</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Achievements */}
    <section>
      <div className="container">
        <div className="section-header reveal">
          <span className="label">By the Numbers</span>
          <h2>A Decade of <em style={{fontStyle: 'italic', color: 'var(--gold)'}}>Impact</em></h2>
          <div className="gold-line center"></div>
        </div>
        <div className="achievements-grid reveal">
          <div className="achievement-item">
            <div className="achievement-number">200+</div>
            <div className="achievement-label">Projects Completed</div>
          </div>
          <div className="achievement-item">
            <div className="achievement-number">2</div>
            <div className="achievement-label">Design Professionals</div>
          </div>
          <div className="achievement-item">
            <div className="achievement-number">₹50Cr</div>
            <div className="achievement-label">Project Value Delivered</div>
          </div>
          <div className="achievement-item">
            <div className="achievement-number">1</div>
            <div className="achievement-label">Industry Awards</div>
          </div>
        </div>
      </div>
    </section>

    {/* Team */}
    <section style={{background: 'var(--charcoal)'}}>
      <div className="container">
        <div className="section-header reveal">
          <span className="label">The Team</span>
          <h2>Creative <em style={{fontStyle: 'italic', color: 'var(--gold)'}}>Minds</em></h2>
          <div className="gold-line center"></div>
          <p>48 designers, architects, and project managers united by a single standard: perfection.</p>
        </div>
        <div className="team-grid reveal">
          <div className="team-card">
            <div className="team-card-img"><img
                src="" alt="Ajay Jadhav" />
            </div>
            <h4>Ajay Jadhav</h4>
            <p className="team-card-role">Founder & Principal Designer</p>
          </div>
          <div className="team-card">
            <div className="team-card-img"><img src=""
                alt="Rushikesh Patil" loading="lazy" /></div>
            <h4>Rushikesh Patil</h4>
            <p className="team-card-role">Head of Corporate Projects</p>
          </div>
          <div className="team-card">
            <div className="team-card-img"><img
                src="" alt="Ashy Deshmukha"
                loading="lazy" /></div>
            <h4> Ashy Deshmukha</h4>
            <p className="team-card-role">Senior Design Director</p>
          </div>
          <div className="team-card">
            <div className="team-card-img"><img
                src="" alt="Ajay Jadhav" />
            </div>
            <h4>Ajay Jadhav</h4>
            <p className="team-card-role">Head of Project Delivery</p>
          </div>
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section>
      <div className="container">
        <div className="section-header reveal">
          <span className="label">Our Journey</span>
          <h2>A Story of <em style={{fontStyle: 'italic', color: 'var(--gold)'}}>Growth</em></h2>
          <div className="gold-line center"></div>
        </div>
        <div style={{maxWidth: '640px', margin: '0 auto'}} className="reveal">
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-year">2014</div>
              <h4>The Beginning</h4>
              <p> Rushikesh Patil founded OS Interiors from a 200 sq ft studio in Bandra. First project: a 900 sq ft
                apartment in Khar.</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2016</div>
              <h4>Corporate Entry</h4>
              <p>Secured first major corporate contract — a 5,000 sq ft office for a fintech startup in Andheri. The
                project won the FOAID Award for Best Commercial Interior.</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2018</div>
              <h4>Team Expansion</h4>
              <p>Grew to 20 designers. Launched the Turnkey division. Delivered our first project outside Maharashtra —
                a Bangalore villa.</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2020</div>
              <h4>Resilience & Innovation</h4>
              <p>During the pandemic, pioneered virtual design consultations and 3D walkthrough presentations. Delivered
                14 projects remotely.</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2022</div>
              <h4>National Presence</h4>
              <p>Opened offices in Navi Mumbai and Pune . Surpassed ₹100 Cr in annual project value. Named in
                Architectural Digest's "Top 50 Design Studios" list.</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2024</div>
              <h4>Present Day</h4>
              <p>48-person studio. 20+ projects delivered. 18 industry awards. ₹50 Cr+ in project value. And counting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    

  
    </main>
  );
};

export default About;
