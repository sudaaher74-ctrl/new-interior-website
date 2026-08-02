import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Services = () => {
  useScrollReveal();

  return (
    <main>
      <section className="container mt-8 mb-8 reveal">
        <div className="eyebrow mb-4">SERVICES</div>
        <h1 className="h1-page mb-12">Everything a commercial space needs, from one contract</h1>

        <div className="grid-2">
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '48px', position: 'relative' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#1a1a18', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '24px' }}>1</div>
            <h3 className="h3-card mb-4">Commercial Interior Design</h3>
            <p className="body-text mb-6">Offices, HQs, startup offices, co-working, conference rooms, reception, executive cabins, meeting rooms.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="chip">Workplace</span><span className="chip">Cabins</span><span className="chip">Co-working</span>
            </div>
          </div>
          
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '48px', position: 'relative' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#1a1a18', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '24px' }}>2</div>
            <h3 className="h3-card mb-4">Restaurant Interior Design</h3>
            <p className="body-text mb-6">Fine dining, cafés, bars, pubs, food courts, cloud kitchens, QSR, theme restaurants.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="chip">Dining</span><span className="chip">Bars</span><span className="chip">QSR</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '48px', position: 'relative' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#1a1a18', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '24px' }}>3</div>
            <h3 className="h3-card mb-4">Retail & Showrooms</h3>
            <p className="body-text mb-6">Fashion, jewellery, electronics, supermarkets, outlets, brand experience centres.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="chip">Outlets</span><span className="chip">Experience Centres</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '48px', position: 'relative' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#1a1a18', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '24px' }}>4</div>
            <h3 className="h3-card mb-4">Healthcare & Education</h3>
            <p className="body-text mb-6">Hospitals, clinics, IVF centres, diagnostic labs; universities, colleges, training centres, classrooms, computer labs.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="chip">Hospitals</span><span className="chip">Universities</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-spacing reveal">
        <div style={{ backgroundColor: 'var(--section-surface)', borderRadius: 'var(--radius-lg)', padding: '64px' }}>
          <h2 className="h2-section mb-8">Turnkey execution</h2>
          <div className="flex flex-wrap gap-2">
            <span className="chip" style={{ backgroundColor: '#fff' }}>Planning</span>
            <span className="chip" style={{ backgroundColor: '#fff' }}>Design</span>
            <span className="chip" style={{ backgroundColor: '#fff' }}>3D visualisation</span>
            <span className="chip" style={{ backgroundColor: '#fff' }}>Budgeting</span>
            <span className="chip" style={{ backgroundColor: '#fff' }}>Material procurement</span>
            <span className="chip" style={{ backgroundColor: '#fff' }}>Civil work</span>
            <span className="chip" style={{ backgroundColor: '#fff' }}>Electrical</span>
            <span className="chip" style={{ backgroundColor: '#fff' }}>Plumbing</span>
            <span className="chip" style={{ backgroundColor: '#fff' }}>HVAC</span>
            <span className="chip" style={{ backgroundColor: '#fff' }}>Painting</span>
            <span className="chip" style={{ backgroundColor: '#fff' }}>Furniture</span>
            <span className="chip" style={{ backgroundColor: '#fff' }}>Lighting</span>
            <span className="chip" style={{ backgroundColor: '#fff' }}>Quality checks</span>
            <span className="chip" style={{ backgroundColor: '#fff' }}>Cleaning</span>
            <span className="chip" style={{ backgroundColor: '#1a1a18', color: '#fff' }}>Final handover</span>
          </div>
        </div>
      </section>

      <section className="container section-spacing reveal">
        <div className="grid-3">
          <div>
            <div style={{ height: '340px', marginBottom: '24px' }}>
              <img src="/images/IMG_2705.JPG" alt="Fit-Out Solutions" className="img-rounded" style={{ height: '100%' }} />
            </div>
            <h3 className="h3-card mb-4">Fit-Out Solutions</h3>
            <p className="body-text">False ceiling, flooring, partitions, woodwork, furniture, glass, lighting, signage, reception, washrooms, cabins, conference, storage, pantry.</p>
          </div>
          <div>
            <div style={{ height: '340px', marginBottom: '24px' }}>
              <img src="/images/IMG_2702.JPG" alt="MEP Services" className="img-rounded" style={{ height: '100%' }} />
            </div>
            <h3 className="h3-card mb-4">MEP Services</h3>
            <p className="body-text">Mechanical, electrical, plumbing, HVAC, fire fighting, ventilation, drainage, panels, cable management, energy efficiency.</p>
          </div>
          <div>
            <div style={{ height: '340px', marginBottom: '24px' }}>
              <img src="/images/IMG_2696.JPG" alt="Painting & Exteriors" className="img-rounded" style={{ height: '100%' }} />
            </div>
            <h3 className="h3-card mb-4">Painting & Exteriors</h3>
            <p className="body-text">Interior/commercial/exterior painting, texture and premium finishes, protective and weather-resistant coatings, industrial systems, facades, elevation, ACP and stone cladding, waterproofing.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
