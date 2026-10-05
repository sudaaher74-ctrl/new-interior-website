import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Photo from '../components/Photo';
import { SERVICE_CATEGORIES, TURNKEY_SCOPE, CAPABILITIES } from '../data/services';

const Services = () => {
  useScrollReveal();
  useDocumentTitle(
    'Services',
    'Commercial interiors, restaurants, retail and showrooms, healthcare and education — plus turnkey fit-out, MEP services and painting and exteriors.'
  );

  return (
    <main>
      <section className="container mt-8 mb-8 reveal-stagger">
        <div className="eyebrow mb-4">Services</div>
        <h1 className="h1-page mb-12">Everything a commercial space needs, from one contract</h1>

        <div className="grid-2">
          {SERVICE_CATEGORIES.map((service) => (
            <div key={service.n} id={service.slug} className="surface-card flex-col gap-4">
              <div className="num-circle num-circle-md">{service.n}</div>
              <h3 className="h3-card">{service.title}</h3>
              <p className="body-text">{service.copy}</p>
              <div className="flex gap-2 flex-wrap">
                {service.chips.map((chip) => (
                  <span key={chip} className="chip">{chip}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container section-spacing reveal-stagger">
        <div className="surface-block">
          <h2 className="h2-section mb-8">Turnkey execution</h2>
          <div className="flex flex-wrap gap-2">
            {TURNKEY_SCOPE.map((stage, i) => (
              <span key={stage} className={i === TURNKEY_SCOPE.length - 1 ? 'chip chip-dark' : 'chip chip-light'}>
                {stage}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container section-spacing reveal-stagger">
        <div className="grid-3">
          {CAPABILITIES.map((cap) => (
            <div key={cap.title} id={cap.slug} className="flex-col gap-4">
              <Photo src={cap.img} alt={cap.title} ratio="4 / 3" className="img-rounded" />
              <h3 style={{ fontSize: '26px' }} className="h3-card">{cap.title}</h3>
              <p className="body-text">{cap.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Services;
