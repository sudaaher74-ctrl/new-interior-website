const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/pages/AdminDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add state variable for attendance
content = content.replace(
  "const [employees, setEmployees] = useState([]);",
  `const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attStartDate, setAttStartDate] = useState('');
  const [attEndDate, setAttEndDate] = useState('');`
);

// 2. Fetch all data
content = content.replace(
  "// 5. Employees",
  `// 5. Employees
      try {
        const resEmployees = await axios.get(\`\${API_URL}/v2/admin/employees\`, { headers });
        setEmployees(resEmployees.data);
      } catch(e) {}
      
      // 6. Attendance
      try {
        let attUrl = \`\${API_URL}/attendance/admin/all\`;
        const resAtt = await axios.get(attUrl, { headers });
        setAttendanceRecords(resAtt.data);
      } catch(e) {}
      
      // Skip original 5. Employees`
);
content = content.replace(
  "      try {\n        const resEmployees = await axios.get(`${API_URL}/v2/admin/employees`, { headers });\n        setEmployees(resEmployees.data);\n      } catch(e) {}",
  "" // Remove duplicate
);


// 3. Add handleFetchAttendance
content = content.replace(
  "const handleAddEmployee = async (e) => {",
  `const handleFetchAttendance = async () => {
    try {
      const headers = { Authorization: \`Bearer \${localStorage.getItem('token')}\` };
      let query = [];
      if (attStartDate) query.push(\`startDate=\${attStartDate}\`);
      if (attEndDate) query.push(\`endDate=\${attEndDate}\`);
      
      const resAtt = await axios.get(\`\${API_URL}/attendance/admin/all?\${query.join('&')}\`, { headers });
      setAttendanceRecords(resAtt.data);
      toast.success('Attendance records fetched');
    } catch(err) {
      toast.error('Failed to fetch attendance records');
    }
  };

  const handleAddEmployee = async (e) => {`
);

// 4. Add Tab to Sidebar
content = content.replace(
  "<button className={`${styles.navItem} ${activeTab === 'employees' ? styles.active : ''}`} onClick={() => setActiveTab('employees')}><span>👥</span> Employees</button>",
  `<button className={\`\${styles.navItem} \${activeTab === 'employees' ? styles.active : ''}\`} onClick={() => setActiveTab('employees')}><span>👥</span> Employees</button>
            <button className={\`\${styles.navItem} \${activeTab === 'attendance' ? styles.active : ''}\`} onClick={() => setActiveTab('attendance')}><span>⏰</span> Attendance Logs</button>`
);

// 5. Render Attendance Tab
content = content.replace(
  "  const renderEmployeesTab = () => {",
  `  const renderAttendanceTab = () => {
    const filteredAtt = attendanceRecords.filter(a => 
      (a.user?.fullName && a.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.project?.name && a.project.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
      <div className={\`\${styles.tableContainer} \${styles.fadeInUp} \${styles.delay1}\`}>
        <div className={styles.tableHeader} style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className={styles.pageTitle} style={{fontSize: '1.5rem', margin: 0}}>Master Attendance Logs</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input 
              type="date" 
              value={attStartDate}
              onChange={e => setAttStartDate(e.target.value)}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
            <span style={{ color: 'white' }}>to</span>
            <input 
              type="date" 
              value={attEndDate}
              onChange={e => setAttEndDate(e.target.value)}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
            <button className={\`\${styles.btn} \${styles.btnPrimary}\`} style={{width: 'auto', padding: '0.4rem 0.8rem'}} onClick={handleFetchAttendance}>Fetch</button>
            
            <input 
              type="text" 
              placeholder="Search by name/project..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
            <button className={\`\${styles.btn} \${styles.btnSecondary}\`} style={{width: 'auto', padding: '0.4rem 0.8rem'}} onClick={() => handleExportCSV(filteredAtt.map(a => ({
              Date: new Date(a.date).toLocaleDateString(),
              Employee: a.user?.fullName,
              Project: a.project?.name,
              Status: a.status,
              TotalHours: a.totalWorkingHours || 0
            })), 'master-attendance')}>Export CSV</button>
          </div>
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee</th>
              <th>Project</th>
              <th>Status</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            {filteredAtt.map((att) => (
              <tr key={att._id}>
                <td>{new Date(att.date).toLocaleDateString()}</td>
                <td style={{fontWeight: '500'}}>{att.user?.fullName || 'Unknown'}</td>
                <td>{att.project?.name || 'Unknown'}</td>
                <td>
                  <span style={{ 
                    padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem',
                    background: att.status === 'Present' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: att.status === 'Present' ? '#10b981' : '#f59e0b'
                  }}>
                    {att.status}
                  </span>
                </td>
                <td style={{fontWeight: 'bold'}}>{att.totalWorkingHours ? att.totalWorkingHours.toFixed(1) : '-'}</td>
              </tr>
            ))}
            {filteredAtt.length === 0 && (
              <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No attendance logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderEmployeesTab = () => {`
);

// 6. Include it in the main render
content = content.replace(
  "{activeTab === 'employees' && renderEmployeesTab()}",
  `{activeTab === 'employees' && renderEmployeesTab()}
          {activeTab === 'attendance' && renderAttendanceTab()}`
);


fs.writeFileSync(filePath, content, 'utf8');
console.log('AdminDashboard updated successfully.');
