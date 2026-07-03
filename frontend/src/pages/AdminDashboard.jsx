import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
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
  
  const [currentDate, setCurrentDate] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ fullName: '', email: '', password: '', mobileNumber: '', designation: '' });
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', clientName: '', siteAddress: '', status: 'Planning', budget: '' });
  const [editingProject, setEditingProject] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedTrackingEmployee, setSelectedTrackingEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleExportCSV = (data, filename) => {
    if (!data || data.length === 0) {
      toast.error('No data to export.');
      return;
    }
    const headers = Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object' && k !== '__v');
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header] ? row[header].toString().replace(/"/g, '""') : '';
        return `"${val}"`;
      });
      csvRows.push(values.join(','));
    }
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${filename}.csv`);
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success(`${filename}.csv exported successfully!`);
  };

  const API_URL = window.API_CONFIG?.BASE_URL || '/api';

  useEffect(() => {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString(undefined, dateOptions));
    
    let token = localStorage.getItem('token');
    if (!token || token === 'dummy_token' || token === 'dummy_admin_token') {
      token = 'dummy_admin_token';
      localStorage.setItem('token', token);
    }

    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

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

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.post(`${API_URL}/v2/admin/employees`, newEmployee, { headers });
      setShowAddEmployeeModal(false);
      setNewEmployee({ fullName: '', email: '', password: '', mobileNumber: '', designation: '' });
      toast.success('Employee added successfully!');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add employee: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleUpdateLeadStatus = async (leadId, status) => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.put(`${API_URL}/v2/leads/${leadId}/status`, { status }, { headers });
      toast.success('Lead status updated!');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update lead status: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.post(`${API_URL}/v2/projects`, newProject, { headers });
      setShowAddProjectModal(false);
      setNewProject({ name: '', clientName: '', siteAddress: '', status: 'Planning', budget: '' });
      toast.success('Project added successfully!');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add project: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleEditProject = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.put(`${API_URL}/v2/projects/${editingProject._id}`, editingProject, { headers });
      setEditingProject(null);
      toast.success('Project updated successfully!');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to edit project: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.delete(`${API_URL}/v2/projects/${id}`, { headers });
      toast.success('Project deleted successfully!');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete project: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleEditEmployee = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.put(`${API_URL}/v2/admin/employees/${editingEmployee._id}`, editingEmployee, { headers });
      setEditingEmployee(null);
      toast.success('Employee updated successfully!');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to edit employee: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.delete(`${API_URL}/v2/admin/employees/${id}`, { headers });
      toast.success('Employee deleted successfully!');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete employee: ' + (err.response?.data?.msg || err.message));
    }
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
                <td style={{fontWeight: '500'}}>{visit.user?.fullName || 'Unknown User'}</td>
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

  const renderTrackingTab = () => {
    if (!selectedTrackingEmployee) {
      return (
        <div className={`${styles.tableContainer} ${styles.fadeInUp} ${styles.delay1}`}>
          <div className={styles.tableHeader}>
            <h2 className={styles.pageTitle} style={{fontSize: '1.5rem'}}>Select Employee to View Tracking</h2>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Designation</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td style={{fontWeight: '500'}}>{emp.fullName || emp.name}</td>
                  <td>{emp.designation || emp.role}</td>
                  <td>
                    <button 
                      onClick={() => setSelectedTrackingEmployee(emp)} 
                      className={`${styles.btn} ${styles.btnPrimary}`} 
                      style={{padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto'}}
                    >
                      View Live Data
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr><td colSpan="3" style={{textAlign: 'center', padding: '2rem'}}>No employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }

    const employeeVisits = siteVisits.filter(visit => {
      const visitUserId = visit.user?._id || visit.user;
      return visitUserId === selectedTrackingEmployee._id;
    });

    return (
      <div className={`${styles.tableContainer} ${styles.fadeInUp} ${styles.delay1}`}>
        <div className={styles.tableHeader}>
          <h2 className={styles.pageTitle} style={{fontSize: '1.5rem'}}>
            Tracking: {selectedTrackingEmployee.fullName || selectedTrackingEmployee.name}
          </h2>
          <button 
            className={`${styles.btn} ${styles.btnSecondary}`} 
            style={{width: 'auto', padding: '0.5rem 1rem'}} 
            onClick={() => setSelectedTrackingEmployee(null)}
          >
            ← Back to Employees
          </button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Site</th>
              <th>Location</th>
              <th>Check-In Time</th>
              <th>Expenses</th>
            </tr>
          </thead>
          <tbody>
            {employeeVisits.map((visit) => (
              <tr key={visit._id}>
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
                  {visit.expenseAmount ? (
                    <div style={{fontSize: '0.9rem'}}>
                      <strong style={{color: 'var(--accent-2)'}}>₹{visit.expenseAmount}</strong>
                      <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>{visit.expenseDescription}</div>
                    </div>
                  ) : '-'}
                </td>
              </tr>
            ))}
            {employeeVisits.length === 0 && (
              <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No tracking data available for this employee.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderLeadsTab = () => {
    const filteredLeads = leads.filter(l => 
      (l.name && l.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.projectType && l.projectType.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    return (
    <div className={`${styles.tableContainer} ${styles.fadeInUp} ${styles.delay1}`}>
      <div className={styles.tableHeader} style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className={styles.pageTitle} style={{fontSize: '1.5rem', margin: 0}}>Lead Generation</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search leads..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
          />
          <button className={`${styles.btn} ${styles.btnSecondary}`} style={{width: 'auto', padding: '0.4rem 0.8rem'}} onClick={() => handleExportCSV(filteredLeads, 'leads')}>Export CSV</button>
        </div>
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
          {filteredLeads.map((lead) => (
            <tr key={lead._id}>
              <td style={{fontWeight: '500'}}>{lead.name}</td>
              <td>{lead.contact || lead.email || lead.phone}</td>
              <td>{lead.projectType || lead.serviceRequested || '-'}</td>
              <td style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{lead.message}</td>
              <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
              <td>
                <select 
                  value={lead.status || 'New'}
                  onChange={(e) => handleUpdateLeadStatus(lead._id, e.target.value)}
                  style={{padding: '0.25rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer'}}
                >
                  <option value="New" style={{color: 'black'}}>New</option>
                  <option value="Contacted" style={{color: 'black'}}>Contacted</option>
                  <option value="Converted" style={{color: 'black'}}>Converted</option>
                  <option value="Closed" style={{color: 'black'}}>Closed</option>
                </select>
              </td>
            </tr>
          ))}
          {filteredLeads.length === 0 && (
            <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No leads found matching "{searchQuery}".</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
  };

  const renderProjectsTab = () => {
    const filteredProjects = projects.filter(p => 
      (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
    <div className={`${styles.tableContainer} ${styles.fadeInUp} ${styles.delay1}`}>
      <div className={styles.tableHeader} style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className={styles.pageTitle} style={{fontSize: '1.5rem', margin: 0}}>Projects Management</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
          />
          <button className={`${styles.btn} ${styles.btnSecondary}`} style={{width: 'auto', padding: '0.4rem 0.8rem'}} onClick={() => handleExportCSV(filteredProjects, 'projects')}>Export CSV</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} style={{width: 'auto', padding: '0.4rem 0.8rem'}} onClick={() => setShowAddProjectModal(true)}>+ Add Project</button>
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Location</th>
            <th>Budget</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((proj) => (
            <tr key={proj._id}>
              <td style={{fontWeight: '500'}}>{proj.title || proj.name}</td>
              <td>{proj.category || proj.type || '-'}</td>
              <td>{proj.location || '-'}</td>
              <td>{proj.budget ? `₹${proj.budget}` : '-'}</td>
              <td><span className={styles.badge}>{proj.status || 'Active'}</span></td>
              <td>
                <button onClick={() => setEditingProject(proj)} style={{marginRight: '0.5rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer'}}>Edit</button>
                <button onClick={() => handleDeleteProject(proj._id)} style={{padding: '0.25rem 0.5rem', background: 'rgba(239, 68, 68, 0.2)', border: 'none', borderRadius: '4px', color: '#ef4444', cursor: 'pointer'}}>Delete</button>
              </td>
            </tr>
          ))}
          {filteredProjects.length === 0 && (
            <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No projects found matching "{searchQuery}".</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
  };

  const renderEmployeesTab = () => {
    const filteredEmployees = employees.filter(e => 
      (e.fullName && e.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.name && e.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.designation && e.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.employeeId && e.employeeId.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
    <div className={`${styles.tableContainer} ${styles.fadeInUp} ${styles.delay1}`}>
      <div className={styles.tableHeader} style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className={styles.pageTitle} style={{fontSize: '1.5rem', margin: 0}}>Employees Management</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search employees..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
          />
          <button className={`${styles.btn} ${styles.btnSecondary}`} style={{width: 'auto', padding: '0.4rem 0.8rem'}} onClick={() => handleExportCSV(filteredEmployees, 'employees')}>Export CSV</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} style={{width: 'auto', padding: '0.4rem 0.8rem'}} onClick={() => setShowAddEmployeeModal(true)}>+ Add Employee</button>
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee Name</th>
            <th>Contact</th>
            <th>Designation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.employeeId || emp._id.substring(0, 6)}</td>
              <td style={{fontWeight: '500'}}>{emp.fullName || emp.name}</td>
              <td>{emp.email || emp.mobileNumber || '-'}</td>
              <td>{emp.designation || emp.role}</td>
              <td>
                <button onClick={() => setEditingEmployee(emp)} style={{marginRight: '0.5rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer'}}>Edit</button>
                <button onClick={() => handleDeleteEmployee(emp._id)} style={{padding: '0.25rem 0.5rem', background: 'rgba(239, 68, 68, 0.2)', border: 'none', borderRadius: '4px', color: '#ef4444', cursor: 'pointer'}}>Delete</button>
              </td>
            </tr>
          ))}
          {filteredEmployees.length === 0 && (
            <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No employees found matching "{searchQuery}".</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
  };

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

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', zIndex: 9999, backdropFilter: 'blur(10px)'}}>
          <div className={styles.glassCard} style={{maxWidth: '500px', width: '90%', padding: '2rem', position: 'relative'}}>
            <span style={{position: 'absolute', top: '15px', right: '20px', fontSize: '2rem', cursor: 'pointer', color: 'var(--text-primary)'}} onClick={() => setShowAddEmployeeModal(false)}>&times;</span>
            <h3 className={styles.cardTitle} style={{marginBottom: '1.5rem'}}>Add New Employee</h3>
            <form onSubmit={handleAddEmployee} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Full Name</label>
                <input type="text" required value={newEmployee.fullName} onChange={e => setNewEmployee({...newEmployee, fullName: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Email</label>
                <input type="email" required value={newEmployee.email} onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Password</label>
                <input type="password" required value={newEmployee.password} onChange={e => setNewEmployee({...newEmployee, password: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Mobile Number</label>
                <input type="tel" required value={newEmployee.mobileNumber} onChange={e => setNewEmployee({...newEmployee, mobileNumber: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Designation</label>
                <input type="text" value={newEmployee.designation} onChange={e => setNewEmployee({...newEmployee, designation: e.target.value})} placeholder="e.g. Site Engineer" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white'}} />
              </div>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} style={{marginTop: '1rem'}}>Save Employee</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', zIndex: 9999, backdropFilter: 'blur(10px)'}}>
          <div className={styles.glassCard} style={{maxWidth: '500px', width: '90%', padding: '2rem', position: 'relative'}}>
            <span style={{position: 'absolute', top: '15px', right: '20px', fontSize: '2rem', cursor: 'pointer', color: 'var(--text-primary)'}} onClick={() => setShowAddProjectModal(false)}>&times;</span>
            <h3 className={styles.cardTitle} style={{marginBottom: '1.5rem'}}>Add New Project</h3>
            <form onSubmit={handleAddProject} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Project Name</label>
                <input type="text" required value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Client Name</label>
                <input type="text" value={newProject.clientName} onChange={e => setNewProject({...newProject, clientName: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Site Address</label>
                <input type="text" value={newProject.siteAddress} onChange={e => setNewProject({...newProject, siteAddress: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Status</label>
                <select value={newProject.status} onChange={e => setNewProject({...newProject, status: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white'}}>
                  <option value="Planning">Planning</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} style={{marginTop: '1rem'}}>Save Project</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', zIndex: 9999, backdropFilter: 'blur(10px)'}}>
          <div className={styles.glassCard} style={{maxWidth: '500px', width: '90%', padding: '2rem', position: 'relative'}}>
            <span style={{position: 'absolute', top: '15px', right: '20px', fontSize: '2rem', cursor: 'pointer', color: 'var(--text-primary)'}} onClick={() => setEditingProject(null)}>&times;</span>
            <h3 className={styles.cardTitle} style={{marginBottom: '1.5rem'}}>Edit Project</h3>
            <form onSubmit={handleEditProject} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Project Name</label>
                <input type="text" required value={editingProject.title || editingProject.name} onChange={e => setEditingProject({...editingProject, name: e.target.value, title: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Client Name</label>
                <input type="text" value={editingProject.clientName || ''} onChange={e => setEditingProject({...editingProject, clientName: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Site Address</label>
                <input type="text" value={editingProject.siteAddress || editingProject.location || ''} onChange={e => setEditingProject({...editingProject, siteAddress: e.target.value, location: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Status</label>
                <select value={editingProject.status || 'Planning'} onChange={e => setEditingProject({...editingProject, status: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white'}}>
                  <option value="Planning">Planning</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} style={{marginTop: '1rem'}}>Update Project</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', zIndex: 9999, backdropFilter: 'blur(10px)'}}>
          <div className={styles.glassCard} style={{maxWidth: '500px', width: '90%', padding: '2rem', position: 'relative'}}>
            <span style={{position: 'absolute', top: '15px', right: '20px', fontSize: '2rem', cursor: 'pointer', color: 'var(--text-primary)'}} onClick={() => setEditingEmployee(null)}>&times;</span>
            <h3 className={styles.cardTitle} style={{marginBottom: '1.5rem'}}>Edit Employee</h3>
            <form onSubmit={handleEditEmployee} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Full Name</label>
                <input type="text" required value={editingEmployee.fullName || editingEmployee.name || ''} onChange={e => setEditingEmployee({...editingEmployee, fullName: e.target.value, name: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Email</label>
                <input type="email" required value={editingEmployee.email || ''} onChange={e => setEditingEmployee({...editingEmployee, email: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>New Password (leave blank to keep current)</label>
                <input type="password" value={editingEmployee.password || ''} onChange={e => setEditingEmployee({...editingEmployee, password: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Mobile Number</label>
                <input type="tel" required value={editingEmployee.mobileNumber || ''} onChange={e => setEditingEmployee({...editingEmployee, mobileNumber: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Designation</label>
                <input type="text" value={editingEmployee.designation || ''} onChange={e => setEditingEmployee({...editingEmployee, designation: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white'}} />
              </div>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} style={{marginTop: '1rem'}}>Update Employee</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
