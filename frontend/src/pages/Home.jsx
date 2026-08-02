import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

const SECTORS = ['Restaurants', 'Corporate offices', 'Retail', 'Healthcare', 'Education', 'Hospitality'];

const CLIENTS =
  'Bombay Barbeque, Copper Chimney, The Irish House, Indira IVF, D Y Patil University, ' +
  'Kokilaben Ambani Hospital, Urban Burger, St Regis Mumbai, Nirlon, Pearl Academy, Lite Bite Foods.';

const STATS = [
  { value: '2014', label: 'operating since' },
  { value: '10+', label: 'years' },
  { value: '10', label: 'sectors served' },
  { value: '1', label: 'contract covers design, MEP, fit-out and handover' },
];

const SERVICES = [
  { n: '01', title: 'Restaurant Interiors', copy: 'Fine dining, cafés, bars, QSR, cloud kitchens.', img: '/images/caffe.jpeg' },
  { n: '02', title: 'Office & Corporate', copy: 'HQs, startup floors, co-working, cabins, conference.', img: '/images/BelapurC2.jpeg' },
  { n: '03', title: 'Turnkey Fit-Out', copy: 'Ceilings, flooring, partitions, joinery, glass, lighting, signage.', img: '/images/IMG_2705.JPG' },
  { n: '04', title: 'Exteriors & Facades', copy: 'Elevation, ACP and stone cladding, waterproofing, coatings.', img: '/images/IMG_2696.JPG' },
];

const STEPS = [
  { n: '01', title: 'Requirement & site visit' },
  { n: '02', title: 'Concept & space plan' },
  { n: '03', title: '3D, materials & costing' },
  { n: '04', title: 'Execution & handover' },
];

const TESTIMONIALS = [
  {
    quote:
      'They handled design, civil and MEP themselves, so we never had to chase three vendors. The restaurant opened on the date we planned.',
    role: 'Restaurant owner',
    context: 'fine dining',
  },
  {
    quote:
      'The 3D visualisation matched the finished floor almost exactly. Costing stayed where it started — no surprises at the end.',
    role: 'Facilities head',
    context: 'corporate fit-out',
  },
  {
    quote:
      'Finish quality is what we keep coming back for. The same project manager stayed with us from first drawing to handover.',
    role: 'Developer',
    context: 'commercial building',
  },
];

const FAQS = [
  {
    q: 'Do you handle civil and MEP or only design?',
    a: 'We are a turnkey contractor. Design, civil, mechanical, electrical, plumbing, HVAC and all finishing work are handled by our own team.',
  },
  {
    q: 'How long does a project take?',
    a: 'It depends on the scale and scope of the site. We commit to a dated programme after the site visit and space plan, and report progress against it weekly.',
  },
  {
    q: 'Will I get a 3D view first?',
    a: 'Yes. We provide 3D visualisations and material boards before execution begins, so you know what the finished space will look like.',
  },
  {
    q: 'Do you work on exteriors?',
    a: 'Yes. We handle exterior painting, facade elevation, ACP and stone cladding, waterproofing and protective coatings for commercial buildings.',
  },
  {
    q: 'How is pricing decided?',
    a: 'Pricing follows a detailed Bill of Quantities prepared after space planning and material selection, so the cost is agreed before execution starts.',
  },
];

const MOSAIC_CAPTION = { position: 'absolute', bottom: '16px', left: '16px', color: '#fff', fontWeight: 600 };

