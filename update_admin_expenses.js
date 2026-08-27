const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/pages/AdminDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add states for expenses
content = content.replace(
  "const [employees, setEmployees] = useState([]);",
  `const [employees, setEmployees] = useState([]);
  const [expenseRecords, setExpenseRecords] = useState([]);
  const [expenseFilter, setExpenseFilter] = useState('Pending');`
);

// 2. Fetch expenses data inside fetchData
content = content.replace(
  "// 4. Site Visits",
  `// 4. Site Visits
      try {
        const resVisits = await axios.get(\`\${API_URL}/v2/site-visits/all\`, { headers });
        setAllVisits(resVisits.data);
        
        // Extract expenses from visits
        const expenses = resVisits.data.filter(v => v.expenseAmount > 0);
        setExpenseRecords(expenses);
      } catch(e) {}
      
      // Skip duplicate 4. Site Visits`
);
content = content.replace(
  "      try {\n        const resVisits = await axios.get(`${API_URL}/v2/site-visits/all`, { headers });\n        setAllVisits(resVisits.data);\n      } catch(e) {}",
  ""
);

// 3. Add handleExpenseAction
content = content.replace(
  "const handleFetchAttendance = async () => {",
  `const handleExpenseAction = async (id, status) => {
    try {
      const comment = prompt(status === 'Rejected' ? 'Reason for rejection (optional):' : 'Add a note (optional):');
      // If user cancels prompt and it returns null, we can just skip or send empty string.
      if (comment === null && status === 'Rejected') return; // Cancelled
      
      toast.loading(\`Updating expense to \${status}...\`, { id: 'expense' });
      const headers = { Authorization: \`Bearer \${localStorage.getItem('token')}\` };
      await axios.put(\`\${API_URL}/v2/site-visits/expense/\${id}\`, { status, comment }, { headers });
      
      // Update local state
      setExpenseRecords(prev => prev.map(exp => exp._id === id ? { ...exp, expenseStatus: status, expenseAdminComment: comment || '' } : exp));
      toast.success('Expense updated', { id: 'expense' });
    } catch(e) {
      toast.error('Failed to update expense', { id: 'expense' });
    }
  };

  const handleFetchAttendance = async () => {`
);

// 4. Add Tab to Sidebar
content = content.replace(
  "<button className={`${styles.navItem} ${activeTab === 'attendance' ? styles.active : ''}`} onClick={() => setActiveTab('attendance')}><span>⏰</span> Attendance Logs</button>",
  `<button className={\`\${styles.navItem} \${activeTab === 'attendance' ? styles.active : ''}\`} onClick={() => setActiveTab('attendance')}><span>⏰</span> Attendance Logs</button>
            <button className={\`\${styles.navItem} \${activeTab === 'expenses' ? styles.active : ''}\`} onClick={() => setActiveTab('expenses')}><span>💰</span> Expenses</button>`
);

// 5. Add Expense Tab Render
content = content.replace(
  "const renderAttendanceTab = () => {",
  `const renderExpensesTab = () => {
    const filteredExp = expenseRecords.filter(e => 
      (expenseFilter === 'All' || (e.expenseStatus || 'Pending') === expenseFilter) &&
      ((e.user?.fullName && e.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.project?.name && e.project.name.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    return (
      <div className={\`\${styles.tableContainer} \${styles.fadeInUp} \${styles.delay1}\`}>
        <div className={styles.tableHeader} style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className={styles.pageTitle} style={{fontSize: '1.5rem', margin: 0}}>Expense Approvals</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select 
              value={expenseFilter} 
              onChange={e => setExpenseFilter(e.target.value)}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <input 
              type="text" 
              placeholder="Search by name/project..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
          </div>
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee</th>
              <th>Project</th>
              <th>Amount (₹)</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExp.map((exp) => {
              const status = exp.expenseStatus || 'Pending';
              return (
              <tr key={exp._id}>
                <td>{new Date(exp.time).toLocaleDateString()}</td>
                <td style={{fontWeight: '500'}}>{exp.user?.fullName || 'Unknown'}</td>
                <td>{exp.project?.name || exp.project?.title || 'Unknown'}</td>
                <td style={{fontWeight: 'bold'}}>₹{exp.expenseAmount}</td>
                <td>{exp.expenseDescription}</td>
                <td>
                  <span style={{ 
                    padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem',
                    background: status === 'Approved' ? 'rgba(16, 185, 129, 0.2)' : status === 'Rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: status === 'Approved' ? '#10b981' : status === 'Rejected' ? '#ef4444' : '#f59e0b'
                  }}>
                    {status}
                  </span>
                </td>
                <td>
                  {status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleExpenseAction(exp._id, 'Approved')} style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>✅ Approve</button>
                      <button onClick={() => handleExpenseAction(exp._id, 'Rejected')} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>❌ Reject</button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {exp.expenseAdminComment ? \`Note: \${exp.expenseAdminComment}\` : '-'}
                    </span>
                  )}
                </td>
              </tr>
            )})}
            {filteredExp.length === 0 && (
              <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No expenses found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAttendanceTab = () => {`
);

// 6. Include render in output
content = content.replace(
  "{activeTab === 'attendance' && renderAttendanceTab()}",
  `{activeTab === 'attendance' && renderAttendanceTab()}
          {activeTab === 'expenses' && renderExpensesTab()}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('AdminDashboard.jsx expenses updated.');
