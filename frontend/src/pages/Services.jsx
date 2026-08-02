import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { SERVICE_CATEGORIES, TURNKEY_SCOPE, CAPABILITIES } from '../data/services';

const Services = () => {
  useScrollReveal();

  return (
    <main>
      <section className="container mt-8 mb-8 reveal">
        <div className="eyebrow mb-4">Services</div>
        <h1 className="h1-page mb-12">Everything a commercial space needs, from one contract</h1>

        <div className="grid-2">
          {SERVICE_CATEGORIES.map((service) => (
            <div key={service.n} className="surface-card flex-col gap-4">
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

      <section className="container section-spacing reveal">
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

      <section className="container section-spacing reveal">
        <div className="grid-3">
          {CAPABILITIES.map((cap) => (
            <div key={cap.title} className="flex-col gap-4">
              <div style={{ height: '360px' }}>
                <img src={cap.img} alt={cap.title} className="img-rounded" style={{ height: '100%' }} />
              </div>
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
