import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { TURNKEY_SCOPE } from '../data/services';

const STEPS = [
  { num: '01', title: 'Requirement discussion', desc: 'Understanding your vision, operational needs and constraints before anything is drawn.' },
  { num: '02', title: 'Site visit', desc: 'Detailed survey, measurements and technical evaluation of the shell, services and landlord constraints.' },
  { num: '03', title: 'Concept design', desc: 'Initial mood boards, spatial concepts and aesthetic direction for the space.' },
  { num: '04', title: 'Space planning', desc: 'Optimising flow for seating, covers, workstations or equipment, including back-of-house and services routes.' },
  { num: '05', title: '3D visualisation', desc: 'Photorealistic renders so you see the exact final result before execution starts.' },
  { num: '06', title: 'Material selection', desc: 'Choosing finishes, flooring, lighting and fabrics against a material board.' },
  { num: '07', title: 'Cost estimation', desc: 'Transparent Bill of Quantities (BOQ) with no hidden surprises. You approve the look and the number together.' },
  { num: '08', title: 'Project planning', desc: 'Gantt charts, resource allocation and hard deadlines agreed before work begins.' },
  { num: '09', title: 'Execution', desc: 'Civil, MEP and finishing work managed by one site supervisor, with weekly progress reporting.' },
  { num: '10', title: 'Quality inspection', desc: 'Rigorous checks against our internal standard operating procedures, with snag closure before handover.' },
  { num: '11', title: 'Final delivery', desc: 'Handover of a clean, fully functional space ready for business.' },
];

const Process = () => {
  useScrollReveal();

  return (
    <main>
      <section className="container mt-8">
        <div className="reveal">
          <div className="eyebrow mb-4">Process</div>
          <h1 className="h1-page mb-12" style={{ maxWidth: '900px' }}>
            From site visit to keys, on one programme
          </h1>
        </div>

        <div className="flex-col gap-6">
          {STEPS.map((step) => (
            <div key={step.num} className="process-row reveal">
              <span className="num-circle num-circle-xl">{step.num}</span>
              <h2 className="h3-card" style={{ fontSize: '30px' }}>{step.title}</h2>
              <p className="body-text">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="surface-block reveal mt-12">
          <h2 className="h2-section mb-8">Included in the programme</h2>
          <div className="flex flex-wrap gap-2">
            {TURNKEY_SCOPE.map((stage, i) => (
              <span key={stage} className={i === TURNKEY_SCOPE.length - 1 ? 'chip chip-dark' : 'chip chip-light'}>
                {stage}
              </span>
            ))}
          </div>
        </div>

        <div className="reveal" style={{ height: '460px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginTop: '48px' }}>
          <img
            src="/images/IMG_2706.JPG"
            alt="Finishing works in progress on an OS Interiors site"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
        </div>

        <div className="surface-block reveal mt-12 flex-col items-start gap-4">
          <h2 className="h2-section">Ready to start?</h2>
          <p className="body-large" style={{ maxWidth: '520px' }}>
            Send the location, area and target opening date. We come back with a scope, a programme and an
            indicative BOQ.
          </p>
          <Link to="/contact" className="btn-primary btn-lg mt-2">Request a quote</Link>
        </div>
      </section>
    </main>
  );
};

export default Process;