const Home = () => {
  useScrollReveal();

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="container mt-4 mb-8">
        <div className="hero reveal">
          <img className="hero-img" src="/images/bombayB1.jpeg" alt="Commercial restaurant interior by OS Interiors" />
          <div className="scrim-left" style={{ position: 'absolute', inset: 0 }}></div>

          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow">
              COMMERCIAL INTERIORS · EXTERIORS · TURNKEY SINCE 2014
            </div>
            <h1 className="h1-hero" style={{ color: '#fff', marginBottom: '24px' }}>
              Designing Spaces That Perform &amp; Endure
            </h1>
            <p className="body-large" style={{ color: '#e6e4e0' }}>
              Design, engineering and execution under one roof — restaurants, offices, retail, healthcare and
              hospitality, handed over ready to trade.
            </p>
          </div>

          <div className="hero-tabs">
            <Link to="/contact" className="pill-btn-black">Request a Quote</Link>
            <Link to="/portfolio" className="pill-btn-white">See our work</Link>
          </div>
        </div>
      </section>

      {/* ── About + stats ────────────────────────────────── */}
      <section className="container section-spacing">
        <div className="grid-2 gap-8">
          <div className="reveal">
            <h2 className="h2-section mb-4">About OS Interiors</h2>
            <p className="body-text mb-4">
              We are a premium commercial interior and exterior contractor based in India, operating since 2014.
            </p>
            <p className="body-text mb-4">
              We provide turnkey solutions — from concept through civil, MEP, finishing and furniture to handover.
              You deal with one accountable team, not five disconnected contractors.
            </p>
            <div className="mb-8">
              <Link to="/about" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                More about the company →
              </Link>
            </div>

            <div className="flex gap-2 flex-wrap mb-8">
              {SECTORS.map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>

            <div>
              <div className="eyebrow mb-4">TRUSTED BY</div>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--text-primary)' }}>{CLIENTS}</p>
            </div>
          </div>

          <div className="grid-2 reveal">
            {STATS.map((stat) => (
              <div key={stat.value + stat.label}>
                <div style={{ fontSize: '54px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {stat.value}
                </div>
                <p className="body-text mt-4">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────── */}
      <section className="container section-spacing">
        <div className="flex justify-between items-center gap-6 flex-wrap mb-8 reveal">
          <h2 className="h2-section">Services we provide</h2>
          <Link to="/services" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>All services →</Link>
        </div>

        <div className="grid-4">
          {SERVICES.map((s) => (
            <div key={s.n} className="reveal">
              <div className="tile" style={{ height: '272px', marginBottom: '24px' }}>
                <img src={s.img} alt={s.title} loading="lazy" />
                <div className="chip" style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: '#fff' }}>
                  {s.n}
                </div>
              </div>
              <h3 className="h4-card mb-2">{s.title}</h3>
              <p className="body-text">{s.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Portfolio mosaic ─────────────────────────────── */}
      <section className="container section-spacing">
        <div className="mosaic">
          <div className="reveal">
            <h2 className="h2-section mb-4">Our portfolio of commercial work</h2>
            <p className="body-text mb-8">
              Trading spaces we designed, engineered and built — across dining, workplace, retail and care.
            </p>
            <Link to="/portfolio/netwin-ventures" className="tile" style={{ display: 'block', height: '326px' }}>
              <img src="/images/BelapurC3.jpeg" alt="NETWIN Ventures, CBD Belapur" loading="lazy" />
              <div className="tile-scrim"></div>
              <div style={MOSAIC_CAPTION}>NETWIN Ventures · CBD Belapur</div>
            </Link>
          </div>

          <div className="flex-col gap-6 reveal">
            <Link to="/portfolio/bombay-barbeque" className="tile" style={{ display: 'block', height: '334px' }}>
              <img src="/images/bombayB2.jpeg" alt="Bombay Barbeque, Malad" loading="lazy" />
              <div className="tile-scrim"></div>
              <div style={MOSAIC_CAPTION}>Bombay Barbeque · Malad</div>
            </Link>
            <Link to="/portfolio/99-wok-street" className="tile" style={{ display: 'block', height: '284px' }}>
              <img src="/images/Kandivali!.jpeg" alt="99 Wok Street, Kandivali" loading="lazy" />
              <div className="tile-scrim"></div>
              <div style={MOSAIC_CAPTION}>99 Wok Street · Kandivali</div>
            </Link>
          </div>

          <div className="reveal flex-col items-center">
            <Link
              to="/portfolio/exterior-facade-work"
              className="tile w-full"
              style={{ display: 'block', height: '524px', marginBottom: '24px' }}
            >
              <img src="/images/IMG_2695.JPG" alt="Commercial facade, Mumbai" loading="lazy" />
              <div className="tile-scrim"></div>
              <div style={MOSAIC_CAPTION}>Commercial Facade · Mumbai</div>
            </Link>
            <Link to="/portfolio" className="chip-outline">See more projects</Link>
          </div>
        </div>
      </section>

      {/* ── Process teaser ───────────────────────────────── */}
      <section className="container section-spacing">
        <div className="surface-block reveal">
          <div className="flex justify-between items-center gap-6 flex-wrap mb-12">
            <h2 className="h2-section">How we work</h2>
            <Link to="/process" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Full process →</Link>
          </div>

          <div className="grid-4">
            {STEPS.map((step) => (
              <div key={step.n}>
                <div className="num-circle num-circle-lg" style={{ marginBottom: '24px' }}>{step.n}</div>
                <h3 className="h4-card">{step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="container section-spacing">
        <div className="grid-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.role} className="card-shadow reveal">
              <blockquote className="body-text mb-8" style={{ fontSize: '17px' }}>
                “{t.quote}”
              </blockquote>
              <figcaption className="flex items-center gap-4">
                <div style={{ width: '44px', height: '44px', backgroundColor: 'var(--chip-fill)', borderRadius: '50%', flexShrink: 0 }}></div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.role}</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-meta)' }}>{t.context}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="container section-spacing">
        <div className="grid-2 items-start reveal">
          <h2 className="h2-section">Frequently asked</h2>
          <div>
            {FAQS.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>
                  {item.q}
                  <span className="faq-sign" aria-hidden="true">+</span>
                </summary>
                <p className="body-text">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
