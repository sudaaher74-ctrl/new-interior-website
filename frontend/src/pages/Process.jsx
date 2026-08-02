import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Process = () => {
  useScrollReveal();

  const steps = [
    { num: '01', title: 'Requirement discussion', desc: 'Understanding your vision, operational needs and constraints.', color: '#1a1a18' },
    { num: '02', title: 'Site visit', desc: 'Detailed survey, measurements and technical evaluation of the space.', color: '#1a1a18' },
    { num: '03', title: 'Concept design', desc: 'Initial mood boards, spatial concepts and aesthetic direction.', color: '#1a1a18' },
    { num: '04', title: 'Space planning', desc: 'Optimising flow for seating, workstations, or equipment.', color: '#1a1a18' },
    { num: '05', title: '3D visualisation', desc: 'Photorealistic renders so you see the exact final result.', color: '#1a1a18' },
    { num: '06', title: 'Material selection', desc: 'Choosing finishes, flooring, lighting and fabrics.', color: '#1a1a18' },
    { num: '07', title: 'Cost estimation', desc: 'Transparent Bill of Quantities (BOQ) with no hidden surprises.', color: '#4a4a46' },
    { num: '08', title: 'Project planning', desc: 'Gantt charts, resource allocation and hard deadlines.', color: '#4a4a46' },
    { num: '09', title: 'Execution', desc: 'Civil, MEP and finishing work managed by one site supervisor.', color: '#4a4a46' },
    { num: '10', title: 'Quality inspection', desc: 'Rigorous checks against our internal standard operating procedures.', color: '#4a4a46' },
    { num: '11', title: 'Final delivery', desc: 'Handover of a clean, fully functional space ready for business.', color: '#4a4a46' },
  ];

  return (
    <main>
      <section className="container mt-8 mb-12 reveal">
        <div className="eyebrow mb-4">PROCESS</div>
        <h1 className="h1-page mb-12">Eleven steps from first call to final delivery</h1>
        
        <div className="grid-2">
          {/* Left Column (01-06) */}
          <div>
            {steps.slice(0, 6).map((step) => (
              <div key={step.num} className="flex gap-6 py-6" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: step.color, color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                  {step.num}
                </div>
                <div>
                  <h4 className="h4-card mb-2" style={{ fontSize: '19px' }}>{step.title}</h4>
                  <p className="body-text" style={{ fontSize: '15px' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Right Column (07-11) */}
          <div className="flex flex-col justify-between">
            <div>
              {steps.slice(6, 11).map((step) => (
                <div key={step.num} className="flex gap-6 py-6" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: step.color, color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    {step.num}
                  </div>
                  <div>
                    <h4 className="h4-card mb-2" style={{ fontSize: '19px' }}>{step.title}</h4>
                    <p className="body-text" style={{ fontSize: '15px' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ backgroundColor: 'var(--section-surface)', borderRadius: 'var(--radius-lg)', padding: '40px', marginTop: '48px' }}>
              <h3 className="h3-card mb-4">Ready to start?</h3>
              <p className="body-text mb-6">Reach out to discuss your upcoming project requirements.</p>
              <Link to="/contact" className="pill-btn-black">Request a Quote</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Process;
