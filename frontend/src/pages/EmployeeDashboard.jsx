import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './EmployeeDashboard.module.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');
  
  // Data State
  const [projects, setProjects] = useState([]);
  const [visits, setVisits] = useState([]);
  const [user, setUser] = useState({ fullName: 'Loading...', role: 'Site Engineer' });
  
  // Form State
  const [selectedProject, setSelectedProject] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');
  
  // Camera State
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const API_URL = window.API_CONFIG?.BASE_URL || '/api'; // fallback to /api for local dev proxy
  
  useEffect(() => {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString(undefined, dateOptions));
    
    const token = localStorage.getItem('token');
    if (!token || token === 'dummy_token' || token === 'dummy_admin_token') {
      navigate('/login');
      return;
    }

    fetchData();

    return () => {
      // Cleanup camera on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      try {
        const projRes = await axios.get(`${API_URL}/projects`, { headers });
        setProjects(projRes.data);
      } catch (err) {
        console.error("Failed to fetch projects, setting empty");
        setProjects([]);
      }

      try {
        const visitRes = await axios.get(`${API_URL}/v2/site-visits/my-today`, { headers });
        setVisits(visitRes.data);
      } catch (err) {
        setVisits([]);
      }
      
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser({ fullName: 'Unknown', role: 'Employee' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setImageSrc(null);
      setActionMsg('');
      
      // Attach stream to video tag after state updates
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 50);
    } catch (err) {
      console.error("Camera access denied", err);
      setActionMsg('Camera access is required. Please allow camera permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const base64Img = canvasRef.current.toDataURL('image/jpeg', 0.8);
      setImageSrc(base64Img);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setIsCameraOpen(false);
    }
  };

  const retakePhoto = () => {
    setImageSrc(null);
    startCamera();
  };

  const submitVisit = () => {
    if (!selectedProject) return setActionMsg('Please select a project');
    if (!imageSrc) return setActionMsg('Please capture a photo from your camera');
    
    setActionMsg('Acquiring secure GPS location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          sendDataToBackend(loc);
        },
        (error) => {
          console.error(error);
          setActionMsg('Failed to get location. Please allow GPS access in your browser settings.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setActionMsg('Geolocation is not supported by your browser.');
    }
  };

  const sendDataToBackend = async (loc) => {
    setActionMsg('Submitting securely to Admin server...');
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const payload = {
        projectId: selectedProject,
        lat: loc.lat,
        lng: loc.lng,
        accuracy: loc.accuracy,
        photoUrl: imageSrc,
        expenseAmount: Number(expenseAmount) || 0,
        expenseDescription: expenseDesc
      };

      const res = await axios.post(`${API_URL}/v2/site-visits/log`, payload, { headers });
      
      setActionMsg('Visit logged successfully!');
      
      // Ensure visit has populated project for UI
      const newVisit = res.data;
      if (!newVisit.project || typeof newVisit.project === 'string') {
        const p = projects.find(p => p._id === newVisit.project);
        newVisit.project = p ? { name: p.title || p.name } : { name: 'Unknown Project' };
      }
      
      setVisits([newVisit, ...visits]);
      
      setSelectedProject('');
      setImageSrc(null);
      setExpenseAmount('');
      setExpenseDesc('');
    } catch (err) {
      console.error(err);
      setActionMsg('Failed to submit visit. Server error.');
    }
  };

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
            <button className={`${styles.navItem} ${styles.active}`}><span>📊</span> Dashboard</button>
            <button className={styles.navItem}><span>📸</span> Site Photos</button>
            <button className={styles.navItem}><span>📝</span> Daily Reports</button>
            <button className={styles.navItem}><span>💰</span> Expenses</button>
          </nav>

          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              {user.fullName.charAt(0)}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.fullName}</span>
              <span className={styles.userRole}>{user.role}</span>
            </div>
            <button className={styles.logoutBtn} title="Logout" onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>
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
                  Select your assigned project, capture a live site photo, and record any travel expenses. Upload from gallery is strictly disabled.
                </p>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Assigned Project</label>
                  <select 
                    className={styles.select} 
                    value={selectedProject} 
                    onChange={e => setSelectedProject(e.target.value)}
                  >
                    <option value="">Select a project...</option>
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.title || p.name}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.cameraArea}>
                  {!isCameraOpen && !imageSrc && (
                    <div style={{ textAlign: 'center' }}>
                      <div className={styles.cameraIcon}>📷</div>
                      <span>Click "Open Camera" to start live capture</span>
                    </div>
                  )}
                  
                  {isCameraOpen && (
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }}
                    ></video>
                  )}
                  
                  {imageSrc && (
                    <img 
                      src={imageSrc} 
                      style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} 
                      alt="Site Capture" 
                    />
                  )}
                  
                  <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                </div>

                <div className={styles.actionRow}>
                  {!isCameraOpen && !imageSrc && (
                    <button onClick={startCamera} className={`${styles.btn} ${styles.btnPrimary}`}>📸 Open Camera</button>
                  )}
                  
                  {isCameraOpen && (
                    <button onClick={capturePhoto} className={`${styles.btn} ${styles.btnPrimary}`} style={{ background: 'var(--gradient-success)' }}>
                      📸 Capture Now
                    </button>
                  )}
                  
                  {imageSrc && (
                    <button onClick={retakePhoto} className={`${styles.btn} ${styles.btnSecondary}`}>🔄 Retake Photo</button>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Travel Expense (Optional)</label>
                  <input 
                    type="number" 
                    className={styles.input} 
                    placeholder="Amount (₹)" 
                    style={{marginBottom: '0.75rem'}} 
                    value={expenseAmount}
                    onChange={e => setExpenseAmount(e.target.value)}
                  />
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="Description (e.g., Train Panvel to CST)" 
                    value={expenseDesc}
                    onChange={e => setExpenseDesc(e.target.value)}
                  />
                </div>

                <button onClick={submitVisit} className={`${styles.btn} ${styles.btnPrimary}`}>🚀 Submit Secure Visit Report</button>
                
                {actionMsg && (
                  <div style={{marginTop: '1rem', textAlign: 'center', fontSize: '0.95rem', color: 'var(--accent-1)', fontWeight: '500'}}>
                    {actionMsg}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className={styles.rightCol}>
              <div className={`${styles.glassCard} ${styles.delay3}`} style={{marginBottom: '2rem'}}>
                <h3 className={styles.cardTitle}><span>🕒</span> Today's Visits</h3>
                <div className={styles.list}>
                  {visits.length === 0 ? (
                    <div className={styles.listItem}>
                      <span className={styles.itemTitle} style={{ color: 'var(--text-secondary)' }}>No visits logged today.</span>
                    </div>
                  ) : (
                    visits.map((visit, idx) => (
                      <div className={styles.listItem} key={idx}>
                        <div className={styles.itemInfo}>
                          <span className={styles.itemTitle}>{visit.project?.name || visit.project?.title || 'Unknown Project'}</span>
                          <span className={styles.itemDesc}>{new Date(visit.time).toLocaleTimeString()}</span>
                        </div>
                        <div className={styles.badge}>Completed</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={`${styles.glassCard} ${styles.delay3}`}>
                <h3 className={styles.cardTitle}><span>📋</span> Active Assignments</h3>
                <div className={styles.list}>
                  {projects.length === 0 ? (
                    <div className={styles.listItem}>
                      <span className={styles.itemTitle} style={{ color: 'var(--text-secondary)' }}>No active projects.</span>
                    </div>
                  ) : (
                    projects.map((proj, idx) => (
                      <div className={styles.listItem} key={idx}>
                        <div className={styles.itemInfo}>
                          <span className={styles.itemTitle}>{proj.title || proj.name}</span>
                        </div>
                        <div className={styles.badge} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.2)' }}>Active</div>
                      </div>
                    ))
                  )}
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
