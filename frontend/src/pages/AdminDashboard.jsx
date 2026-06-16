import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [siteVisits, setSiteVisits] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const API_URL = window.API_CONFIG?.BASE_URL || '/api';

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const token = localStorage.getItem('token') || 'dummy_token';
        const res = await axios.get(`${API_URL}/v2/site-visits/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSiteVisits(res.data);
      } catch (err) {
        console.error("Failed to fetch site visits", err);
      }
    };
    fetchVisits();
    const interval = setInterval(fetchVisits, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
  <aside className="sidebar">
    <div className="brand">OS Interior</div>
    <ul className="nav-links">
      <li><a href="#" className="active" >Dashboard</a></li>
      <li><a href="#" >Live Tracking</a></li>
      <li><a href="#" >Leads</a></li>
      <li><a href="#" >Projects</a></li>
      <li><a href="#" >Employees</a></li>
    </ul>
  </aside>

  <main className="main-content">
    <header className="topbar">
      <h2>Welcome, Admin</h2>
      <button className="logout-btn" >Logout</button>
    </header>

    <div className="dashboard-container">
      
      {/* DASHBOARD TAB */}
      <div id="panel-dashboard" className="tab-panel active">
        <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Total Projects</div>
          <div className="stat-value" id="statProjects">-</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Active Projects</div>
          <div className="stat-value" id="statActiveProjects">-</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">On Site Today</div>
          <div className="stat-value" id="statOnSite">-</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Absent Today</div>
          <div className="stat-value" style={{color: 'var(--danger)'}} id="statAbsent">-</div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Live Employee Tracking</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Site</th>
              <th>Location</th>
              <th>Check-In Time</th>
              <th>Photo</th>
            </tr>
          </thead>
          <tbody id="trackingTableBody">
            {siteVisits.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign: 'center'}}>Loading data or no visits logged yet...</td></tr>
            ) : (
              siteVisits.map((visit) => (
                <tr key={visit._id}>
                  <td style={{fontWeight: '500'}}>{visit.user?.fullName || 'Unknown User'}</td>
                  <td>{visit.project?.name || visit.project?.title || 'Unknown Project'}</td>
                  <td>
                    {visit.location?.lat ? (
                      <a 
                        href={`https://www.google.com/maps?q=${visit.location.lat},${visit.location.lng}`} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{color: 'var(--primary)', textDecoration: 'underline'}}
                      >
                        📍 View Map
                      </a>
                    ) : 'No GPS Data'}
                  </td>
                  <td>{new Date(visit.time).toLocaleString()}</td>
                  <td>
                    {visit.photoUrl ? (
                      <button 
                        onClick={() => setSelectedPhoto(visit.photoUrl)} 
                        className="btn btn-secondary"
                        style={{padding: '0.25rem 0.5rem', fontSize: '0.8rem'}}
                      >
                        📸 View Selfie
                      </button>
                    ) : 'No Photo'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="table-container">
        <div className="table-header">
          <h2>Active Projects</h2>
          <button className="btn">Add Project</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Client</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="projectsTableBody">
            <tr><td colSpan="3" style={{textAlign: 'center'}}>Loading data...</td></tr>
          </tbody>
        </table>
        </div>
      </div> {/* End Dashboard Tab */}

      {/* LIVE TRACKING TAB */}
      <div id="panel-tracking" className="tab-panel">
        <div className="table-container">
          <div className="table-header">
            <h2>Employee Photo Locations Map</h2>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>All map views are linked directly on the dashboard table.</p>
          </div>
          <div id="map" style={{height: '500px', borderRadius: '8px', border: '1px solid var(--border-color)', zIndex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa'}}>
            <p style={{color: 'var(--text-muted)'}}>Map plugin placeholder. Click "View Map" in the Live Tracking table to open coordinates in Google Maps.</p>
          </div>
        </div>
      </div>

      {/* LEADS TAB */}
      <div id="panel-leads" className="tab-panel">
        <div className="table-container">
          <div className="table-header">
            <h2>Lead Generation (Contact Form)</h2>
          </div>
          <table>
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
            <tbody id="leadsTableBody">
              <tr><td colSpan="6" style={{textAlign: 'center'}}>Loading leads...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* PROJECTS TAB */}
      <div id="panel-projects" className="tab-panel">
        <div className="table-container">
          <div className="table-header">
            <h2>Projects Management</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Budget</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="adminProjectsTableBody">
              <tr><td colSpan="6" style={{textAlign: 'center'}}>Loading projects...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* EMPLOYEES TAB */}
      <div id="panel-employees" className="tab-panel">
        <div className="table-container">
          <div className="table-header">
            <h2>Employees Management</h2>
            <button className="btn btn-primary" >+ Add Employee</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Email / Mobile</th>
                <th>Designation</th>
              </tr>
            </thead>
            <tbody id="employeesTableBody">
              <tr><td colSpan="4" style={{textAlign: 'center'}}>Loading employees...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </main>

  {/* Photo Preview Modal */}
  {selectedPhoto && (
    <div className="modal" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)'}}>
      <div className="modal-content" style={{maxWidth: '600px', padding: '1rem', background: '#fff', borderRadius: '8px', position: 'relative'}}>
        <span className="close-btn" style={{position: 'absolute', top: '10px', right: '15px', fontSize: '1.5rem', cursor: 'pointer'}} onClick={() => setSelectedPhoto(null)}>&times;</span>
        <h3 style={{marginBottom: '1rem'}}>Employee Check-in Selfie</h3>
        <img src={selectedPhoto} alt="Employee Verification" style={{width: '100%', borderRadius: '8px', objectFit: 'contain', maxHeight: '70vh'}} />
      </div>
    </div>
  )}

  {/* Add Employee Modal */}
  <div id="addEmployeeModal" className="modal">
    <div className="modal-content" style={{maxWidth: '500px'}}>
      <span className="close-btn" >&times;</span>
      <h3>Create New Employee</h3>
      <form id="addEmployeeForm"  style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
        <div>
          <label style={{fontWeight: '500', fontSize: '0.9rem'}}>Full Name</label>
          <input type="text" id="empName" required style={{width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', marginTop: '0.25rem'}} />
        </div>
        <div>
          <label style={{fontWeight: '500', fontSize: '0.9rem'}}>Email Address</label>
          <input type="email" id="empEmail" required style={{width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', marginTop: '0.25rem'}} />
        </div>
        <div>
          <label style={{fontWeight: '500', fontSize: '0.9rem'}}>Password</label>
          <input type="password" id="empPassword" required style={{width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', marginTop: '0.25rem'}} />
        </div>
        <div>
          <label style={{fontWeight: '500', fontSize: '0.9rem'}}>Mobile Number</label>
          <input type="text" id="empMobile" required style={{width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', marginTop: '0.25rem'}} />
        </div>
        <div>
          <label style={{fontWeight: '500', fontSize: '0.9rem'}}>Designation</label>
          <input type="text" id="empDesignation" required style={{width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', marginTop: '0.25rem'}} />
        </div>
        <button type="submit" className="btn btn-primary" style={{marginTop: '0.5rem'}}>Create Employee</button>
      </form>
    </div>
  </div>

  {/* Employee Details Modal */}
  <div id="employeeModal" className="modal">
    <div className="modal-content" style={{maxWidth: '500px'}}>
      <span className="close-btn" >&times;</span>
      <h3 id="empModalName">Employee Details</h3>
      <div id="empModalContent" style={{marginTop: '1rem', fontSize: '0.95rem'}}></div>
    </div>
  </div>

  {/* Edit Project Modal */}
  <div id="editProjectModal" className="modal">
    <div className="modal-content" style={{maxWidth: '600px'}}>
      <span className="close-btn" >&times;</span>
      <h3>Edit Project</h3>
      <form id="editProjectForm"  style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
        <input type="hidden" id="editProjectId" />
        
        <div>
          <label style={{fontWeight: '500', fontSize: '0.9rem'}}>Title</label>
          <input type="text" id="editProjectTitle" required style={{width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', marginTop: '0.25rem'}} />
        </div>
        
        <div style={{display: 'flex', gap: '1rem'}}>
          <div style={{flex: '1'}}>
            <label style={{fontWeight: '500', fontSize: '0.9rem'}}>Category</label>
            <input type="text" id="editProjectCategory" style={{width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', marginTop: '0.25rem'}} />
          </div>
          <div style={{flex: '1'}}>
            <label style={{fontWeight: '500', fontSize: '0.9rem'}}>Budget</label>
            <input type="text" id="editProjectBudget" style={{width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', marginTop: '0.25rem'}} />
          </div>
        </div>

        <div>
          <label style={{fontWeight: '500', fontSize: '0.9rem'}}>Location</label>
          <input type="text" id="editProjectLocation" style={{width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', marginTop: '0.25rem'}} />
        </div>

        <div>
          <label style={{fontWeight: '500', fontSize: '0.9rem'}}>Cover Image Path</label>
          <input type="text" id="editProjectCover" style={{width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', marginTop: '0.25rem'}} />
        </div>

        <div>
          <label style={{fontWeight: '500', fontSize: '0.9rem'}}>Description</label>
          <textarea id="editProjectDesc" rows="4" style={{width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', marginTop: '0.25rem'}}></textarea>
        </div>

        <button type="submit" className="btn" style={{marginTop: '0.5rem'}}>Save Changes</button>
      </form>
    </div>
  </div>

  
    </>
  );
};

export default AdminDashboard;
