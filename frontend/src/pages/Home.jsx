import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { SERVICE_CATEGORIES, CAPABILITIES, TURNKEY_SCOPE, SECTORS } from '../data/services';

const CLIENTS =
  'Bombay Barbeque, Copper Chimney, The Irish House, Indira IVF, D Y Patil University, ' +
  'Kokilaben Ambani Hospital, Urban Burger, St Regis Mumbai, Nirlon, Pearl Academy, Lite Bite Foods.';

const STATS = [
  { value: '2014', label: 'operating since' },
  { value: '10+', label: 'years' },
  { value: '10', label: 'sectors served' },
  { value: '1', label: 'contract covers design, MEP, fit-out and handover' },
];

const category = (title) => SERVICE_CATEGORIES.find((s) => s.title === title);
const capability = (title) => CAPABILITIES.find((c) => c.title === title);

// The four we lead with on the home page — two sectors, two capabilities —
// with home-page imagery layered over the shared copy.
const SERVICES = [
  { n: '01', title: 'Restaurant Interiors', copy: category('Restaurant Interior Design').short, img: '/images/caffe.jpeg' },
  { n: '02', title: 'Office & Corporate', copy: category('Commercial Interior Design').short, img: '/images/BelapurC2.jpeg' },
  { n: '03', title: 'Turnkey Fit-Out', copy: capability('Fit-out solutions').short, img: capability('Fit-out solutions').img },
  { n: '04', title: 'Exteriors & Facades', copy: capability('Painting & exteriors').short, img: capability('Painting & exteriors').img },
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
    tint: 'var(--leaf)',
  },
  {
    quote:
      'The 3D visualisation matched the finished floor almost exactly. Costing stayed where it started — no surprises at the end.',
    role: 'Facilities head',
    context: 'corporate fit-out',
    tint: 'var(--accent-tint)',
  },
  {
    quote:
      'Finish quality is what we keep coming back for. The same project manager stayed with us from first drawing to handover.',
    role: 'Developer',
    context: 'commercial building',
    tint: 'var(--sand)',
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

const Home = () => {
  useScrollReveal();

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="container mt-6">
        <div className="hero reveal">
          <img className="hero-img" src="/images/bombayB1.jpeg" alt="Commercial restaurant interior by OS Interiors" />
          <div className="scrim-left" style={{ position: 'absolute', inset: 0 }}></div>

          <div className="hero-inner">
            <div className="hero-copy">
              <div className="eyebrow hero-eyebrow">
                Commercial interiors · Exteriors · Turnkey since 2014
              </div>
              <h1 className="h1-hero" style={{ color: '#fff' }}>
                Designing spaces that perform &amp; endure
              </h1>
              <p className="body-large" style={{ color: 'var(--chip-fill)', maxWidth: '560px', fontSize: '20px' }}>
                Design, engineering and execution under one roof — restaurants, offices, retail, healthcare and
                hospitality, handed over ready to trade.
              </p>
            </div>

            <div className="hero-actions">
              <Link to="/contact" className="btn-primary btn-lg">Request a quote</Link>
              <Link to="/portfolio" className="btn-on-image">See our work</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="container" style={{ paddingTop: '56px' }}>
        <div className="grid-4 reveal">
          {STATS.map((stat) => (
            <div key={stat.value + stat.label}>
              <div className="stat-figure">{stat.value}</div>
              <p className="body-text mt-2" style={{ fontSize: '16px' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ────────────────────────────────────────── */}
      <section className="container section-spacing">
        <div className="grid-2 gap-8">
          <div className="reveal">
            <h2 className="h2-section mb-4">About OS Interiors</h2>
            <p className="body-large mb-4">
              We are a premium commercial interior and exterior contractor based in India, operating since 2014.
            </p>
            <p className="body-large mb-4">
              We provide turnkey solutions — from concept through civil, MEP, finishing and furniture to handover.
              You deal with one accountable team, not five disconnected contractors.
            </p>
            <div className="mb-8">
              <Link to="/about" className="link-arrow">More about the company →</Link>
            </div>

            <div className="flex gap-2 flex-wrap">
              {SECTORS.map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          </div>

          <div className="surface-block reveal flex-col gap-4" style={{ padding: '44px' }}>
            <div className="eyebrow">Trusted by</div>
            <p style={{ fontSize: '19px', lineHeight: 1.7, color: 'var(--text-primary)' }}>{CLIENTS}</p>
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────── */}
      <section className="container section-spacing">
        <div className="flex justify-between items-end gap-6 flex-wrap mb-8 reveal">
          <h2 className="h2-section">Services we provide</h2>
          <Link to="/services" className="link-arrow">All services →</Link>
        </div>

        <div className="grid-4">
          {SERVICES.map((s) => (
            <div key={s.n} className="reveal">
              <div className="tile" style={{ height: '300px', marginBottom: '16px' }}>
                <img src={s.img} alt={s.title} loading="lazy" />
                <span className="tile-badge">{s.n}</span>
              </div>
              <h3 className="h4-card mb-2" style={{ fontSize: '24px' }}>{s.title}</h3>
              <p className="body-text" style={{ fontSize: '16px' }}>{s.copy}</p>
            </div>
          ))}
        </div>

        <div className="surface-block reveal mt-12">
          <div className="eyebrow mb-4">One contract covers</div>
          <div className="flex flex-wrap gap-2">
            {TURNKEY_SCOPE.map((stage, i) => (
              <span key={stage} className={i === TURNKEY_SCOPE.length - 1 ? 'chip chip-dark' : 'chip chip-light'}>
                {stage}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio mosaic ─────────────────────────────── */}
      <section className="container section-spacing">
        <div className="mosaic">
          <div className="reveal">
            <h2 className="h2-section h2-compact mb-4">Our portfolio of commercial work</h2>
            <p className="body-text mb-8">
              Trading spaces we designed, engineered and built — across dining, workplace, retail and care.
            </p>
            <Link to="/portfolio/netwin-ventures" className="tile" style={{ height: '340px' }}>
              <img src="/images/BelapurC3.jpeg" alt="NETWIN Ventures, CBD Belapur" loading="lazy" />
              <span className="tile-caption">NETWIN Ventures · CBD Belapur</span>
            </Link>
          </div>

          <div className="flex-col gap-6 reveal">
            <Link to="/portfolio/bombay-barbeque" className="tile" style={{ height: '340px' }}>
              <img src="/images/bombayB2.jpeg" alt="Bombay Barbeque, Malad" loading="lazy" />
              <span className="tile-caption">Bombay Barbeque · Malad</span>
            </Link>
            <Link to="/portfolio/99-wok-street" className="tile" style={{ height: '292px' }}>
              <img src="/images/Kandivali!.jpeg" alt="99 Wok Street, Kandivali" loading="lazy" />
              <span className="tile-caption">99 Wok Street · Kandivali</span>
            </Link>
          </div>

          <div className="reveal flex-col items-center gap-6">
            <Link
              to="/portfolio/exterior-facade-work"
              className="tile w-full"
              style={{ height: '552px' }}
            >
              <img src="/images/IMG_2695.JPG" alt="Commercial facade, Mumbai" loading="lazy" />
              <span className="tile-caption">Commercial facade · Mumbai</span>
            </Link>
            <Link to="/portfolio" className="btn-outline">See more projects</Link>
          </div>
        </div>
      </section>

      {/* ── Process teaser ───────────────────────────────── */}
      <section className="container section-spacing">
        <div className="surface-block reveal">
          <div className="flex justify-between items-end gap-6 flex-wrap mb-12">
            <h2 className="h2-section">How we work</h2>
            <Link to="/process" className="link-arrow">Full process →</Link>
          </div>

          <div className="grid-4">
            {STEPS.map((step) => (
              <div key={step.n}>
                <div className="num-circle num-circle-lg mb-6">{step.n}</div>
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
            <figure key={t.role} className="card-shadow reveal flex-col justify-between gap-8">
              <blockquote className="body-large" style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
                “{t.quote}”
              </blockquote>
              <figcaption className="flex items-center gap-4">
                <div style={{ width: '44px', height: '44px', backgroundColor: t.tint, borderRadius: '50%', flexShrink: 0 }}></div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.role}</div>
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
