import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  return (
    <>
      

  <nav className="navbar">
    <div className="nav-brand">OS Interior</div>
    <div className="nav-profile">
      <span id="userName">Loading...</span>
      <button className="logout-btn" >Logout</button>
    </div>
  </nav>

  <div className="container">
    <div className="main-content">
      <div className="card">
        <div className="card-title">
          Log Site Visit & Expenses
        </div>
        <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem'}}>
          Select your site, capture a photo, and enter any travel expenses incurred.
        </p>
        
        <select id="projectSelect" style={{width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)'}}>
          <option value="">Select Assigned Project</option>
          {/* Will be populated dynamically */}
        </select>

        <div id="videoContainer">
          <video id="videoElement" autoPlay playsInline></video>
          <canvas id="canvasElement"></canvas>
          <img id="previewImage" style={{display: 'none', width: '100%', borderRadius: '8px', marginTop: '1rem'}} />
        </div>
        
        <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}} id="actionButtonsRow">
          <button id="startCamBtn" className="btn btn-secondary" style={{flex: '1'}} >Open Camera</button>
          <button id="uploadPhotoBtn" className="btn btn-secondary" style={{flex: '1'}} >Upload Photo</button>
          <input type="file" id="photoInput" accept="image/*" capture="environment" style={{display: 'none'}}  />
        </div>
        
        <div id="expenseSection" style={{marginBottom: '1rem'}}>
          <input type="number" id="expenseAmount" placeholder="Travel Expense Amount (₹)" style={{width: '100%', padding: '0.75rem', marginBottom: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)'}} />
          <input type="text" id="expenseDesc" placeholder="Expense Description (e.g., Train Panvel to CST)" style={{width: '100%', padding: '0.75rem', marginBottom: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)'}} />
        </div>

        <button id="submitVisitBtn" className="btn btn-primary" style={{width: '100%', marginBottom: '1rem'}} >Submit Visit</button>

        <div id="actionMsg" className="msg-box"></div>
      </div>

      <div className="card">
        <h3 className="card-title">Today's Visits</h3>
        <div id="todaysVisitsList">
          <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Loading visits...</p>
        </div>
      </div>
    </div>

    <div className="sidebar">
      <div className="card">
        <h3 className="card-title">Quick Actions</h3>
        <button className="btn btn-secondary" style={{marginBottom: '0.5rem'}}>Upload Site Photos</button>
        <button className="btn btn-secondary">Submit Daily Report</button>
      </div>
      <div className="card">
        <h3 className="card-title">Assigned Projects</h3>
        <div id="assignedProjectsList">
          <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Loading projects...</p>
        </div>
      </div>
    </div>
  </div>

  
    </>
  );
};

export default EmployeeDashboard;
