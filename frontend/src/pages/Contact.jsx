import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Contact = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = window.API_CONFIG?.BASE_URL || '/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/v2/leads`, formData);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      // Fallback if v2/leads doesn't exist, try /leads
      try {
        await axios.post(`${API_URL}/leads`, formData);
        setIsSubmitted(true);
      } catch (err2) {
        console.error(err2);
        alert('Failed to send inquiry. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main id="page-contact">
      <div className="page-hero" style={{paddingTop: '80px'}}>
        <div className="page-hero-bg" style={{backgroundImage: `url('/images/caravab1.jpeg')`}}></div>
        <div className="page-hero-content">
          <span className="label">Get in Touch</span>
          <h1>Let's Create <em style={{color: 'var(--gold)', fontStyle: 'italic'}}>Something</em><br />Extraordinary</h1>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="contact-grid reveal">
            {/* Form */}
            <div>
              <span className="label">Send an Inquiry</span>
              <div className="gold-line"></div>
              <h2 style={{fontSize: '2rem', marginBottom: '8px', marginTop: '16px'}}>Tell Us About<br /><em style={{color: 'var(--gold)', fontStyle: 'italic'}}>Your Project</em></h2>
              <p style={{marginBottom: '40px'}}>We respond to every inquiry within 24 hours. Your information is private and secure.</p>

              {!isSubmitted ? (
                <form id="contact-form" onSubmit={handleSubmit}>
                  <div className="contact-form-group">
                    <label htmlFor="cf-name">Full Name *</label>
                    <input 
                      type="text" 
                      id="cf-name" 
                      className="form-control" 
                      placeholder="Ajay Jadhav" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="form-two-col">
                    <div className="contact-form-group">
                      <label htmlFor="cf-phone">Phone *</label>
                      <input 
                        type="tel" 
                        id="cf-phone" 
                        className="form-control" 
                        placeholder="+91 8767067884" 
                        required 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="contact-form-group">
                      <label htmlFor="cf-email">Email *</label>
                      <input 
                        type="email" 
                        id="cf-email" 
                        className="form-control" 
                        placeholder="Sudaaher74@gmail.com" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="cf-type">Project Type *</label>
                    <select 
                      id="cf-type" 
                      className="form-control" 
                      required
                      value={formData.projectType}
                      onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                    >
                      <option value="">Select a project type</option>
                      <option value="Residential">Residential — Apartment / Villa / Bungalow</option>
                      <option value="Corporate">Corporate — Office / Hotel / Restaurant</option>
                      <option value="Turnkey">Turnkey — Complete Design & Execution</option>
                      <option value="Renovation">Renovation — Existing Space Makeover</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="cf-message">Tell Us About Your Project *</label>
                    <textarea 
                      id="cf-message" 
                      className="form-control" 
                      rows="5"
                      placeholder="Share your vision — location, size, timeline, budget range, and anything else that will help us understand your project..."
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-primary" style={{width: '100%', justifyContent: 'center'}} disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                    {!isSubmitting && (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    )}
                  </button>
                </form>
              ) : (
                <div className="form-success" id="form-success" style={{display: 'block', padding: '2rem', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--gold)', borderRadius: '12px'}}>
                  <div className="check-icon" style={{color: 'var(--gold)', marginBottom: '1rem'}}>
                    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 style={{fontSize: '1.6rem', marginBottom: '12px'}}>Thank You</h3>
                  <p>Your inquiry has been received securely. Our team will contact you within 24 hours to schedule a consultation.</p>
                  <button className="btn-outline" style={{marginTop: '1.5rem'}} onClick={() => setIsSubmitted(false)}>Submit Another Inquiry</button>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <span className="label">Our Offices</span>
              <div className="gold-line"></div>
              <h2 style={{fontSize: '2rem', marginBottom: '32px', marginTop: '16px'}}>Find Us <em style={{color: 'var(--gold)', fontStyle: 'italic'}}>Here</em></h2>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <div className="contact-info-label">Mumbai HQ</div>
                  <div className="contact-info-value">Level 12, Wwork BKC<br />Bandra Kurla Complex<br />Mumbai 400 051</div>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.78 16.9z" />
                  </svg>
                </div>
                <div>
                  <div className="contact-info-label">Phone</div>
                  <div className="contact-info-value">+91 22 6642 4242<br />+91 8767067884</div>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <div className="contact-info-label">Email</div>
                  <div className="contact-info-value">hello@osinteriors.com<br />careers@osinteriors.com</div>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <div className="contact-info-label">Studio Hours</div>
                  <div className="contact-info-value">Monday – Saturday<br />10:00 AM – 7:00 PM IST</div>
                </div>
              </div>

              <div className="map-placeholder">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>OS Interiors, BKC, Mumbai</span>
                <span style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>Google Maps integration</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
