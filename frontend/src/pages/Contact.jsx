import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Photo from '../components/Photo';
import { PROJECT_TYPES } from '../data/services';

const EMPTY = {
  name: '',
  phone: '',
  email: '',
  projectType: PROJECT_TYPES[0],
  area: '',
  city: '',
  message: '',
  // Honeypot — hidden from people, tempting to bots that autofill everything.
  website: '',
};

const DETAILS = [
  { label: 'Phone', value: '+91 8767067884', href: 'tel:+918767067884' },
  { label: 'Email', value: 'info@osinteriors.in', href: 'mailto:info@osinteriors.in' },
  { label: 'Office address', value: 'Mumbai, India' },
  { label: 'Hours', value: 'Mon–Sat, 10:00–19:00' },
];

const Contact = () => {
  useScrollReveal();
  useDocumentTitle(
    'Request a quote',
    'Tell us the sector, the site and what you need. We reply with next steps — usually a site visit — within one working day.'
  );
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const update = (field) => (e) => {
    const { value } = e.target;
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.phone.trim()) next.phone = 'Please enter a phone number.';
    if (!form.email.trim()) {
      next.email = 'Please enter an email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast.error('Please check the highlighted fields.');
      return;
    }

    setSending(true);
    try {
      // The Lead model stores name/phone/email/projectType/message only, so city
      // and area are appended to the message rather than silently dropped.
      const context = [
        form.city.trim() && `City: ${form.city.trim()}`,
        form.area.trim() && `Approx. area: ${form.area.trim()} sq ft`,
      ].filter(Boolean);

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          projectType: form.projectType,
          message: [form.message.trim(), ...context].filter(Boolean).join('\n'),
          website: form.website,
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      toast.success('Request sent. We will reply within one working day.');
      setForm(EMPTY);
    } catch {
      // Keep what they typed and point them at a channel that always works.
      toast.error('Could not send just now. Please call or email us directly.');
    } finally {
      setSending(false);
    }
  };

  const field = (name, label, type = 'text') => (
    <div>
      <label className="field-label" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        className="field-input"
        value={form[name]}
        onChange={update(name)}
        disabled={sending}
        aria-invalid={errors[name] ? 'true' : undefined}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      />
      {errors[name] && <div className="field-error" id={`${name}-error`}>{errors[name]}</div>}
    </div>
  );

  return (
    <main>
      <section className="container mt-8 mb-12">
        <div className="grid-2">
          <div className="reveal-stagger">
            <div className="eyebrow mb-4">Contact</div>
            <h1 className="h1-page mb-6">Request a quote</h1>
            <p className="body-large mb-12">
              Tell us the sector, the site and roughly what you need. We reply with next steps — usually a site
              visit — within one working day.
            </p>

            <div className="flex flex-col gap-6">
              {DETAILS.map((d) => (
                <div key={d.label}>
                  <div className="eyebrow mb-1">{d.label}</div>
                  {d.href ? (
                    <a href={d.href} className="body-large" style={{ fontWeight: 700 }}>
                      {d.value}
                    </a>
                  ) : (
                    <p className="body-large" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{d.value}</p>
                  )}
                </div>
              ))}
            </div>

            <Photo
              src="/images/carvan2.webp"
              alt="Completed OS Interiors project"
              ratio="16 / 10"
              style={{ borderRadius: 'var(--radius-lg)', marginTop: '32px' }}
            />
          </div>

          <div className="reveal-stagger">
            <div className="form-card">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                {/* Honeypot. Hidden from sight and from assistive tech, and
                    skipped in the tab order, so only a bot ever fills it. */}
                <div className="hp-field" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={update('website')}
                  />
                </div>

                {field('name', 'Full name')}

                <div className="grid-2" style={{ gap: '24px' }}>
                  {field('phone', 'Phone', 'tel')}
                  {field('email', 'Email', 'email')}
                </div>

                <div className="grid-2" style={{ gap: '24px' }}>
                  <div>
                    <label className="field-label" htmlFor="projectType">Project type</label>
                    <select
                      id="projectType"
                      className="field-input"
                      value={form.projectType}
                      onChange={update('projectType')}
                      disabled={sending}
                    >
                      {PROJECT_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  {field('area', 'Approx. area (sq ft)')}
                </div>

                {field('city', 'City')}

                <div>
                  <label className="field-label" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    rows="4"
                    className="field-input"
                    style={{ resize: 'vertical' }}
                    value={form.message}
                    onChange={update('message')}
                    disabled={sending}
                  ></textarea>
                </div>

                <div className="flex items-center gap-6 flex-wrap mt-4">
                  <button type="submit" className="btn-primary" disabled={sending}>
                    {sending ? 'Sending…' : 'Send request'}
                  </button>
                  <span style={{ fontSize: '14px', color: 'var(--text-meta)' }}>We never share your details.</span>
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
