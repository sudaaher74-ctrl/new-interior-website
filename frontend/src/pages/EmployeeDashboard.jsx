import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import styles from './EmployeeDashboard.module.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');
  
  // Data State
  const [projects, setProjects] = useState([]);
  const [visits, setVisits] = useState([]);
  const [allVisits, setAllVisits] = useState([]);
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
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Offline Sync State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState(() => {
    const saved = localStorage.getItem('offlineVisits_queue');
    return saved ? JSON.parse(saved) : [];
  });
  
  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const API_URL = window.API_CONFIG?.BASE_URL || '/api'; // fallback to /api for local dev proxy
  
  useEffect(() => {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString(undefined, dateOptions));
    

    fetchData();

    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineQueue();
    };
    const handleOffline = () => setIsOnline(false);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      // Cleanup camera on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [navigate]);

  const syncOfflineQueue = async () => {
    const queueStr = localStorage.getItem('offlineVisits_queue');
    if (!queueStr) return;
    const queue = JSON.parse(queueStr);
    if (queue.length === 0) return;

    toast.loading(`Syncing ${queue.length} offline visits...`, { id: 'sync' });
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    
    let successCount = 0;
    const remainingQueue = [];

    for (const payload of queue) {
      try {
        await axios.post(`${API_URL}/v2/site-visits/log`, payload, { headers });
        successCount++;
      } catch (err) {
        remainingQueue.push(payload);
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully synced ${successCount} visits!`, { id: 'sync' });
      fetchData(); // Refresh list
    } else {
      toast.error('Sync failed. Will retry later.', { id: 'sync' });
    }

    localStorage.setItem('offlineVisits_queue', JSON.stringify(remainingQueue));
    setOfflineQueue(remainingQueue);
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      try {
        const projRes = await axios.get(`${API_URL}/projects`, { headers });
        setProjects(projRes.data);
        localStorage.setItem('cached_projects', JSON.stringify(projRes.data));
      } catch (err) {
        console.error("Failed to fetch projects from API, falling back to cache");
        const cached = localStorage.getItem('cached_projects');
        if (cached) {
          setProjects(JSON.parse(cached));
        } else {
          setProjects([]);
        }
      }

      try {
        const visitRes = await axios.get(`${API_URL}/v2/site-visits/my-today`, { headers });
        setVisits(visitRes.data);
      } catch (err) {
        setVisits([]);
      }
      
      try {
        const allVisitRes = await axios.get(`${API_URL}/v2/site-visits/my-visits`, { headers });
        setAllVisits(allVisitRes.data);
      } catch (err) {
        setAllVisits([]);
      }
      
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          setUser({ fullName: 'Demo Employee', role: 'Site Engineer' });
        }
      } else {
        setUser({ fullName: 'Demo Employee', role: 'Site Engineer' });
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
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      const MAX_WIDTH = 800;
      let width = video.videoWidth;
      let height = video.videoHeight;
      
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
      
      // Compress heavily for offline queue safety
      const base64Img = canvas.toDataURL('image/jpeg', 0.6);
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
    if (!selectedProject) {
      toast.error('Please select a project');
      return setActionMsg('Please select a project');
    }
    if (!imageSrc) {
      toast.error('Please capture a photo from your camera');
      return setActionMsg('Please capture a photo from your camera');
    }
    
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
          toast.error('Failed to get location. Please allow GPS access in your browser settings.');
          setActionMsg('Failed to get location.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setActionMsg('Geolocation is not supported by your browser.');
    }
  };

  const sendDataToBackend = async (loc) => {
    setActionMsg('Submitting securely to Admin server...');
    const payload = {
      projectId: selectedProject,
      lat: loc.lat,
      lng: loc.lng,
      accuracy: loc.accuracy,
      photoBase64: imageSrc, // Include compressed image!
      expenseAmount: Number(expenseAmount) || 0,
      expenseDescription: expenseDesc,
      offlineTimestamp: new Date().toISOString()
    };

    if (!isOnline) {
      const newQueue = [...offlineQueue, payload];
      localStorage.setItem('offlineVisits_queue', JSON.stringify(newQueue));
      setOfflineQueue(newQueue);
      
      toast.success('Offline mode: Visit saved locally!');
      setActionMsg('Offline mode: Visit saved locally!');
      
      const p = projects.find(p => p._id === payload.projectId);
      const fakeVisit = {
        _id: 'local-' + Date.now(),
        project: p ? { name: p.title || p.name } : { name: 'Unknown Project' },
        time: payload.offlineTimestamp,
        location: { lat: payload.lat, lng: payload.lng },
        expenseAmount: payload.expenseAmount,
        isOffline: true
      };
      setVisits([fakeVisit, ...visits]);
      
      setSelectedProject('');
      setImageSrc(null);
      setExpenseAmount('');
      setExpenseDesc('');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const res = await axios.post(`${API_URL}/v2/site-visits/log`, payload, { headers });
      
      toast.success('Visit logged successfully!');
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
      toast.error('Failed to submit visit. Server error.');
      setActionMsg('Failed to submit visit. Server error.');
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <div className={styles.portalWrapper}>
      <div className={styles.layout}>
        {/* Offline Banner */}
        {!isOnline && (
          <div style={{ 
            backgroundColor: '#f59e0b', 
            color: 'white', 
            padding: '12px', 
            textAlign: 'center', 
            fontWeight: '600', 
            fontSize: '0.9rem', 
            width: '100%', 
            position: 'sticky', 
            top: 0, 
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <span>⚠️</span> Offline Mode Active — Data saved locally
            {offlineQueue.length > 0 && <span style={{backgroundColor: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem'}}>{offlineQueue.length} pending</span>}
          </div>
        )}
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.brand}>OS Portal.</div>
          
          <nav className={styles.navMenu}>
            <button className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.active : ''}`} onClick={() => setActiveTab('dashboard')}><span>📊</span> Dashboard</button>
            <button className={`${styles.navItem} ${activeTab === 'photos' ? styles.active : ''}`} onClick={() => setActiveTab('photos')}><span>📸</span> Site Photos</button>
            <button className={`${styles.navItem} ${activeTab === 'reports' ? styles.active : ''}`} onClick={() => setActiveTab('reports')}><span>📝</span> Daily Reports</button>
            <button className={`${styles.navItem} ${activeTab === 'expenses' ? styles.active : ''}`} onClick={() => setActiveTab('expenses')}><span>💰</span> Expenses</button>
          </nav>

          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              {user.fullName.charAt(0)}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.fullName}</span>
              <span className={styles.userRole}>{user.role}</span>
            </div>
          </div>
          {deferredPrompt && (
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <button 
                onClick={handleInstallClick} 
                className={`${styles.btn} ${styles.btnPrimary}`} 
                style={{ width: '100%', fontSize: '0.9rem', padding: '0.6rem' }}
              >
                📲 Install App
              </button>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <header className={styles.header}>
            <h1 className={styles.pageTitle}>
              {activeTab === 'dashboard' && 'Overview'}
              {activeTab === 'photos' && 'Site Photos Gallery'}
              {activeTab === 'reports' && 'Daily Reports'}
              {activeTab === 'expenses' && 'My Expenses'}
            </h1>
            <div className={styles.dateDisplay}>{currentDate}</div>
          </header>

                   {activeTab === 'dashboard' && (
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
                      <div style={{textAlign: 'center', padding: '3rem 1rem'}}>
                        <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📷</div>
                        <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>Camera access required for live site photos.</p>
                        <button onClick={startCamera} className={`${styles.btn} ${styles.btnPrimary}`}>📸 Open Camera</button>
                      </div>
                    )}
                    {isCameraOpen && (
                      <div className={styles.videoContainer}>
                        <video ref={videoRef} className={styles.videoStream} autoPlay playsInline muted></video>
                        <button onClick={capturePhoto} className={`${styles.btn} ${styles.btnPrimary}`} style={{ background: 'var(--gradient-success)' }}>
                          ✅ Capture Photo
                        </button>
                      </div>
                    )}
                    {imageSrc && (
                      <div className={styles.imagePreview}>
                        <img src={imageSrc} alt="Site" />
                        <button onClick={retakePhoto} className={`${styles.btn} ${styles.btnSecondary}`}>🔄 Retake Photo</button>
                      </div>
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
                  <div className={styles.visitsList}>
                    {visits.map((v, idx) => (
                      <div key={idx} className={styles.visitItem}>
                        <div className={styles.visitHeader}>
                          <span className={styles.visitProject}>{v.project?.name || 'Unknown Project'}</span>
                          <span className={styles.visitTime}>{new Date(v.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className={styles.visitDetails}>
                          <div>📍 Location: {v.location.lat.toFixed(4)}, {v.location.lng.toFixed(4)}</div>
                          <div>📏 Accuracy: {Math.round(v.location.accuracy)} meters</div>
                          {v.expenseAmount > 0 && (
                            <div style={{color: 'var(--accent-1)', marginTop: '0.25rem'}}>💰 Exp: ₹{v.expenseAmount} ({v.expenseDescription})</div>
                          )}
                        </div>
                      </div>
                    ))}
                    {visits.length === 0 && (
                      <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>
                        No visits logged today.
                      </div>
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
          )}

          {activeTab === 'photos' && (
            <div className={`${styles.glassCard} ${styles.fadeInUp}`}>
              <h2 className={styles.cardTitle}>Site Photos Gallery</h2>
              <div className={styles.photosGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                {allVisits.filter(v => v.photoUrl).length === 0 ? (
                  <p style={{color: 'var(--text-secondary)'}}>No photos found in your history.</p>
                ) : (
                  allVisits.filter(v => v.photoUrl).map((v, idx) => (
                    <div key={idx} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
                      <img src={v.photoUrl} alt="Site" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.8rem', padding: '4px 8px' }}>
                        {v.project?.name || 'Unknown Project'} <br/> {new Date(v.time).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {activeTab === 'reports' && (
            <div className={`${styles.glassCard} ${styles.fadeInUp}`}>
              <h2 className={styles.cardTitle}>Visit Reports History</h2>
              <div style={{ marginTop: '1rem' }}>
                {allVisits.length === 0 ? (
                  <p style={{color: 'var(--text-secondary)'}}>No historical reports found.</p>
                ) : (
                  <div className={styles.visitsList}>
                    {allVisits.map((v, idx) => (
                      <div key={idx} className={styles.visitItem} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                        <div className={styles.visitHeader}>
                          <span className={styles.visitProject}>{v.project?.name || 'Unknown Project'}</span>
                          <span className={styles.visitTime}>{new Date(v.time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </div>
                        <div className={styles.visitDetails} style={{ marginTop: '0.5rem' }}>
                          <div>📍 Location: {v.location.lat.toFixed(4)}, {v.location.lng.toFixed(4)} (Accuracy: {Math.round(v.location.accuracy)}m)</div>
                          {v.expenseAmount > 0 && <div>💰 Exp: ₹{v.expenseAmount} - {v.expenseDescription}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'expenses' && (
            <div className={`${styles.glassCard} ${styles.fadeInUp}`}>
              <h2 className={styles.cardTitle}>My Expenses</h2>
              <div style={{ marginTop: '1rem' }}>
                {allVisits.filter(v => v.expenseAmount > 0).length === 0 ? (
                  <p style={{color: 'var(--text-secondary)'}}>No expenses logged yet.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                        <th style={{ padding: '8px' }}>Date</th>
                        <th style={{ padding: '8px' }}>Project</th>
                        <th style={{ padding: '8px' }}>Description</th>
                        <th style={{ padding: '8px' }}>Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allVisits.filter(v => v.expenseAmount > 0).map((v, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                          <td style={{ padding: '8px' }}>{new Date(v.time).toLocaleDateString()}</td>
                          <td style={{ padding: '8px' }}>{v.project?.name || 'Unknown'}</td>
                          <td style={{ padding: '8px' }}>{v.expenseDescription || 'N/A'}</td>
                          <td style={{ padding: '8px', fontWeight: 'bold' }}>₹{v.expenseAmount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
