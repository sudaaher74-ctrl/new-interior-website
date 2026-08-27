import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Photo from '../components/Photo';
import { CAPABILITIES, SERVICE_CATEGORIES } from '../data/services';

const About = () => {
  useScrollReveal();
  useDocumentTitle(
    'About',
    'A premium commercial interior and exterior contractor based in India since 2014, with design, engineering, project management and craftsmanship under one roof.'
  );

  return (
    <main>
      <section className="container section-spacing">
        <div className="grid-2 items-center reveal-stagger">
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
          {/* Using a general image for team portrait placeholder */}
          <Photo
            src="/images/IMG_2701.webp"
            alt="OS Interiors Team"
            ratio="4 / 3"
            className="img-rounded-lg"
            priority
          />
        </div>
      </section>

      <section className="container mb-8">
        <div className="grid-2 reveal-stagger">
          <div className="surface-block hover-float" style={{ padding: '56px' }}>
            <h3 className="h3-card mb-4">Our vision</h3>
            <p className="body-text">
              To become India's most trusted commercial interior and turnkey execution company, creating world-class spaces that inspire businesses and enhance customer experiences.
            </p>
          </div>
          <div className="surface-card hover-float" style={{ padding: '56px' }}>
            <h3 className="h3-card mb-4">Our mission</h3>
            <p className="body-text">
              Deliver innovative, functional and aesthetically exceptional commercial environments through creativity, engineering excellence, quality craftsmanship and timely project execution.
            </p>
          </div>
        </div>
      </section>

      <section className="container section-spacing">
        <h2 className="h2-section mb-8 reveal">Core values</h2>
        <div className="grid-5 reveal-stagger">
          {['Integrity', 'Innovation', 'Quality', 'Transparency', 'Craftsmanship', 'Client satisfaction', 'Professionalism', 'Sustainability', 'Safety', 'Commitment'].map((value, i) => (
            <div key={i} className="hover-float" style={{ padding: '32px 24px', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontWeight: 600, color: 'var(--text-primary)' }}>
              {value}
            </div>
          ))}
        </div>
      </section>

      <section className="container section-spacing">
        <h2 className="h2-section mb-8 reveal">Sectors we build for</h2>
        <div className="grid-4 reveal-stagger">
          {SERVICE_CATEGORIES.map((service) => (
            <div key={service.n} className="surface-card hover-float" style={{ padding: '40px' }}>
              <h4 className="h4-card mb-2">{service.title}</h4>
              <p className="body-text">{service.short}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section-spacing">
        <h2 className="h2-section mb-8 reveal">What we deliver in-house</h2>
        <div className="grid-3 reveal-stagger">
          {CAPABILITIES.map((cap) => (
            <div key={cap.title} className="surface-block hover-float" style={{ padding: '40px' }}>
              <h4 className="h4-card mb-2">{cap.title}</h4>
              <p className="body-text">{cap.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section-spacing">
        <h2 className="h2-section mb-8 reveal">Why clients choose us</h2>
        <div className="grid-3 reveal-stagger">
          <div className="surface-card hover-float" style={{ padding: '40px' }}>
            <h4 className="h4-card mb-2">Design + execution in one</h4>
            <p className="body-text">No miscommunication between architect and contractor. We handle both.</p>
          </div>
          <div className="surface-card hover-float" style={{ padding: '40px' }}>
            <h4 className="h4-card mb-2">Restaurant expertise</h4>
            <p className="body-text">Deep understanding of kitchen flow, covers, HVAC and acoustic needs.</p>
          </div>
          <div className="surface-card hover-float" style={{ padding: '40px' }}>
            <h4 className="h4-card mb-2">MEP integrated</h4>
            <p className="body-text">Mechanical, electrical and plumbing are engineered in-house.</p>
          </div>
          <div className="surface-card hover-float" style={{ padding: '40px' }}>
            <h4 className="h4-card mb-2">Professional project management</h4>
            <p className="body-text">Dedicated managers, strict timelines, and weekly progress reports.</p>
          </div>
          <div className="surface-card hover-float" style={{ padding: '40px' }}>
            <h4 className="h4-card mb-2">Premium finish quality</h4>
            <p className="body-text">Sourcing the finest materials and deploying skilled craftsmen.</p>
          </div>
          <div className="surface-card hover-float" style={{ padding: '40px' }}>
            <h4 className="h4-card mb-2">Transparent pricing</h4>
            <p className="body-text">Detailed BOQ before commencement. No hidden costs or sudden variations.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
