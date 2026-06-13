import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
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
          <button className="btn" >View Map Fullscreen</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Site</th>
              <th>Location</th>
              <th>Check-In Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="trackingTableBody">
            <tr><td colspan="5" style={{textAlign: 'center'}}>Loading data...</td></tr>
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
            <tr><td colspan="3" style={{textAlign: 'center'}}>Loading data...</td></tr>
          </tbody>
        </table>
        </div>
      </div> {/* End Dashboard Tab */}

      {/* LIVE TRACKING TAB */}
      <div id="panel-tracking" className="tab-panel">
        <div className="table-container">
          <div className="table-header">
            <h2>Employee Photo Locations Map</h2>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Click on any marker to view employee check-in selfie and details.</p>
          </div>
          <div id="map" style={{height: '500px', borderRadius: '8px', border: '1px solid var(--border-color)', zIndex: '1'}}></div>
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
              <tr><td colspan="6" style={{textAlign: 'center'}}>Loading leads...</td></tr>
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
              <tr><td colspan="6" style={{textAlign: 'center'}}>Loading projects...</td></tr>
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
              <tr><td colspan="4" style={{textAlign: 'center'}}>Loading employees...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </main>

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

  {/* Map Modal Removed (Moved to Live Tracking Tab) */}

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
