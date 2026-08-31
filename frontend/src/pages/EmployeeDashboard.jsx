import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import NotificationBell from '../components/NotificationBell';
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

  // Leaves State
  const [leaves, setLeaves] = useState([]);
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);

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
        const attRes = await axios.get(`${API_URL}/v2/attendance/history`, { headers });
        setAttendanceHistory(attRes.data);
      } catch (err) {
        console.error("Failed to fetch attendance history", err);
      }

      try {
        const leavesRes = await axios.get(`${API_URL}/v2/leaves/my`, { headers });
        setLeaves(leavesRes.data || []);
      } catch (err) {
        console.error("Failed to fetch leaves", err);
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

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    if (!leaveDate) {
      toast.error('Please select a leave date');
      return;
    }
    setIsSubmittingLeave(true);
    const toastId = toast.loading('Submitting leave request...');
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const res = await axios.post(`${API_URL}/v2/leaves`, {
        leaveDate,
        reason: leaveReason
      }, { headers });

      setLeaves(prev => [res.data, ...prev]);
      setLeaveDate('');
      setLeaveReason('');
      toast.success('Leave request submitted! Admins have been notified.', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to submit leave request', { id: toastId });
    } finally {
      setIsSubmittingLeave(false);
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
        await axios.post(`${API_URL}/v2/attendance/check-in`, {
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
      await axios.post(`${API_URL}/v2/attendance/check-out`, { workSummary }, { headers });
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
      const newVisit = res.data || {};
      if (!newVisit.project || typeof newVisit.project === 'string') {
        const p = projects.find(p => p._id === newVisit.project || p.id === newVisit.project);
        newVisit.project = p ? { name: p.title || p.name } : { name: 'Assigned Project' };
      }
      
      setVisits(prev => [newVisit, ...(Array.isArray(prev) ? prev : [])]);
      setAllVisits(prev => [newVisit, ...(Array.isArray(prev) ? prev : [])]);
      
      setSelectedProject('');
      setImageSrc(null);
      setExpenseAmount('');
      setExpenseDesc('');
      fetchData();
    } catch (err) {
      console.error('Visit submit error:', err);
      toast.error('Failed to submit visit: ' + (err.response?.data?.msg || err.message));
      setActionMsg('Failed to submit visit.');
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
            <button className={`${styles.navItem} ${activeTab === 'leaves' ? styles.active : ''}`} onClick={() => setActiveTab('leaves')}><span>🏖️</span> Leave Requests</button>
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
              {activeTab === 'leaves' && 'My Leave Requests'}
              {activeTab === 'profile' && 'My Profile & Account Details'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div className={styles.dateDisplay}>{currentDate}</div>
              <NotificationBell />
            </div>
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
                {/* Attendance Status Card */}
                {visits.length > 0 && (() => {
                  const sortedVisits = [...visits].sort((a, b) => new Date(a.time || a.createdAt) - new Date(b.time || b.createdAt));
                  const firstVisit = sortedVisits[0];
                  const lastVisit = sortedVisits[sortedVisits.length - 1];
                  const checkInTime = new Date(firstVisit.time || firstVisit.createdAt);
                  const checkOutTime = new Date(lastVisit.time || lastVisit.createdAt);
                  const isMultiple = sortedVisits.length > 1;
                  const elapsedMs = Date.now() - checkInTime.getTime();
                  const elapsedHrs = Math.floor(elapsedMs / (1000 * 60 * 60));
                  const elapsedMins = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));

                  return (
                    <div style={{
                      background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
                      borderRadius: '14px', padding: '1.25rem 1.5rem',
                      marginBottom: '1.5rem', color: 'white',
                      boxShadow: '0 6px 20px rgba(6, 78, 59, 0.35)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: 'rgba(255,255,255,0.9)' }}>
                          ✅ Today's Attendance
                        </h3>
                        <span style={{
                          background: 'rgba(255,255,255,0.15)', borderRadius: '20px',
                          padding: '3px 10px', fontSize: '0.78rem', fontWeight: '600'
                        }}>
                          {visits.length} Photo{visits.length > 1 ? 's' : ''} Logged
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem' }}>
                          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>🟢 CHECK-IN</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                            {checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>First photo submitted</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem' }}>
                          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>🔴 CHECK-OUT</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                            {isMultiple ? checkOutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                            {isMultiple ? 'Last photo submitted' : 'Submit more photos to update'}
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: '0.75rem', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.6rem 0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>⏱ Active for</span>
                        <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{elapsedHrs}h {elapsedMins}m</span>
                      </div>
                    </div>
                  );
                })()}

                <div className={`${styles.glassCard} ${styles.delay3}`} style={{marginBottom: '2rem'}}>
                  <h3 className={styles.cardTitle}><span>🕒</span> Today's Photo Logs</h3>
                  <div className={styles.visitsList}>
                    {visits.map((v, idx) => {
                      const projName = v?.project?.name || v?.project?.title || 'Assigned Project';
                      const vTime = v?.time || v?.createdAt ? new Date(v.time || v.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now';
                      const latVal = typeof v?.location?.lat === 'number' ? v.location.lat : (typeof v?.lat === 'number' ? v.lat : 0);
                      const lngVal = typeof v?.location?.lng === 'number' ? v.location.lng : (typeof v?.lng === 'number' ? v.lng : 0);
                      const accVal = typeof v?.location?.accuracy === 'number' ? Math.round(v.location.accuracy) : (typeof v?.accuracy === 'number' ? Math.round(v.accuracy) : 0);
                      const expAmt = v?.expenseAmount || 0;
                      const expDesc = v?.expenseDescription || '';
                      const isFirst = idx === 0;
                      const isLast = idx === visits.length - 1 && visits.length > 1;

                      return (
                        <div key={v?._id || idx} className={styles.visitItem} style={{
                          borderLeft: isFirst ? '3px solid #10b981' : isLast ? '3px solid #ef4444' : '3px solid #94a3b8',
                          paddingLeft: '0.75rem'
                        }}>
                          <div className={styles.visitHeader}>
                            <span className={styles.visitProject}>
                              {isFirst ? '🟢 ' : isLast ? '🔴 ' : '📍 '}{projName}
                            </span>
                            <span className={styles.visitTime}>{vTime}</span>
                          </div>
                          <div className={styles.visitDetails}>
                            <div>📍 {latVal.toFixed(4)}, {lngVal.toFixed(4)} | 📏 ±{accVal}m</div>
                            {expAmt > 0 && (
                              <div style={{color: 'var(--accent-1)', marginTop: '0.25rem'}}>💰 ₹{expAmt} {expDesc ? `(${expDesc})` : ''}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {visits.length === 0 && (
                      <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>
                        <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📷</div>
                        Submit your first site photo to start your attendance for today.
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
                {allVisits.filter(v => v?.photoUrl).length === 0 ? (
                  <p style={{color: 'var(--text-secondary)'}}>No photos found in your history.</p>
                ) : (
                  allVisits.filter(v => v?.photoUrl).map((v, idx) => (
                    <div key={idx} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
                      <img src={v.photoUrl} alt="Site" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.8rem', padding: '4px 8px' }}>
                        {v?.project?.name || v?.project?.title || 'Site Visit'} <br/> {v?.time || v?.createdAt ? new Date(v.time || v.createdAt).toLocaleDateString() : ''}
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
                    {allVisits.map((v, idx) => {
                      const projName = v?.project?.name || v?.project?.title || 'Site Visit';
                      const vTime = v?.time || v?.createdAt ? new Date(v.time || v.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Logged';
                      const latVal = typeof v?.location?.lat === 'number' ? v.location.lat : (typeof v?.lat === 'number' ? v.lat : 0);
                      const lngVal = typeof v?.location?.lng === 'number' ? v.location.lng : (typeof v?.lng === 'number' ? v.lng : 0);
                      const accVal = typeof v?.location?.accuracy === 'number' ? Math.round(v.location.accuracy) : (typeof v?.accuracy === 'number' ? Math.round(v.accuracy) : 0);
                      const expAmt = v?.expenseAmount || 0;
                      const expDesc = v?.expenseDescription || '';

                      return (
                        <div key={idx} className={styles.visitItem} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                          <div className={styles.visitHeader}>
                            <span className={styles.visitProject}>{projName}</span>
                            <span className={styles.visitTime}>{vTime}</span>
                          </div>
                          <div className={styles.visitDetails} style={{ marginTop: '0.5rem' }}>
                            <div>📍 Location: {latVal.toFixed(4)}, {lngVal.toFixed(4)} (Accuracy: {accVal}m)</div>
                            {expAmt > 0 && <div>💰 Exp: ₹{expAmt} {expDesc ? `- ${expDesc}` : ''}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'attendance' && (() => {
            // Build daily attendance from allVisits (always has data)
            const visitsByDay = {};
            for (const v of allVisits) {
              const date = (v.time || v.createdAt || '').split('T')[0];
              if (!date) continue;
              if (!visitsByDay[date]) visitsByDay[date] = [];
              visitsByDay[date].push(v);
            }

            // Merge with attendanceHistory from attendance table (has check-out times)
            const attByDay = {};
            for (const a of attendanceHistory) {
              const date = (a.date || '').split('T')[0];
              if (date) attByDay[date] = a;
            }

            // Build per-day records
            const dayRecords = Object.keys(visitsByDay).sort((a, b) => b.localeCompare(a)).map(date => {
              const dayVisits = visitsByDay[date] || [];
              const attRecord = attByDay[date];
              const sortedVisits = [...dayVisits].sort((a, b) => new Date(a.time || a.createdAt) - new Date(b.time || b.createdAt));
              const firstVisit = sortedVisits[0];
              const lastVisit = sortedVisits[sortedVisits.length - 1];

              const checkIn = attRecord?.checkInTime || firstVisit?.time || firstVisit?.createdAt;
              const checkOut = attRecord?.checkOutTime || (sortedVisits.length > 1 ? lastVisit?.time || lastVisit?.createdAt : null);
              
              let hours = attRecord?.totalWorkingHours || 0;
              if (!hours && checkIn && checkOut) {
                hours = Math.max(0, (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60));
              }

              const dayExpense = dayVisits.reduce((sum, v) => sum + (Number(v.expenseAmount) || 0), 0);
              const projectName = dayVisits[0]?.project?.name || dayVisits[0]?.project?.title || 'On-Site Visit';

              return { date, checkIn, checkOut, hours, dayExpense, projectName, photoCount: dayVisits.length };
            });

            // Monthly summary for current month
            const now = new Date();
            const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            const thisMonthRecords = dayRecords.filter(r => r.date.startsWith(currentMonthKey));
            const totalDays = thisMonthRecords.length;
            const totalHours = thisMonthRecords.reduce((s, r) => s + r.hours, 0);
            const totalExpense = thisMonthRecords.reduce((s, r) => s + r.dayExpense, 0);

            return (
              <div className={`${styles.fadeInUp}`}>
                {/* Monthly Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {[
                    { icon: '📅', label: 'Days Present', value: totalDays, sub: 'This month', color: '#3b82f6' },
                    { icon: '⏱', label: 'Total Hours', value: totalHours.toFixed(1) + ' hrs', sub: 'This month', color: '#10b981' },
                    { icon: '💰', label: 'Travel Expense', value: '₹' + totalExpense.toLocaleString('en-IN'), sub: 'This month', color: '#f59e0b' },
                    { icon: '📸', label: 'Photos Logged', value: thisMonthRecords.reduce((s, r) => s + r.photoCount, 0), sub: 'This month', color: '#8b5cf6' },
                  ].map((card, i) => (
                    <div key={i} style={{
                      background: 'var(--glass-bg)', border: '1px solid var(--border-color)',
                      borderRadius: '14px', padding: '1.25rem', textAlign: 'center',
                      borderTop: `3px solid ${card.color}`
                    }}>
                      <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{card.icon}</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: '800', color: card.color }}>{card.value}</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#0f172a', marginTop: '2px' }}>{card.label}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{card.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Today's Status Banner */}
                {(() => {
                  const todayKey = new Date().toISOString().split('T')[0];
                  const todayRec = dayRecords.find(r => r.date === todayKey);
                  if (!todayRec) return (
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245,158,11,0.3)',
                      borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem',
                      display: 'flex', alignItems: 'center', gap: '0.75rem'
                    }}>
                      <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                      <div>
                        <div style={{ fontWeight: '700', color: '#92400e' }}>Not checked in today</div>
                        <div style={{ fontSize: '0.85rem', color: '#b45309' }}>Go to Dashboard → submit a site photo to mark your attendance.</div>
                      </div>
                    </div>
                  );
                  return (
                    <div style={{
                      background: 'linear-gradient(135deg, #064e3b, #065f46)',
                      borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>✅</span>
                        <div>
                          <div style={{ fontWeight: '700', color: 'white', fontSize: '0.95rem' }}>Today's Attendance Active</div>
                          <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>{todayRec.photoCount} photo{todayRec.photoCount > 1 ? 's' : ''} logged</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>🟢 CHECK-IN</div>
                          <div style={{ fontWeight: '700', color: 'white', fontSize: '1rem' }}>
                            {todayRec.checkIn ? new Date(todayRec.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>🔴 CHECK-OUT</div>
                          <div style={{ fontWeight: '700', color: 'white', fontSize: '1rem' }}>
                            {todayRec.checkOut ? new Date(todayRec.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '🟡 Active'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>⏱ HOURS</div>
                          <div style={{ fontWeight: '700', color: 'white', fontSize: '1rem' }}>
                            {todayRec.hours > 0 ? todayRec.hours.toFixed(1) + 'h' : 'Active'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Full History Table */}
                <div className={styles.glassCard}>
                  <h2 className={styles.cardTitle}>📋 My Attendance History</h2>
                  {dayRecords.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📷</div>
                      <div style={{ fontWeight: '600' }}>No attendance records yet</div>
                      <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Submit site photos from the Dashboard to build your attendance history.</div>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Date</th>
                            <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Site / Project</th>
                            <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Check-In 🟢</th>
                            <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Check-Out 🔴</th>
                            <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Hours</th>
                            <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Travel ₹</th>
                            <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Photos</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dayRecords.map((rec, idx) => {
                            const isToday = rec.date === new Date().toISOString().split('T')[0];
                            const checkInStr = rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
                            const checkOutStr = rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
                            const hoursStr = rec.hours > 0 ? rec.hours.toFixed(1) + ' hrs' : (rec.checkIn && !rec.checkOut ? '🟡 Active' : '-');

                            return (
                              <tr key={idx} style={{
                                borderBottom: '1px solid var(--border-hairline)',
                                background: isToday ? 'rgba(16, 185, 129, 0.04)' : 'transparent',
                              }}>
                                <td style={{ padding: '12px 12px', fontWeight: isToday ? '700' : '500', color: '#0f172a', whiteSpace: 'nowrap' }}>
                                  {isToday && <span style={{ fontSize: '0.72rem', background: '#10b981', color: 'white', borderRadius: '4px', padding: '1px 5px', marginRight: '5px' }}>Today</span>}
                                  {new Date(rec.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td style={{ padding: '12px 12px', color: 'var(--text-secondary)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rec.projectName}</td>
                                <td style={{ padding: '12px 12px', color: '#10b981', fontWeight: '600' }}>🟢 {checkInStr}</td>
                                <td style={{ padding: '12px 12px', color: rec.checkOut ? '#ef4444' : '#94a3b8', fontWeight: '600' }}>
                                  {rec.checkOut ? `🔴 ${checkOutStr}` : '—'}
                                </td>
                                <td style={{ padding: '12px 12px', fontWeight: '700', color: rec.hours > 0 ? '#0f172a' : '#94a3b8' }}>{hoursStr}</td>
                                <td style={{ padding: '12px 12px', color: rec.dayExpense > 0 ? '#f59e0b' : 'var(--text-secondary)', fontWeight: rec.dayExpense > 0 ? '600' : '400' }}>
                                  {rec.dayExpense > 0 ? `₹${rec.dayExpense.toLocaleString('en-IN')}` : '—'}
                                </td>
                                <td style={{ padding: '12px 12px', color: 'var(--text-secondary)' }}>
                                  📸 {rec.photoCount}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          
          {activeTab === 'expenses' && (
            <div className={`${styles.glassCard} ${styles.fadeInUp}`}>
              <h2 className={styles.cardTitle}>My Travel Expenses</h2>
              <div style={{ marginTop: '1rem' }}>
                {allVisits.filter(v => (Number(v.expenseAmount) || 0) > 0).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💰</div>
                    <div style={{ fontWeight: '600' }}>No expenses logged yet.</div>
                    <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Add travel expense when logging site visits from the Dashboard.</div>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Date</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Project / Site</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Description</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Amount</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Approval Status</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Admin Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allVisits.filter(v => (Number(v.expenseAmount) || 0) > 0).map((v, idx) => {
                          const status = v.expenseStatus || 'Pending';
                          return (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                              <td style={{ padding: '12px 12px', fontWeight: '500', color: '#0f172a', whiteSpace: 'nowrap' }}>
                                {new Date(v.time || v.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </td>
                              <td style={{ padding: '12px 12px', color: 'var(--text-secondary)' }}>{v.project?.name || v.project?.title || 'Site Visit'}</td>
                              <td style={{ padding: '12px 12px' }}>{v.expenseDescription || 'Travel Expense'}</td>
                              <td style={{ padding: '12px 12px', fontWeight: '700', color: 'var(--accent-1)' }}>₹{v.expenseAmount}</td>
                              <td style={{ padding: '12px 12px' }}>
                                <span style={{
                                  padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '600',
                                  background: status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : status === 'Rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                  color: status === 'Approved' ? '#10b981' : status === 'Rejected' ? '#ef4444' : '#f59e0b'
                                }}>
                                  {status === 'Approved' ? '✅ Approved' : status === 'Rejected' ? '❌ Rejected' : '🟡 Pending'}
                                </span>
                              </td>
                              <td style={{ padding: '12px 12px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                                {v.expenseAdminComment || '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'leaves' && (
            <div className={`${styles.fadeInUp}`} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Apply for Leave Form Card */}
              <div className={styles.glassCard}>
                <h2 className={styles.cardTitle}><span>🏖️</span> Request Leave</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Submit a leave request in advance. Your management team will be notified immediately to review and approve.
                </p>

                <form onSubmit={handleSubmitLeave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Leave Date *</label>
                    <input
                      type="date"
                      className={styles.input}
                      value={leaveDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setLeaveDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                    <label className={styles.label}>Reason for Leave (Optional)</label>
                    <textarea
                      className={styles.input}
                      placeholder="e.g., Family event, Medical appointment, Personal work..."
                      value={leaveReason}
                      onChange={e => setLeaveReason(e.target.value)}
                      style={{ height: '70px', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <button
                      type="submit"
                      disabled={isSubmittingLeave}
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      style={{ width: 'auto', padding: '0.65rem 1.75rem', fontWeight: '700' }}
                    >
                      {isSubmittingLeave ? 'Submitting...' : '🚀 Submit Leave Request'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Leave Requests History Card */}
              <div className={styles.glassCard}>
                <h2 className={styles.cardTitle}><span>📋</span> My Leave History</h2>
                <div style={{ marginTop: '1rem' }}>
                  {leaves.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏖️</div>
                      <div style={{ fontWeight: '600' }}>No leave requests submitted yet.</div>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Leave Date</th>
                            <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Reason</th>
                            <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Admin Note</th>
                            <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>Applied On</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaves.map((leave, idx) => {
                            const status = leave.status || 'Pending';
                            return (
                              <tr key={leave.id || idx} style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                                <td style={{ padding: '12px 12px', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap' }}>
                                  📅 {new Date(leave.leaveDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td style={{ padding: '12px 12px', color: 'var(--text-secondary)' }}>{leave.reason || 'Personal'}</td>
                                <td style={{ padding: '12px 12px' }}>
                                  <span style={{
                                    padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '600',
                                    background: status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : status === 'Rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                    color: status === 'Approved' ? '#10b981' : status === 'Rejected' ? '#ef4444' : '#f59e0b'
                                  }}>
                                    {status === 'Approved' ? '✅ Approved' : status === 'Rejected' ? '❌ Rejected' : '🟡 Pending'}
                                  </span>
                                </td>
                                <td style={{ padding: '12px 12px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                                  {leave.adminComment || '-'}
                                </td>
                                <td style={{ padding: '12px 12px', color: 'var(--text-secondary)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                                  {leave.createdAt ? new Date(leave.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '-'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
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
