import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EmployeeDashboard.module.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString(undefined, dateOptions));
  }, []);

  return (
    <div className={styles.portalWrapper}>
      {/* Ambient Glow Effects */}
      <div className={`${styles.bgGlow} ${styles.bgGlow1}`}></div>
      <div className={`${styles.bgGlow} ${styles.bgGlow2}`}></div>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.brand}>OS Portal.</div>
          
          <nav className={styles.navMenu}>
            <button className={`${styles.navItem} ${styles.active}`}>
              <span>📊</span> Dashboard
            </button>
            <button className={styles.navItem}>
              <span>📸</span> Site Photos
            </button>
            <button className={styles.navItem}>
              <span>📝</span> Daily Reports
            </button>
            <button className={styles.navItem}>
              <span>💰</span> Expenses
            </button>
          </nav>

          <div className={styles.userProfile}>
            <div className={styles.avatar}>JD</div>
            <div className={styles.userInfo}>
              <span className={styles.userName} id="userName">Loading...</span>
              <span className={styles.userRole}>Site Engineer</span>
            </div>
            <button className={styles.logoutBtn} title="Logout" onClick={() => navigate('/login')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <header className={styles.header}>
            <h1 className={styles.pageTitle}>Overview</h1>
            <div className={styles.dateDisplay}>{currentDate}</div>
          </header>

          <div className={styles.dashboardGrid}>
            {/* Left Column */}
            <div className={styles.leftCol}>
              <div className={`${styles.glassCard} ${styles.delay1}`}>
                <h2 className={styles.cardTitle}><span>📍</span> Log Site Visit & Expenses</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Select your assigned project, capture site progress photos, and record any travel expenses incurred today.
                </p>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Assigned Project</label>
                  <select id="projectSelect" className={styles.select}>
                    <option value="">Select a project...</option>
                    {/* Will be populated dynamically */}
                  </select>
                </div>

                <div className={styles.cameraArea} id="videoContainer">
                  <div className={styles.cameraIcon}>📷</div>
                  <span>Click "Open Camera" to capture</span>
                  <video id="videoElement" autoPlay playsInline style={{display: 'none', position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px'}}></video>
                  <canvas id="canvasElement" style={{display: 'none'}}></canvas>
                  <img id="previewImage" style={{display: 'none', position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px'}} alt="Site Preview" />
                </div>

                <div className={styles.actionRow} id="actionButtonsRow">
                  <button id="startCamBtn" className={`${styles.btn} ${styles.btnSecondary}`}>📸 Open Camera</button>
                  <button id="uploadPhotoBtn" className={`${styles.btn} ${styles.btnSecondary}`}>📁 Upload Photo</button>
                  <input type="file" id="photoInput" accept="image/*" capture="environment" style={{display: 'none'}} />
                </div>

                <div className={styles.inputGroup} id="expenseSection">
                  <label className={styles.label}>Travel Expense</label>
                  <input type="number" id="expenseAmount" className={styles.input} placeholder="Amount (₹)" style={{marginBottom: '0.75rem'}} />
                  <input type="text" id="expenseDesc" className={styles.input} placeholder="Description (e.g., Train Panvel to CST)" />
                </div>

                <button id="submitVisitBtn" className={`${styles.btn} ${styles.btnPrimary}`}>Submit Visit Report</button>
                <div id="actionMsg" style={{marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--accent-1)'}}></div>
              </div>
            </div>

            {/* Right Column */}
            <div className={styles.rightCol}>
              <div className={`${styles.actionGrid} ${styles.delay2}`}>
                <div className={styles.actionCard}>
                  <div className={styles.actionIcon}>📁</div>
                  <div className={styles.actionLabel}>Upload Docs</div>
                </div>
                <div className={styles.actionCard}>
                  <div className={styles.actionIcon}>✍️</div>
                  <div className={styles.actionLabel}>Draft Report</div>
                </div>
              </div>

              <div className={`${styles.glassCard} ${styles.delay3}`} style={{marginBottom: '2rem'}}>
                <h3 className={styles.cardTitle}><span>🕒</span> Today's Visits</h3>
                <div id="todaysVisitsList" className={styles.list}>
                  <div className={styles.listItem}>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemTitle}>Loading visits...</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles.glassCard} ${styles.delay3}`}>
                <h3 className={styles.cardTitle}><span>📋</span> Active Assignments</h3>
                <div id="assignedProjectsList" className={styles.list}>
                  <div className={styles.listItem}>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemTitle}>Loading projects...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
