import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

const ProjectDetail = () => {
  useScrollReveal();
  // Using static data matching the prompt for Bombay Barbeque
  // In a real app, we'd fetch based on useParams().id

  return (
    <main>
      <section className="container mt-8 mb-8 reveal">
        <Link to="/portfolio" style={{ fontWeight: 600, color: 'var(--text-meta)', marginBottom: '32px', display: 'inline-block' }}>
          ← Back to portfolio
        </Link>

        <div style={{ position: 'relative', height: '600px', marginBottom: '64px' }}>
          <img src="/images/bombayB1.jpeg" alt="Bombay Barbeque Hero" className="img-rounded-lg" style={{ height: '100%' }} />
        </div>

        <div className="grid-2 mb-12">
          <div>
            <h1 className="h1-page mb-6">Bombay Barbeque, Malad</h1>
            <p className="body-large mb-4">
              A turnkey full-service restaurant project where operational efficiency was as critical as aesthetic impact. Covers and kitchen flow were planned first to maximise throughput without compromising the dining experience.
            </p>
            <p className="body-large">
              We integrated warm lighting, natural stone, wood and custom joinery into a cohesive environment. Civil, electrical, plumbing, HVAC, fire fighting, acoustics, furniture and signage were all executed under one contract, with a dedicated project manager reporting weekly to the client.
            </p>
          </div>
          
          <div style={{ backgroundColor: 'var(--section-surface)', borderRadius: 'var(--radius-lg)', padding: '48px' }}>
            <div className="flex justify-between mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <span className="eyebrow" style={{ color: 'var(--text-primary)' }}>Sector</span>
              <span className="body-text" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Restaurant</span>
            </div>
            <div className="flex justify-between mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <span className="eyebrow" style={{ color: 'var(--text-primary)' }}>Scope</span>
              <span className="body-text" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Turnkey</span>
            </div>
            <div className="flex justify-between mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <span className="eyebrow" style={{ color: 'var(--text-primary)' }}>Location</span>
              <span className="body-text" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Malad, Mumbai</span>
            </div>
            <div className="flex justify-between mb-8 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <span className="eyebrow" style={{ color: 'var(--text-primary)' }}>Status</span>
              <span className="body-text" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Completed</span>
            </div>
            
            <div className="eyebrow mb-4" style={{ color: 'var(--text-primary)' }}>Delivered</div>
            <div className="flex gap-2 flex-wrap">
              <span className="chip" style={{ backgroundColor: '#fff' }}>Civil</span>
              <span className="chip" style={{ backgroundColor: '#fff' }}>MEP</span>
              <span className="chip" style={{ backgroundColor: '#fff' }}>Joinery</span>
              <span className="chip" style={{ backgroundColor: '#fff' }}>Furniture</span>
              <span className="chip" style={{ backgroundColor: '#fff' }}>Lighting</span>
              <span className="chip" style={{ backgroundColor: '#fff' }}>Signage</span>
            </div>
          </div>
        </div>

        <div className="grid-2 mb-8">
          <div style={{ height: '420px' }}>
            <img src="/images/bombayB2.jpeg" alt="Gallery image 1" className="img-rounded" style={{ height: '100%' }} />
          </div>
          <div style={{ height: '420px' }}>
            <img src="/images/IMG_2706.JPG" alt="Gallery image 2" className="img-rounded" style={{ height: '100%' }} />
          </div>
        </div>
        
        <div style={{ height: '520px' }}>
          <img src="/images/IMG_2695.JPG" alt="Gallery image 3" className="img-rounded-lg" style={{ height: '100%' }} />
        </div>
      </section>
    </main>
  );
};

export default ProjectDetail;
