const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/pages/AdminDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The original table-based renderLeadsTab:
const originalLeadsRegex = /const renderLeadsTab = \(\) => \{[\s\S]*?\};/;

const newKanbanLeads = `const renderLeadsTab = () => {
    const filteredLeads = leads.filter(l => 
      (l.name && l.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.projectType && l.projectType.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const columns = [
      { id: 'new', title: 'New Leads', statusMatches: ['New', 'new', undefined] },
      { id: 'contacted', title: 'Contacted', statusMatches: ['Contacted', 'contacted'] },
      { id: 'converted', title: 'Converted', statusMatches: ['Converted', 'converted'] },
      { id: 'closed', title: 'Closed', statusMatches: ['Closed', 'closed'] }
    ];

    return (
      <div className={\`\${styles.tableContainer} \${styles.fadeInUp} \${styles.delay1}\`} style={{ background: 'transparent', boxShadow: 'none' }}>
        <div className={styles.tableHeader} style={{ flexWrap: 'wrap', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
          <h2 className={styles.pageTitle} style={{fontSize: '1.5rem', margin: 0}}>Leads CRM Board</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
            <button className={\`\${styles.btn} \${styles.btnSecondary}\`} style={{width: 'auto', padding: '0.4rem 0.8rem'}} onClick={() => handleExportCSV(filteredLeads, 'leads')}>Export CSV</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {columns.map(col => {
            const columnLeads = filteredLeads.filter(l => col.statusMatches.includes(l.status || 'New'));
            return (
              <div key={col.id} style={{ flex: '1', minWidth: '300px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
                  {col.title} <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.9rem' }}>{columnLeads.length}</span>
                </h3>
                
                {columnLeads.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem', marginTop: '1rem' }}>No leads here</p>
                ) : (
                  columnLeads.map(lead => (
                    <div key={lead._id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '1rem' }} className="hover-float">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '500' }}>{lead.name}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div>📞 {lead.contact || lead.phone || 'N/A'}</div>
                        <div>✉️ {lead.email || 'N/A'}</div>
                        {lead.projectType && <div>🏢 {lead.projectType}</div>}
                      </div>

                      {lead.message && (
                        <div style={{ fontSize: '0.85rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', fontStyle: 'italic', borderLeft: '2px solid var(--accent-1)' }}>
                          "\${lead.message}"
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select 
                          value={lead.status || 'New'}
                          onChange={(e) => handleUpdateLeadStatus(lead._id, e.target.value)}
                          style={{ flex: 1, padding: '0.3rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          <option value="New" style={{color: 'black'}}>New</option>
                          <option value="Contacted" style={{color: 'black'}}>Contacted</option>
                          <option value="Converted" style={{color: 'black'}}>Converted</option>
                          <option value="Closed" style={{color: 'black'}}>Closed</option>
                        </select>
                        <button className={\`\${styles.btnSecondary}\`} onClick={() => setEditingLead(lead)} style={{padding: '0.3rem 0.6rem', fontSize: '0.85rem'}}>
                          Edit
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };`;

content = content.replace(originalLeadsRegex, newKanbanLeads);

fs.writeFileSync(filePath, content, 'utf8');
console.log('AdminDashboard.jsx leads CRM updated.');
