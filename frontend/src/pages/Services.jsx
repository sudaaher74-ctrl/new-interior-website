import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Services = () => {
  useScrollReveal();

  return (
    <main>
      <section className="container mt-8 mb-8 reveal">
        <div className="eyebrow mb-4">Services</div>
        <h1 className="h1-page mb-12">Everything a commercial space needs, from one contract</h1>

        <div className="grid-2">
          <div className="surface-card flex-col gap-4">
            <div className="num-circle num-circle-md">1</div>
            <h3 className="h3-card">Commercial Interior Design</h3>
            <p className="body-text">Offices, HQs, startup offices, co-working, conference rooms, reception, executive cabins, meeting rooms.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="chip">Workplace</span><span className="chip">Cabins</span><span className="chip">Co-working</span>
            </div>
          </div>
          
          <div className="surface-card flex-col gap-4">
            <div className="num-circle num-circle-md">2</div>
            <h3 className="h3-card">Restaurant Interior Design</h3>
            <p className="body-text">Fine dining, cafés, bars, pubs, food courts, cloud kitchens, QSR, theme restaurants.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="chip">Dining</span><span className="chip">Bars</span><span className="chip">QSR</span>
            </div>
          </div>

          <div className="surface-card flex-col gap-4">
            <div className="num-circle num-circle-md">3</div>
            <h3 className="h3-card">Retail & Showrooms</h3>
            <p className="body-text">Fashion, jewellery, electronics, supermarkets, outlets, brand experience centres.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="chip">Outlets</span><span className="chip">Experience Centres</span>
            </div>
          </div>

          <div className="surface-card flex-col gap-4">
            <div className="num-circle num-circle-md">4</div>
            <h3 className="h3-card">Healthcare & Education</h3>
            <p className="body-text">Hospitals, clinics, IVF centres, diagnostic labs; universities, colleges, training centres, classrooms, computer labs.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="chip">Hospitals</span><span className="chip">Universities</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-spacing reveal">
        <div className="surface-block">
          <h2 className="h2-section mb-8">Turnkey execution</h2>
          <div className="flex flex-wrap gap-2">
            <span className="chip chip-light">Planning</span>
            <span className="chip chip-light">Design</span>
            <span className="chip chip-light">3D visualisation</span>
            <span className="chip chip-light">Budgeting</span>
            <span className="chip chip-light">Material procurement</span>
            <span className="chip chip-light">Civil work</span>
            <span className="chip chip-light">Electrical</span>
            <span className="chip chip-light">Plumbing</span>
            <span className="chip chip-light">HVAC</span>
            <span className="chip chip-light">Painting</span>
            <span className="chip chip-light">Furniture</span>
            <span className="chip chip-light">Lighting</span>
            <span className="chip chip-light">Quality checks</span>
            <span className="chip chip-light">Cleaning</span>
            <span className="chip chip-dark">Final handover</span>
          </div>
        </div>
      </section>

      <section className="container section-spacing reveal">
        <div className="grid-3">
          <div className="flex-col gap-4">
            <div style={{ height: '360px' }}>
              <img src="/images/IMG_2705.JPG" alt="Fit-Out Solutions" className="img-rounded" style={{ height: '100%' }} />
            </div>
            <h3 style={{ fontSize: '26px' }} className="h3-card">Fit-out solutions</h3>
            <p className="body-text">False ceiling, flooring, partitions, woodwork, furniture, glass, lighting, signage, reception, washrooms, cabins, conference, storage, pantry.</p>
          </div>
          <div className="flex-col gap-4">
            <div style={{ height: '360px' }}>
              <img src="/images/IMG_2702.JPG" alt="MEP Services" className="img-rounded" style={{ height: '100%' }} />
            </div>
            <h3 style={{ fontSize: '26px' }} className="h3-card">MEP services</h3>
            <p className="body-text">Mechanical, electrical, plumbing, HVAC, fire fighting, ventilation, drainage, panels, cable management, energy efficiency.</p>
          </div>
          <div className="flex-col gap-4">
            <div style={{ height: '360px' }}>
              <img src="/images/IMG_2696.JPG" alt="Painting & Exteriors" className="img-rounded" style={{ height: '100%' }} />
            </div>
            <h3 style={{ fontSize: '26px' }} className="h3-card">Painting &amp; exteriors</h3>
            <p className="body-text">Interior/commercial/exterior painting, texture and premium finishes, protective and weather-resistant coatings, industrial systems, facades, elevation, ACP and stone cladding, waterproofing.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
