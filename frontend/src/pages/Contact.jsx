import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Contact = () => {
  useScrollReveal();

  return (
    <main>
      <section className="container mt-8 mb-12 reveal">
        <div className="grid-2">
          <div>
            <div className="eyebrow mb-4">CONTACT</div>
            <h1 className="h1-page mb-6">Request a quote</h1>
            <p className="body-large mb-12">
              Tell us the sector, the site and roughly what you need. We reply with next steps — usually a site visit — within one working day.
            </p>
            
            <div className="flex flex-col gap-6">
              <div>
                <div className="eyebrow mb-1">Phone</div>
                <a href="tel:+918767067884" className="body-large" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>+91 8767067884</a>
              </div>
              <div>
                <div className="eyebrow mb-1">Email</div>
                <a href="mailto:info@osinteriors.in" className="body-large" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>info@osinteriors.in</a>
              </div>
              <div>
                <div className="eyebrow mb-1">Office address</div>
                <p className="body-large" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Mumbai, India</p>
              </div>
              <div>
                <div className="eyebrow mb-1">Hours</div>
                <p className="body-large" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Mon–Sat, 10:00–19:00</p>
              </div>
            </div>
          </div>

          <div>
            <div style={{ backgroundColor: '#fff', padding: '48px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>Full name</label>
                  <input type="text" style={{ width: '100%', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-family)', fontSize: '16px' }} />
                </div>
                
                <div className="grid-2" style={{ gap: '24px' }}>
                  <div>
                    <label className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>Phone</label>
                    <input type="tel" style={{ width: '100%', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-family)', fontSize: '16px' }} />
                  </div>
                  <div>
                    <label className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>Email</label>
                    <input type="email" style={{ width: '100%', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-family)', fontSize: '16px' }} />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '24px' }}>
                  <div>
                    <label className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>Project type</label>
                    <select style={{ width: '100%', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-family)', fontSize: '16px', backgroundColor: '#fff' }}>
                      <option>Restaurant / Café / Bar</option>
                      <option>Office / Corporate</option>
                      <option>Retail / Showroom</option>
                      <option>Healthcare</option>
                      <option>Educational</option>
                      <option>Hospitality</option>
                      <option>Residential luxury</option>
                      <option>Exterior / Facade</option>
                    </select>
                  </div>
                  <div>
                    <label className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>Approx. area (sq ft)</label>
                    <input type="text" style={{ width: '100%', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-family)', fontSize: '16px' }} />
                  </div>
                </div>
                
                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>City</label>
                  <input type="text" style={{ width: '100%', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-family)', fontSize: '16px' }} />
                </div>

                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>Message</label>
                  <textarea rows="4" style={{ width: '100%', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-family)', fontSize: '16px', resize: 'vertical' }}></textarea>
                </div>

                <div className="flex items-center gap-6 mt-4">
                  <button type="submit" className="pill-btn-black">Send request</button>
                  <span className="body-text" style={{ fontSize: '14px', color: 'var(--text-meta)' }}>We never share your details.</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
