const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/pages/EmployeeDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add state variables
content = content.replace(
  "const [activeTab, setActiveTab] = useState('dashboard');",
  `const [activeTab, setActiveTab] = useState('dashboard');
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [workSummary, setWorkSummary] = useState('');`
);

// 2. Fetch history in fetchData
content = content.replace(
  "const allVisitRes = await axios.get(`${API_URL}/v2/site-visits/my-visits`, { headers });\n        setAllVisits(allVisitRes.data);\n      } catch (err) {\n        setAllVisits([]);\n      }",
  `const allVisitRes = await axios.get(\`\${API_URL}/v2/site-visits/my-visits\`, { headers });
        setAllVisits(allVisitRes.data);
      } catch (err) {
        setAllVisits([]);
      }
      
      try {
        const attRes = await axios.get(\`\${API_URL}/attendance/history\`, { headers });
        setAttendanceHistory(attRes.data);
      } catch (err) {
        console.error("Failed to fetch attendance history", err);
      }`
);

// 3. Add handleCheckIn and handleCheckOut
content = content.replace(
  "const submitVisit = () => {",
  `const handleCheckIn = () => {
    if (!selectedProject) return toast.error('Select a project first');
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    
    toast.loading('Acquiring location for Check-In...', { id: 'checkin' });
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const headers = { Authorization: \`Bearer \${localStorage.getItem('token')}\` };
        await axios.post(\`\${API_URL}/attendance/check-in\`, {
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
      const headers = { Authorization: \`Bearer \${localStorage.getItem('token')}\` };
      await axios.post(\`\${API_URL}/attendance/check-out\`, { workSummary }, { headers });
      toast.success('Successfully Checked Out!', { id: 'checkout' });
      setWorkSummary('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to check out', { id: 'checkout' });
    }
  };

  const submitVisit = () => {`
);

// 4. Add Tab to Sidebar
content = content.replace(
  "<button className={`${styles.navItem} ${activeTab === 'expenses' ? styles.active : ''}`} onClick={() => setActiveTab('expenses')}><span>💰</span> Expenses</button>",
  `<button className={\`\${styles.navItem} \${activeTab === 'expenses' ? styles.active : ''}\`} onClick={() => setActiveTab('expenses')}><span>💰</span> Expenses</button>
            <button className={\`\${styles.navItem} \${activeTab === 'attendance' ? styles.active : ''}\`} onClick={() => setActiveTab('attendance')}><span>⏰</span> Attendance</button>`
);

// 5. Update header title
content = content.replace(
  "{activeTab === 'expenses' && 'My Expenses'}",
  `{activeTab === 'expenses' && 'My Expenses'}
              {activeTab === 'attendance' && 'Attendance & Time Tracking'}`
);

// 6. Add Attendance Tab content at the bottom of the main content
content = content.replace(
  "{activeTab === 'expenses' && (",
  `{activeTab === 'attendance' && (
            <div className={\`\${styles.glassCard} \${styles.fadeInUp}\`}>
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
                  <button onClick={handleCheckIn} className={\`\${styles.btn} \${styles.btnPrimary}\`} style={{ width: '100%', background: 'var(--gradient-success)' }}>
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
                  <button onClick={handleCheckOut} className={\`\${styles.btn} \${styles.btnPrimary}\`} style={{ width: '100%', background: 'var(--accent-1)' }}>
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
          
          {activeTab === 'expenses' && (`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('EmployeeDashboard updated successfully.');
