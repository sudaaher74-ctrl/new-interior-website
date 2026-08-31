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
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [workSummary, setWorkSummary] = useState('');

  // Profile Edit State
  const [mobileNumberInput, setMobileNumberInput] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
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
      
      try {
        const attRes = await axios.get(`${API_URL}/attendance/history`, { headers });
        setAttendanceHistory(attRes.data);
      } catch (err) {
        console.error("Failed to fetch attendance history", err);
      }
      
      try {
        const profileRes = await axios.get(`${API_URL}/auth/profile`, { headers });
        if (profileRes.data?.user) {
          setUser(profileRes.data.user);
          setMobileNumberInput(profileRes.data.user.mobileNumber || '');
          localStorage.setItem('user', JSON.stringify(profileRes.data.user));
        }
      } catch (profileErr) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setMobileNumberInput(parsed.mobileNumber || '');
          } catch (e) {
            setUser({ fullName: 'Employee', role: 'Site Engineer' });
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateMobile = async (e) => {
    e.preventDefault();
    if (!mobileNumberInput.trim()) {
      toast.error('Please enter a valid mobile number');
      return;
    }
    setIsSavingProfile(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/auth/profile`, { mobileNumber: mobileNumberInput.trim() }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      toast.success('Mobile number saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to update mobile number');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const startCamera = async () => {
    try {
      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: { ideal: 'environment' } } 
        });
      } catch {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      setStream(mediaStream);
      setIsCameraOpen(true);
      setImageSrc(null);
      setActionMsg('');
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(e => console.warn("Video play exception:", e));
        }
      }, 100);
    } catch (err) {
      console.error("Camera access error:", err);
      toast.error('Unable to open live video stream. You can also use the "Open Device Camera" button.');
      setActionMsg('Camera stream not accessible. Click "Open Device Camera" to take a photo.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) {
      toast.error('Camera preview not ready');
      return;
    }
    const video = videoRef.current;
    const width = video.videoWidth || video.clientWidth || 640;
    const height = video.videoHeight || video.clientHeight || 480;

    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);

    const base64Img = canvas.toDataURL('image/jpeg', 0.8);
    setImageSrc(base64Img);
    toast.success('Site photo captured!');

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const handleNativeCameraCapture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        const canvas = canvasRef.current || document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', 0.75);
        setImageSrc(compressed);
        toast.success('Site photo captured from camera!');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const retakePhoto = () => {
    setImageSrc(null);
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const handleCheckIn = () => {
    if (!selectedProject) return toast.error('Select a project first');
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    
    toast.loading('Acquiring location for Check-In...', { id: 'checkin' });
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
        await axios.post(`${API_URL}/attendance/check-in`, {
          projectId: selectedProject,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        }, { headers });
        toast.success('Successfully Checked In!', { id: 'checkin' });
        fetchData();
      } catch (err) {
        toast.error(err.response?.data?.msg || 'Failed to check in', { id: 'checkin' });
      }
    }, (err) => {
      toast.error('Failed to get location', { id: 'checkin' });
    });
  };

  const handleCheckOut = async () => {
    if (!workSummary) return toast.error('Please provide a work summary');
    try {
      toast.loading('Processing Check-Out...', { id: 'checkout' });
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.post(`${API_URL}/attendance/check-out`, { workSummary }, { headers });
      toast.success('Successfully Checked Out!', { id: 'checkout' });
      setWorkSummary('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to check out', { id: 'checkout' });
    }
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
            <button className={`${styles.navItem} ${activeTab === 'attendance' ? styles.active : ''}`} onClick={() => setActiveTab('attendance')}><span>⏰</span> Attendance</button>
            <button className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`} onClick={() => setActiveTab('profile')}><span>👤</span> My Profile</button>
          </nav>

          <div className={styles.userProfile} onClick={() => setActiveTab('profile')} style={{ cursor: 'pointer' }} title="View Profile">
            <div className={styles.avatar}>
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt={user.fullName} className={styles.avatarImg} />
              ) : (
                user.fullName?.charAt(0) || 'E'
              )}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.fullName}</span>
              <span className={styles.userRole}>{user.employeeId ? `${user.employeeId} • ${user.role}` : user.role}</span>
            </div>
            <button 
              className={styles.logoutBtn} 
              onClick={(e) => { e.stopPropagation(); handleLogout(); }} 
              title="Sign Out"
            >
              🚪
            </button>
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
              {activeTab === 'attendance' && 'Attendance & Time Tracking'}
              {activeTab === 'profile' && 'My Profile & Account Details'}
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
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      ref={fileInputRef} 
                      style={{ display: 'none' }} 
                      onChange={handleNativeCameraCapture} 
                    />

                    {!isCameraOpen && !imageSrc && (
                      <div style={{textAlign: 'center', padding: '2.5rem 1rem'}}>
                        <div style={{fontSize: '3rem', marginBottom: '0.75rem'}}>📷</div>
                        <h4 style={{fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', color: '#0f172a'}}>Capture Live Site Photo</h4>
                        <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem'}}>Live photo capture is required for on-site report verification.</p>
                        
                        <div style={{display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap'}}>
                          <button type="button" onClick={startCamera} className={`${styles.btn} ${styles.btnPrimary}`}>
                            📹 Open Live Camera
                          </button>
                          <button type="button" onClick={() => fileInputRef.current?.click()} className={`${styles.btn} ${styles.btnSecondary}`}>
                            📸 Take Camera Snapshot
                          </button>
                        </div>
                      </div>
                    )}
                    {isCameraOpen && (
                      <div className={styles.videoContainer}>
                        <video ref={videoRef} className={styles.videoStream} autoPlay playsInline muted></video>
                        <div style={{display: 'flex', gap: '10px', marginTop: '1rem', width: '100%'}}>
                          <button type="button" onClick={capturePhoto} className={`${styles.btn} ${styles.btnPrimary}`} style={{ background: 'var(--gradient-success)', flex: 2 }}>
                            📸 Snap Photo Now
                          </button>
                          <button type="button" onClick={() => {
                            if (stream) stream.getTracks().forEach(t => t.stop());
                            setIsCameraOpen(false);
                          }} className={`${styles.btn} ${styles.btnSecondary}`} style={{flex: 1}}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    {imageSrc && (
                      <div className={styles.imagePreview}>
                        <img src={imageSrc} alt="Site" />
                        <div style={{marginTop: '0.75rem'}}>
                          <button type="button" onClick={retakePhoto} className={`${styles.btn} ${styles.btnSecondary}`}>🔄 Retake Photo</button>
                        </div>
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
          {activeTab === 'attendance' && (
            <div className={`${styles.glassCard} ${styles.fadeInUp}`}>
              <h2 className={styles.cardTitle}>Daily Attendance</h2>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Clock In</h3>
                  <select 
                    className={styles.select} 
                    value={selectedProject} 
                    onChange={e => setSelectedProject(e.target.value)}
                    style={{ marginBottom: '1rem' }}
                  >
                    <option value="">Select current site...</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.title || p.name}</option>)}
                  </select>
                  <button onClick={handleCheckIn} className={`${styles.btn} ${styles.btnPrimary}`} style={{ width: '100%', background: 'var(--gradient-success)' }}>
                    ✅ Check In
                  </button>
                </div>
                <div style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Clock Out</h3>
                  <textarea 
                    className={styles.input} 
                    placeholder="Brief work summary for today..." 
                    value={workSummary}
                    onChange={e => setWorkSummary(e.target.value)}
                    style={{ marginBottom: '1rem', height: '60px', resize: 'none' }}
                  />
                  <button onClick={handleCheckOut} className={`${styles.btn} ${styles.btnPrimary}`} style={{ width: '100%', background: 'var(--accent-1)' }}>
                    🛑 Check Out
                  </button>
                </div>
              </div>
              
              <h2 className={styles.cardTitle}>My Attendance History</h2>
              <div style={{ marginTop: '1rem' }}>
                {attendanceHistory.length === 0 ? (
                  <p style={{color: 'var(--text-secondary)'}}>No attendance records found.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                        <th style={{ padding: '8px' }}>Date</th>
                        <th style={{ padding: '8px' }}>Project</th>
                        <th style={{ padding: '8px' }}>Status</th>
                        <th style={{ padding: '8px' }}>Hours Logged</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceHistory.map((rec, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                          <td style={{ padding: '8px' }}>{new Date(rec.date).toLocaleDateString()}</td>
                          <td style={{ padding: '8px' }}>{rec.project?.name || 'Unknown'}</td>
                          <td style={{ padding: '8px' }}>
                            <span style={{ 
                              padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem',
                              background: rec.status === 'Present' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                              color: rec.status === 'Present' ? '#10b981' : '#f59e0b'
                            }}>
                              {rec.status}
                            </span>
                          </td>
                          <td style={{ padding: '8px' }}>{rec.totalWorkingHours ? rec.totalWorkingHours.toFixed(1) + ' hrs' : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                        <th style={{ padding: '8px' }}>Status</th>
                        <th style={{ padding: '8px' }}>Notes</th>
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

          {activeTab === 'profile' && (
            <div className={`${styles.profileContainer} ${styles.fadeInUp}`}>
              {/* Profile Hero Header */}
              <div className={styles.profileHero}>
                <div className={styles.profileAvatarLarge}>
                  {user.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.fullName} />
                  ) : (
                    user.fullName?.charAt(0) || 'E'
                  )}
                </div>
                <div className={styles.profileDetails}>
                  <h2 className={styles.profileName}>{user.fullName}</h2>
                  <div className={styles.profileBadgeRow}>
                    <span className={`${styles.badge} ${styles.badgeGoogle}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      Google Verified
                    </span>
                    <span className={`${styles.badge} ${styles.badgeRole}`}>
                      {user.employeeId || 'EMP001'} • {user.role}
                    </span>
                    <span className={`${styles.badge} ${styles.badgeActive}`}>
                      ● Active Account
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Details Grid */}
              <div className={styles.profileGrid}>
                {/* Personal Information */}
                <div className={styles.profileSection}>
                  <h3 className={styles.profileSectionTitle}>
                    <span>👤</span> Employee Information
                  </h3>
                  
                  <div className={styles.profileItem}>
                    <span className={styles.profileItemLabel}>Full Name</span>
                    <span className={styles.profileItemValue}>{user.fullName}</span>
                  </div>

                  <div className={styles.profileItem}>
                    <span className={styles.profileItemLabel}>Employee ID</span>
                    <span className={styles.profileItemValue} style={{ color: 'var(--accent-1)' }}>
                      {user.employeeId || 'EMP001'}
                    </span>
                  </div>

                  <div className={styles.profileItem}>
                    <span className={styles.profileItemLabel}>Official Email</span>
                    <span className={styles.profileItemValue}>{user.email}</span>
                  </div>

                  <div className={styles.profileItem}>
                    <span className={styles.profileItemLabel}>Assigned Role</span>
                    <span className={styles.profileItemValue}>{user.role}</span>
                  </div>
                </div>

                {/* Google Authentication Credentials */}
                <div className={styles.profileSection}>
                  <h3 className={styles.profileSectionTitle}>
                    <span>🔐</span> Google Authentication
                  </h3>

                  <div className={styles.profileItem}>
                    <span className={styles.profileItemLabel}>Auth Method</span>
                    <span className={styles.profileItemValue}>Google OAuth 2.0</span>
                  </div>

                  <div className={styles.profileItem}>
                    <span className={styles.profileItemLabel}>Google ID (Subject UID)</span>
                    <span className={styles.profileItemValue} style={{ fontSize: '0.88rem', fontFamily: 'monospace' }}>
                      {user.googleId || 'Connected via Google'}
                    </span>
                  </div>

                  <div className={styles.profileItem}>
                    <span className={styles.profileItemLabel}>Security Protocol</span>
                    <span className={styles.profileItemValue} style={{ color: '#059669' }}>
                      JWT + Supabase PostgreSQL RLS
                    </span>
                  </div>

                  <div className={styles.profileItem}>
                    <span className={styles.profileItemLabel}>Account Isolation</span>
                    <span className={styles.profileItemValue} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Isolated portal workspace for each team member
                    </span>
                  </div>
                </div>

                {/* Mobile Number & Contact Settings */}
                <div className={styles.profileSection}>
                  <h3 className={styles.profileSectionTitle}>
                    <span>📱</span> Mobile Number & Contact
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Enter your active mobile number so project managers and site coordinators can reach you directly.
                  </p>

                  <form onSubmit={handleUpdateMobile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className={styles.profileEditRow}>
                      <input 
                        type="tel"
                        className={styles.profileInput}
                        placeholder="e.g. +91 98765 43210"
                        value={mobileNumberInput}
                        onChange={(e) => setMobileNumberInput(e.target.value)}
                        required
                      />
                      <button 
                        type="submit" 
                        className={styles.saveBtn}
                        disabled={isSavingProfile}
                      >
                        {isSavingProfile ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>

                  {user.mobileNumber && (
                    <div style={{ fontSize: '0.85rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>✓</span> Saved: <strong>{user.mobileNumber}</strong>
                    </div>
                  )}
                </div>

                {/* Activity & Stats */}
                <div className={styles.profileSection}>
                  <h3 className={styles.profileSectionTitle}>
                    <span>📈</span> Portal Activity
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-1)' }}>
                        {allVisits.length}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                        SITE VISITS
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#059669' }}>
                        {attendanceHistory.length}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                        ATTENDANCE DAYS
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '0.5rem' }}>
                    <button 
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid #fee2e2',
                        background: '#fef2f2',
                        color: '#ef4444',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>🚪</span> Sign Out of Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
