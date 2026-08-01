import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Home = () => {
  useScrollReveal();

  return (
    <main>
      <section className="container mt-4 mb-8">
        <div 
          className="reveal img-rounded-lg" 
          style={{
            position: 'relative',
            height: '640px',
            overflow: 'hidden'
          }}
        >
          <img 
            src="/images/bombayB1.jpeg" 
            alt="Hero commercial interior" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="scrim-left" style={{ position: 'absolute', inset: 0 }}></div>
          
          <div style={{ position: 'absolute', top: '48px', left: '48px', maxWidth: '640px' }}>
            <div className="eyebrow reveal" style={{ 
              color: '#fff', 
              border: '1px solid rgba(255,255,255,0.4)',
              padding: '6px 12px',
              borderRadius: '999px',
              display: 'inline-block',
              marginBottom: '24px'
            }}>
              COMMERCIAL INTERIORS · EXTERIORS · TURNKEY SINCE 2014
            </div>
            <h1 className="h1-hero reveal" style={{ color: '#fff', marginBottom: '24px' }}>
              Designing Spaces That Perform & Endure
            </h1>
            <p className="body-large reveal" style={{ color: '#e6e4e0' }}>
              Design, engineering and execution under one roof — restaurants, offices, retail, healthcare and hospitality, handed over ready to trade.
            </p>
          </div>

          <div className="reveal" style={{ position: 'absolute', bottom: '0', left: '48px', display: 'flex', gap: '8px' }}>
            <Link to="/contact" className="pill-btn-black" style={{ borderRadius: '24px 24px 0 0', padding: '16px 32px' }}>
              Request a Quote
            </Link>
            <Link to="/portfolio" className="pill-btn-white" style={{ borderRadius: '24px 24px 0 0', padding: '16px 32px' }}>
              See our work
            </Link>
          </div>
        </div>
      </section>

      <section className="container section-spacing">
        <div className="grid-2 gap-8">
          <div className="reveal">
            <h2 className="h2-section mb-4">About OS Interiors</h2>
            <p className="body-text mb-4">
              We are a premium commercial interior and exterior contractor based in India, operating since 2014.
            </p>
            <p className="body-text mb-4">
              We provide turnkey solutions — from concept through civil, MEP, finishing and furniture to handover. You deal with one accountable team, not five disconnected contractors.
            </p>
            <div className="mb-8">
              <Link to="/about" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>More about the company →</Link>
            </div>
            
            <div className="flex gap-2 mb-8" style={{ flexWrap: 'wrap' }}>
              <span className="chip">Restaurants</span>
              <span className="chip">Corporate offices</span>
              <span className="chip">Retail</span>
              <span className="chip">Healthcare</span>
              <span className="chip">Education</span>
              <span className="chip">Hospitality</span>
            </div>

            <div>
              <div className="eyebrow mb-4">TRUSTED BY</div>
              <p className="body-text" style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
                Bombay Barbeque, Copper Chimney, The Irish House, Indira IVF, D Y Patil University, Kokilaben Ambani Hospital, Urban Burger, St Regis Mumbai, Nirlon, Pearl Academy, Lite Bite Foods.
              </p>
            </div>
          </div>

          <div className="grid-2 reveal">
            <div>
              <div style={{ fontSize: '54px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>2014</div>
              <p className="body-text mt-4">operating since</p>
            </div>
            <div>
              <div style={{ fontSize: '54px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>10+</div>
              <p className="body-text mt-4">years</p>
            </div>
            <div>
              <div style={{ fontSize: '54px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>10</div>
              <p className="body-text mt-4">sectors served</p>
            </div>
            <div>
              <div style={{ fontSize: '54px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>1</div>
              <p className="body-text mt-4">contract covers design, MEP, fit-out and handover</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-spacing">
        <div className="flex justify-between items-center mb-8 reveal">
          <h2 className="h2-section">Services we provide</h2>
          <Link to="/services" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>All services →</Link>
        </div>

        <div className="grid-4">
          <div className="reveal">
            <div style={{ position: 'relative', height: '272px', marginBottom: '24px' }}>
              <img src="/images/caffe.jpeg" alt="Restaurant Interiors" className="img-rounded" style={{ height: '100%' }} />
              <div className="chip" style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: '#fff' }}>01</div>
            </div>
            <h3 className="h4-card mb-4">Restaurant Interiors</h3>
            <p className="body-text">fine dining, cafés, bars, QSR, cloud kitchens.</p>
          </div>
          
          <div className="reveal">
            <div style={{ position: 'relative', height: '272px', marginBottom: '24px' }}>
              <img src="/images/BelapurC2.jpeg" alt="Office & Corporate" className="img-rounded" style={{ height: '100%' }} />
              <div className="chip" style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: '#fff' }}>02</div>
            </div>
            <h3 className="h4-card mb-4">Office & Corporate</h3>
            <p className="body-text">HQs, startup floors, co-working, cabins, conference.</p>
          </div>

          <div className="reveal">
            <div style={{ position: 'relative', height: '272px', marginBottom: '24px' }}>
              <img src="/images/IMG_2705.JPG" alt="Turnkey Fit-Out" className="img-rounded" style={{ height: '100%' }} />
              <div className="chip" style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: '#fff' }}>03</div>
            </div>
            <h3 className="h4-card mb-4">Turnkey Fit-Out</h3>
            <p className="body-text">ceilings, flooring, partitions, joinery, glass, lighting, signage.</p>
          </div>

          <div className="reveal">
            <div style={{ position: 'relative', height: '272px', marginBottom: '24px' }}>
              <img src="/images/IMG_2696.JPG" alt="Exteriors & Facades" className="img-rounded" style={{ height: '100%' }} />
              <div className="chip" style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: '#fff' }}>04</div>
            </div>
            <h3 className="h4-card mb-4">Exteriors & Facades</h3>
            <p className="body-text">elevation, ACP and stone cladding, waterproofing, coatings.</p>
          </div>
        </div>
      </section>

      <section className="container section-spacing">
        <div style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.35fr 1.05fr', gap: '24px' }}>
          
          <div className="reveal">
            <h2 className="h2-section mb-4">Our portfolio of commercial work</h2>
            <p className="body-text mb-8">Trading spaces we designed, engineered and built — across dining, workplace, retail and care.</p>
            <div style={{ position: 'relative', height: '326px' }}>
              <img src="/images/BelapurC3.jpeg" alt="NETWIN Ventures" className="img-rounded" style={{ height: '100%' }} />
              <div className="scrim-bottom" style={{ position: 'absolute', inset: 0, borderRadius: '16px' }}></div>
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#fff', fontWeight: 600 }}>NETWIN Ventures · CBD Belapur</div>
            </div>
          </div>

          <div className="flex-col gap-6 reveal">
            <div style={{ position: 'relative', height: '334px' }}>
              <img src="/images/bombayB2.jpeg" alt="Bombay Barbeque" className="img-rounded" style={{ height: '100%' }} />
              <div className="scrim-bottom" style={{ position: 'absolute', inset: 0, borderRadius: '16px' }}></div>
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#fff', fontWeight: 600 }}>Bombay Barbeque · Malad</div>
            </div>
            <div style={{ position: 'relative', height: '284px' }}>
              <img src="/images/juice1.jpeg" alt="99 Wok Street" className="img-rounded" style={{ height: '100%' }} />
              <div className="scrim-bottom" style={{ position: 'absolute', inset: 0, borderRadius: '16px' }}></div>
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#fff', fontWeight: 600 }}>99 Wok Street · Kandivali</div>
            </div>
          </div>

          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', height: '524px', width: '100%', marginBottom: '24px' }}>
              <img src="/images/IMG_2695.JPG" alt="Commercial Facade" className="img-rounded" style={{ height: '100%' }} />
              <div className="scrim-bottom" style={{ position: 'absolute', inset: 0, borderRadius: '16px' }}></div>
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#fff', fontWeight: 600 }}>Commercial Facade · Mumbai</div>
            </div>
            <Link to="/portfolio" className="chip-outline">See more projects</Link>
          </div>
          
        </div>
      </section>

      <section className="container section-spacing">
        <div className="reveal" style={{ backgroundColor: 'var(--section-surface)', borderRadius: 'var(--radius-lg)', padding: '76px' }}>
          <div className="flex justify-between items-center mb-12">
            <h2 className="h2-section">How we work</h2>
            <Link to="/process" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Full process →</Link>
          </div>
          
          <div className="grid-4">
            <div>
              <div style={{ width: '52px', height: '52px', backgroundColor: '#1a1a18', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '24px' }}>01</div>
              <h3 className="h4-card mb-2">Requirement & site visit</h3>
            </div>
            <div>
              <div style={{ width: '52px', height: '52px', backgroundColor: '#1a1a18', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '24px' }}>02</div>
              <h3 className="h4-card mb-2">Concept & space plan</h3>
            </div>
            <div>
              <div style={{ width: '52px', height: '52px', backgroundColor: '#1a1a18', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '24px' }}>03</div>
              <h3 className="h4-card mb-2">3D, materials & costing</h3>
            </div>
            <div>
              <div style={{ width: '52px', height: '52px', backgroundColor: '#1a1a18', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '24px' }}>04</div>
              <h3 className="h4-card mb-2">Execution & handover</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-spacing">
        <div className="grid-3">
          <div className="reveal" style={{ backgroundColor: '#fff', borderRadius: 'var(--radius-lg)', padding: '40px', boxShadow: 'var(--shadow-sm)' }}>
            <p className="body-text mb-8" style={{ fontSize: '17px' }}>
              "They handled design, civil and MEP themselves, so we never had to chase three vendors. The restaurant opened on the date we planned."
            </p>
            <div className="flex items-center gap-4">
              <div style={{ width: '44px', height: '44px', backgroundColor: 'var(--chip-fill)', borderRadius: '50%' }}></div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Restaurant owner</div>
                <div className="eyebrow" style={{ letterSpacing: 0 }}>fine dining</div>
              </div>
            </div>
          </div>
          
          <div className="reveal" style={{ backgroundColor: '#fff', borderRadius: 'var(--radius-lg)', padding: '40px', boxShadow: 'var(--shadow-sm)' }}>
            <p className="body-text mb-8" style={{ fontSize: '17px' }}>
              "The 3D visualisation matched the finished floor almost exactly. Costing stayed where it started — no surprises at the end."
            </p>
            <div className="flex items-center gap-4">
              <div style={{ width: '44px', height: '44px', backgroundColor: 'var(--chip-fill)', borderRadius: '50%' }}></div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Facilities head</div>
                <div className="eyebrow" style={{ letterSpacing: 0 }}>corporate fit-out</div>
              </div>
            </div>
          </div>

          <div className="reveal" style={{ backgroundColor: '#fff', borderRadius: 'var(--radius-lg)', padding: '40px', boxShadow: 'var(--shadow-sm)' }}>
            <p className="body-text mb-8" style={{ fontSize: '17px' }}>
              "Finish quality is what we keep coming back for. Three sites completed with the same project manager throughout."
            </p>
            <div className="flex items-center gap-4">
              <div style={{ width: '44px', height: '44px', backgroundColor: 'var(--chip-fill)', borderRadius: '50%' }}></div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Developer</div>
                <div className="eyebrow" style={{ letterSpacing: 0 }}>commercial building</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-spacing">
        <div className="grid-2 reveal">
          <div>
            <h2 className="h2-section">Frequently asked</h2>
          </div>
          <div>
            <details style={{ borderBottom: '1px solid var(--border-color)', padding: '24px 0' }}>
              <summary style={{ fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
                Do you handle civil and MEP or only design? <span>+</span>
              </summary>
              <p className="body-text mt-4">We are a turnkey contractor. We handle design, civil, mechanical, electrical, plumbing, HVAC, and all finishing work internally.</p>
            </details>
            <details style={{ borderBottom: '1px solid var(--border-color)', padding: '24px 0' }}>
              <summary style={{ fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
                How long does a project take? <span>+</span>
              </summary>
              <p className="body-text mt-4">Timelines depend on scale and scope. A standard 2,000 sq ft restaurant or office typically takes 45 to 60 days from approval to handover.</p>
            </details>
            <details style={{ borderBottom: '1px solid var(--border-color)', padding: '24px 0' }}>
              <summary style={{ fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
                Will I get a 3D view first? <span>+</span>
              </summary>
              <p className="body-text mt-4">Yes. We provide 3D visualisations and material boards before any execution begins so you know exactly what the finished space will look like.</p>
            </details>
            <details style={{ borderBottom: '1px solid var(--border-color)', padding: '24px 0' }}>
              <summary style={{ fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
                Do you work on exteriors? <span>+</span>
              </summary>
              <p className="body-text mt-4">Yes, we handle exterior painting, facade elevation, ACP and stone cladding, waterproofing, and structural finishing for commercial buildings.</p>
            </details>
            <details style={{ borderBottom: '1px solid var(--border-color)', padding: '24px 0' }}>
              <summary style={{ fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
                How is pricing decided? <span>+</span>
              </summary>
              <p className="body-text mt-4">Pricing is based on a detailed Bill of Quantities (BOQ) generated after space planning and material selection. This ensures complete transparency before execution.</p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
