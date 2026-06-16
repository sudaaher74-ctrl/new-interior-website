import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data States
  const [stats, setStats] = useState({ totalProjects: '-', activeProjects: '-', totalEmployees: '-', siteVisitsToday: '-' });
  const [siteVisits, setSiteVisits] = useState([]);
  const [leads, setLeads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  // UI States
  const [currentDate, setCurrentDate] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const API_URL = window.API_CONFIG?.BASE_URL || '/api';

  useEffect(() => {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString(undefined, dateOptions));
    
    let token = localStorage.getItem('token');
    if (!token || token === 'dummy_token') {
      token = 'dummy_admin_token';
      localStorage.setItem('token', token); 
    }

    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      
      // 1. Stats
      try {
        const resStats = await axios.get(`${API_URL}/v2/admin/stats`, { headers });
        setStats(resStats.data);
      } catch(e) {}

      // 2. Live Tracking (Site Visits)
      try {
        const resVisits = await axios.get(`${API_URL}/v2/site-visits/all`, { headers });
        console.log("Fetched visits length:", resVisits.data.length);
        setSiteVisits(resVisits.data);
      } catch(e) {
        console.error("Failed to fetch site visits:", e);
      }

      // 3. Leads
      try {
        const resLeads = await axios.get(`${API_URL}/v2/leads`, { headers });
        setLeads(resLeads.data);
      } catch(e) {
        // Fallback for leads if v2 doesn't exist
        try {
          const resLeadsOld = await axios.get(`${API_URL}/leads`, { headers });
          setLeads(resLeadsOld.data);
        } catch(e2) {}
      }

      // 4. Projects
      try {
        const resProjects = await axios.get(`${API_URL}/v2/projects`, { headers });
        setProjects(resProjects.data);
      } catch(e) {}

      // 5. Employees
      try {
        const resEmployees = await axios.get(`${API_URL}/v2/admin/employees`, { headers });
        setEmployees(resEmployees.data);
      } catch(e) {}
      
    } catch (error) {
      console.error("Fetch data error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const renderDashboardTab = () => (
    <div className={`${styles.fadeInUp} ${styles.delay1}`}>
      <div className={styles.statsGrid}>
        <div className={styles.glassCard}>
          <div className={styles.cardTitle}>Total Projects</div>
          <div className={styles.statValue}>{stats.totalProjects}</div>
        </div>
        <div className={styles.glassCard}>
          <div className={styles.cardTitle}>Active Projects</div>
          <div className={styles.statValue}>{stats.activeProjects}</div>
        </div>
        <div className={styles.glassCard}>
          <div className={styles.cardTitle}>Site Visits Today</div>
          <div className={styles.statValue}>{stats.siteVisitsToday}</div>
        </div>
        <div className={styles.glassCard}>
          <div className={styles.cardTitle}>Total Employees</div>
          <div className={styles.statValue}>{stats.totalEmployees}</div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h2 className={styles.pageTitle} style={{fontSize: '1.5rem'}}>Recent Site Activity</h2>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Site</th>
              <th>Check-In Time</th>
              <th>Photo</th>
            </tr>
          </thead>
          <tbody>
            {siteVisits.slice(0, 5).map((visit) => (
              <tr key={visit._id}>
                <td style={{fontWeight: '500'}}>{visit.user?.fullName || 'Demo Employee'}</td>
                <td>{visit.project?.name || visit.project?.title || 'Unknown'}</td>
                <td>{new Date(visit.time).toLocaleString()}</td>
                <td>
                  {visit.photoUrl ? (
                    <button onClick={() => setSelectedPhoto(visit.photoUrl)} className={`${styles.btn} ${styles.btnSecondary}`} style={{padding: '0.25rem 0.5rem', fontSize: '0.8rem'}}>📸 View</button>
                  ) : '-'}
                </td>
              </tr>
            ))}
            {siteVisits.length === 0 && (
              <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No recent activity.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTrackingTab = () => (
    <div className={`${styles.tableContainer} ${styles.fadeInUp} ${styles.delay1}`}>
      <div className={styles.tableHeader}>
        <h2 className={styles.pageTitle} style={{fontSize: '1.5rem'}}>Live Tracking Map Data</h2>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Site</th>
            <th>Location</th>
            <th>Check-In Time</th>
            <th>Snapshot</th>
          </tr>
        </thead>
        <tbody>
          {siteVisits.map((visit) => (
            <tr key={visit._id}>
              <td style={{fontWeight: '500'}}>{visit.user?.fullName || 'Demo Employee'}</td>
              <td>{visit.project?.name || visit.project?.title || 'Unknown Project'}</td>
              <td>
                {visit.location?.lat ? (
                  <a href={`https://www.google.com/maps?q=${visit.location.lat},${visit.location.lng}`} target="_blank" rel="noreferrer" style={{color: 'var(--accent-1)', textDecoration: 'underline'}}>
                    📍 Open Maps
                  </a>
                ) : 'No GPS'}
              </td>
              <td>{new Date(visit.time).toLocaleString()}</td>
              <td>
                {visit.photoUrl ? (
                  <button onClick={() => setSelectedPhoto(visit.photoUrl)} className={`${styles.btn} ${styles.btnSecondary}`} style={{padding: '0.25rem 0.5rem', fontSize: '0.8rem'}}>📸 View Selfie</button>
                ) : 'No Photo'}
              </td>
            </tr>
          ))}
          {siteVisits.length === 0 && (
            <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No tracking data available.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderLeadsTab = () => (
    <div className={`${styles.tableContainer} ${styles.fadeInUp} ${styles.delay1}`}>
      <div className={styles.tableHeader}>
        <h2 className={styles.pageTitle} style={{fontSize: '1.5rem'}}>Lead Generation</h2>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Project Type</th>
            <th>Message</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td style={{fontWeight: '500'}}>{lead.name}</td>
              <td>{lead.contact || lead.email || lead.phone}</td>
              <td>{lead.projectType || lead.serviceRequested || '-'}</td>
              <td style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{lead.message}</td>
              <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
              <td><span className={styles.badge} style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6'}}>{lead.status || 'New'}</span></td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No leads found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderProjectsTab = () => (
    <div className={`${styles.tableContainer} ${styles.fadeInUp} ${styles.delay1}`}>
      <div className={styles.tableHeader}>
        <h2 className={styles.pageTitle} style={{fontSize: '1.5rem'}}>Projects Management</h2>
        <button className={`${styles.btn} ${styles.btnPrimary}`} style={{width: 'auto', padding: '0.5rem 1rem'}}>+ Add Project</button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Location</th>
            <th>Budget</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((proj) => (
            <tr key={proj._id}>
              <td style={{fontWeight: '500'}}>{proj.title || proj.name}</td>
              <td>{proj.category || proj.type || '-'}</td>
              <td>{proj.location || '-'}</td>
              <td>{proj.budget ? `₹${proj.budget}` : '-'}</td>
              <td><span className={styles.badge}>{proj.status || 'Active'}</span></td>
            </tr>
          ))}
          {projects.length === 0 && (
            <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No projects found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderEmployeesTab = () => (
    <div className={`${styles.tableContainer} ${styles.fadeInUp} ${styles.delay1}`}>
      <div className={styles.tableHeader}>
        <h2 className={styles.pageTitle} style={{fontSize: '1.5rem'}}>Employees Management</h2>
        <button className={`${styles.btn} ${styles.btnPrimary}`} style={{width: 'auto', padding: '0.5rem 1rem'}}>+ Add Employee</button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee Name</th>
            <th>Contact</th>
            <th>Designation</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.employeeId || emp._id.substring(0, 6)}</td>
              <td style={{fontWeight: '500'}}>{emp.fullName || emp.name}</td>
              <td>{emp.email || emp.mobileNumber || '-'}</td>
              <td>{emp.designation || emp.role}</td>
            </tr>
          ))}
          {employees.length === 0 && (
            <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No employees found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={styles.portalWrapper}>
      {/* Ambient Glow Effects */}
      <div className={`${styles.bgGlow} ${styles.bgGlow1}`}></div>
      <div className={`${styles.bgGlow} ${styles.bgGlow2}`}></div>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.brand}>OS Admin.</div>
          
          <nav className={styles.navMenu}>
            <button className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.active : ''}`} onClick={() => setActiveTab('dashboard')}><span>📊</span> Dashboard</button>
            <button className={`${styles.navItem} ${activeTab === 'tracking' ? styles.active : ''}`} onClick={() => setActiveTab('tracking')}><span>📍</span> Live Tracking</button>
            <button className={`${styles.navItem} ${activeTab === 'leads' ? styles.active : ''}`} onClick={() => setActiveTab('leads')}><span>🎯</span> Leads</button>
            <button className={`${styles.navItem} ${activeTab === 'projects' ? styles.active : ''}`} onClick={() => setActiveTab('projects')}><span>🏗️</span> Projects</button>
            <button className={`${styles.navItem} ${activeTab === 'employees' ? styles.active : ''}`} onClick={() => setActiveTab('employees')}><span>👥</span> Employees</button>
          </nav>

          <div className={styles.userProfile}>
            <div className={styles.avatar}>A</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>Super Admin</span>
              <span className={styles.userRole}>Management</span>
            </div>
            <button className={styles.logoutBtn} title="Logout" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <header className={styles.header}>
            <h1 className={styles.pageTitle} style={{textTransform: 'capitalize'}}>{activeTab.replace('-', ' ')}</h1>
            <div className={styles.dateDisplay}>{currentDate}</div>
          </header>

          {activeTab === 'dashboard' && renderDashboardTab()}
          {activeTab === 'tracking' && renderTrackingTab()}
          {activeTab === 'leads' && renderLeadsTab()}
          {activeTab === 'projects' && renderProjectsTab()}
          {activeTab === 'employees' && renderEmployeesTab()}
          
        </main>
      </div>

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', zIndex: 9999, backdropFilter: 'blur(10px)'}}>
          <div className={styles.glassCard} style={{maxWidth: '600px', width: '90%', padding: '1rem', position: 'relative'}}>
            <span style={{position: 'absolute', top: '15px', right: '20px', fontSize: '2rem', cursor: 'pointer', color: 'var(--text-primary)'}} onClick={() => setSelectedPhoto(null)}>&times;</span>
            <h3 className={styles.cardTitle} style={{marginBottom: '1.5rem'}}>Live Site Verification</h3>
            <img src={selectedPhoto} alt="Employee Verification" style={{width: '100%', borderRadius: '12px', objectFit: 'contain', maxHeight: '70vh'}} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
