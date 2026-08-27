const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/pages/AdminDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add portfolio tab to nav
content = content.replace(
  "<button className={`\${styles.navItem} \${activeTab === 'expenses' ? styles.active : ''}`} onClick={() => setActiveTab('expenses')}><span>💰</span> Expenses</button>",
  "<button className={`\${styles.navItem} \${activeTab === 'expenses' ? styles.active : ''}`} onClick={() => setActiveTab('expenses')}><span>💰</span> Expenses</button>\n            <button className={`\${styles.navItem} \${activeTab === 'portfolio' ? styles.active : ''}`} onClick={() => setActiveTab('portfolio')}><span>🖼️</span> Portfolio Projects</button>"
);

// Add portfolio header
content = content.replace(
  "{activeTab === 'expenses' && 'Expense Approvals'}",
  "{activeTab === 'expenses' && 'Expense Approvals'}\n              {activeTab === 'portfolio' && 'Portfolio Management'}"
);

// Add state for portfolio
if (!content.includes('const [portfolioProjects, setPortfolioProjects]')) {
  content = content.replace(
    "const [leads, setLeads] = useState([]);",
    "const [leads, setLeads] = useState([]);\n  const [portfolioProjects, setPortfolioProjects] = useState([]);\n  const [showPortfolioModal, setShowPortfolioModal] = useState(false);\n  const [newPortfolioProject, setNewPortfolioProject] = useState({ slug: '', title: '', category: 'Restaurants', img: '', altText: '' });"
  );
}

// Add fetch logic
if (!content.includes('/v2/portfolio')) {
  content = content.replace(
    "const leadsRes = await axios.get(`${API_URL}/v2/leads`, { headers });",
    "const leadsRes = await axios.get(`${API_URL}/v2/leads`, { headers });\n      const portfolioRes = await axios.get(`${API_URL}/v2/portfolio`, { headers });\n      setPortfolioProjects(portfolioRes.data);"
  );
}

// Add portfolio save handler
const handleSavePortfolio = `
  const handleSavePortfolio = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: \`Bearer \${localStorage.getItem('token')}\` };
      toast.loading('Saving project (might take a moment to upload image)...', { id: 'save-portfolio' });
      await axios.post(\`\${API_URL}/v2/portfolio\`, newPortfolioProject, { headers });
      toast.success('Portfolio project created!', { id: 'save-portfolio' });
      setShowPortfolioModal(false);
      setNewPortfolioProject({ slug: '', title: '', category: 'Restaurants', img: '', altText: '' });
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save project', { id: 'save-portfolio' });
    }
  };

  const handlePortfolioImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPortfolioProject({ ...newPortfolioProject, img: reader.result });
    };
    reader.readAsDataURL(file);
  };
`;

content = content.replace(
  "const handleUpdateLeadStatus = async",
  handleSavePortfolio + "\n  const handleUpdateLeadStatus = async"
);

// Add portfolio render logic
const renderPortfolioTab = `
  const renderPortfolioTab = () => (
    <div className={\`\${styles.tableContainer} \${styles.fadeInUp} \${styles.delay1}\`}>
      <div className={styles.tableHeader}>
        <h2 className={styles.pageTitle} style={{fontSize: '1.5rem', margin: 0}}>Portfolio Projects</h2>
        <button className={styles.btn} onClick={() => setShowPortfolioModal(true)}>+ Add Project</button>
      </div>
      <div className="grid-3" style={{ padding: '1rem', gap: '1rem' }}>
        {portfolioProjects.map(p => (
          <div key={p._id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1rem' }}>
            <img src={p.img} alt={p.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.5rem' }} />
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{p.title}</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.category} | {p.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
`;

content = content.replace(
  "const renderLeadsTab = () => {",
  renderPortfolioTab + "\n  const renderLeadsTab = () => {"
);

content = content.replace(
  "{activeTab === 'expenses' && renderExpensesTab()}",
  "{activeTab === 'expenses' && renderExpensesTab()}\n          {activeTab === 'portfolio' && renderPortfolioTab()}"
);

// Add Portfolio modal
const portfolioModal = `
      {showPortfolioModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '600px' }}>
            <h2>Add Portfolio Project</h2>
            <form onSubmit={handleSavePortfolio} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Title</label>
                <input required type="text" className={styles.input} value={newPortfolioProject.title} onChange={e => setNewPortfolioProject({...newPortfolioProject, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\\s+/g, '-')})} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Slug (URL)</label>
                <input required type="text" className={styles.input} value={newPortfolioProject.slug} onChange={e => setNewPortfolioProject({...newPortfolioProject, slug: e.target.value})} />
              </div>
              <div style={{display: 'flex', gap: '1rem'}}>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Category</label>
                  <select className={styles.input} value={newPortfolioProject.category} onChange={e => setNewPortfolioProject({...newPortfolioProject, category: e.target.value})}>
                    <option value="Restaurants" style={{color: 'black'}}>Restaurants</option>
                    <option value="Offices" style={{color: 'black'}}>Offices</option>
                    <option value="Retail" style={{color: 'black'}}>Retail</option>
                    <option value="Healthcare" style={{color: 'black'}}>Healthcare</option>
                    <option value="Hospitality" style={{color: 'black'}}>Hospitality</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Main Image</label>
                <input type="file" accept="image/*" onChange={handlePortfolioImageUpload} className={styles.input} />
                {newPortfolioProject.img && <img src={newPortfolioProject.img} style={{marginTop: '1rem', height: '100px', borderRadius: '4px'}} />}
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowPortfolioModal(false)}>Cancel</button>
                <button type="submit" className={styles.btn}>Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
`;

content = content.replace(
  "{/* Create Project Modal */}",
  portfolioModal + "\n      {/* Create Project Modal */}"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('AdminDashboard.jsx updated with Portfolio UI');
