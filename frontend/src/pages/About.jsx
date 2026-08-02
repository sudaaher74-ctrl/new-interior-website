import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const About = () => {
  useScrollReveal();

  return (
    <main>
      <section className="container section-spacing">
        <div className="grid-2 items-center reveal">
          <div>
            <div className="eyebrow mb-4">About</div>
            <h1 className="h1-page mb-6">One team for design, engineering and execution</h1>
            <p className="body-large mb-4">
              OS Interiors is a premium commercial interior and exterior contracting company based in India, operating since 2014. We design, engineer and execute world-class commercial spaces — and we do it without handing our clients off to a chain of contractors.
            </p>
            <p className="body-large">
              Creativity, engineering, project management and craftsmanship sit under one roof, which is why our spaces open on time and keep performing years later.
            </p>
          </div>
          <div style={{ position: 'relative', height: '520px' }}>
            {/* Using a general image for team portrait placeholder */}
            <img src="/images/IMG_2701.JPG" alt="OS Interiors Team" className="img-rounded-lg" style={{ height: '100%' }} />
          </div>
        </div>
      </section>

      <section className="container mb-8">
        <div className="grid-2 reveal">
          <div className="surface-block" style={{ padding: '56px' }}>
            <h3 className="h3-card mb-4">Our vision</h3>
            <p className="body-text">
              To become India's most trusted commercial interior and turnkey execution company, creating world-class spaces that inspire businesses and enhance customer experiences.
            </p>
          </div>
          <div className="surface-card" style={{ padding: '56px' }}>
            <h3 className="h3-card mb-4">Our mission</h3>
            <p className="body-text">
              Deliver innovative, functional and aesthetically exceptional commercial environments through creativity, engineering excellence, quality craftsmanship and timely project execution.
            </p>
          </div>
        </div>
      </section>

      <section className="container section-spacing">
        <h2 className="h2-section mb-8 reveal">Core values</h2>
        <div className="grid-5 reveal">
          {['Integrity', 'Innovation', 'Quality', 'Transparency', 'Craftsmanship', 'Client satisfaction', 'Professionalism', 'Sustainability', 'Safety', 'Commitment'].map((value, i) => (
            <div key={i} style={{ padding: '32px 24px', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontWeight: 600, color: 'var(--text-primary)' }}>
              {value}
            </div>
          ))}
        </div>
      </section>

      <section className="container section-spacing">
        <h2 className="h2-section mb-8 reveal">Why clients choose us</h2>
        <div className="grid-3 reveal">
          <div className="surface-card" style={{ padding: '40px' }}>
            <h4 className="h4-card mb-2">Design + execution in one</h4>
            <p className="body-text">No miscommunication between architect and contractor. We handle both.</p>
          </div>
          <div className="surface-card" style={{ padding: '40px' }}>
            <h4 className="h4-card mb-2">Restaurant expertise</h4>
            <p className="body-text">Deep understanding of kitchen flow, covers, HVAC and acoustic needs.</p>
          </div>
          <div className="surface-card" style={{ padding: '40px' }}>
            <h4 className="h4-card mb-2">MEP integrated</h4>
            <p className="body-text">Mechanical, electrical and plumbing are engineered in-house.</p>
          </div>
          <div className="surface-card" style={{ padding: '40px' }}>
            <h4 className="h4-card mb-2">Professional project management</h4>
            <p className="body-text">Dedicated managers, strict timelines, and weekly progress reports.</p>
          </div>
          <div className="surface-card" style={{ padding: '40px' }}>
            <h4 className="h4-card mb-2">Premium finish quality</h4>
            <p className="body-text">Sourcing the finest materials and deploying skilled craftsmen.</p>
          </div>
          <div className="surface-card" style={{ padding: '40px' }}>
            <h4 className="h4-card mb-2">Transparent pricing</h4>
            <p className="body-text">Detailed BOQ before commencement. No hidden costs or sudden variations.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
