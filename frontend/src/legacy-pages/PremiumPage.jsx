import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PremiumPage.module.css';

const PremiumPage = () => {
  return (
    <div className={styles.premiumWrapper}>
      {/* Ambient Background Orbs */}
      <div className={`${styles.bgGlow} ${styles.bgGlow1}`}></div>
      <div className={`${styles.bgGlow} ${styles.bgGlow2}`}></div>

      <div className={styles.container}>
        <header className={`${styles.header} ${styles.fadeInUp}`}>
          <div className={styles.logo}>Aura.</div>
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/projects" className={styles.navLink}>Projects</Link>
            <Link to="/contact" className={styles.navLink}>Quote</Link>
            <Link to="/contact" className={styles.navLink}>Contacts</Link>
          </nav>
        </header>

        <main>
          {/* Hero Section */}
          <section className={`${styles.hero} ${styles.fadeInUp} ${styles.delay1}`}>
            <h1 className={styles.heroTitle}>
              Crafting digital<br />experiences that live.
            </h1>
            <p className={styles.heroSubtitle}>
              Elevate your application with a highly aesthetic, responsive interface designed to captivate your users from the first click.
            </p>
            <button className={styles.premiumButton}>Start Building Now</button>
          </section>

          {/* Glassmorphic Grid */}
          <section className={styles.grid}>
            <div className={`${styles.glassCard} ${styles.fadeInUp} ${styles.delay2}`}>
              <div className={styles.cardIcon}>✨</div>
              <h3 className={styles.cardTitle}>Glassmorphism</h3>
              <p className={styles.cardText}>
                Stunning translucent panels utilizing backdrop-filter, providing incredible depth and a modern sense of elegance to your UI.
              </p>
            </div>

            <div className={`${styles.glassCard} ${styles.fadeInUp} ${styles.delay3}`}>
              <div className={styles.cardIcon}>⚡</div>
              <h3 className={styles.cardTitle}>Micro-Animations</h3>
              <p className={styles.cardText}>
                Every interaction provides delightful, fluid feedback that makes the interface feel tactile, highly responsive, and alive.
              </p>
            </div>

            <div className={`${styles.glassCard} ${styles.fadeInUp} ${styles.delay3}`}>
              <div className={styles.cardIcon}>📱</div>
              <h3 className={styles.cardTitle}>Mobile-First Fluidity</h3>
              <p className={styles.cardText}>
                Perfectly adapted grid and flexbox layouts with large touch targets that look spectacular on any screen dimension.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PremiumPage;
