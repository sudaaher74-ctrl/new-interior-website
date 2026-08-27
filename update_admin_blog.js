const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/pages/AdminDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add blog tab to nav
content = content.replace(
  "<button className={`\${styles.navItem} \${activeTab === 'portfolio' ? styles.active : ''}`} onClick={() => setActiveTab('portfolio')}><span>🖼️</span> Portfolio Projects</button>",
  "<button className={`\${styles.navItem} \${activeTab === 'portfolio' ? styles.active : ''}`} onClick={() => setActiveTab('portfolio')}><span>🖼️</span> Portfolio Projects</button>\n            <button className={`\${styles.navItem} \${activeTab === 'blog' ? styles.active : ''}`} onClick={() => setActiveTab('blog')}><span>✍️</span> Blog Content</button>"
);

// Add blog header
content = content.replace(
  "{activeTab === 'portfolio' && 'Portfolio Management'}",
  "{activeTab === 'portfolio' && 'Portfolio Management'}\n              {activeTab === 'blog' && 'Blog Content CMS'}"
);

// Add state for blog
if (!content.includes('const [blogPosts, setBlogPosts]')) {
  content = content.replace(
    "const [portfolioProjects, setPortfolioProjects] = useState([]);",
    "const [portfolioProjects, setPortfolioProjects] = useState([]);\n  const [blogPosts, setBlogPosts] = useState([]);\n  const [showBlogModal, setShowBlogModal] = useState(false);\n  const [newBlogPost, setNewBlogPost] = useState({ slug: '', title: '', author: 'OS Interiors', content: '', coverImage: '', tags: '', isPublished: false });"
  );
}

// Add fetch logic
if (!content.includes('/v2/blog/admin/all')) {
  content = content.replace(
    "const portfolioRes = await axios.get(`${API_URL}/v2/portfolio`, { headers });",
    "const portfolioRes = await axios.get(`${API_URL}/v2/portfolio`, { headers });\n      const blogRes = await axios.get(`${API_URL}/v2/blog/admin/all`, { headers });\n      setBlogPosts(blogRes.data);"
  );
}

// Add blog save handler
const handleSaveBlog = `
  const handleSaveBlog = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: \`Bearer \${localStorage.getItem('token')}\` };
      toast.loading('Saving blog post...', { id: 'save-blog' });
      const payload = { ...newBlogPost, tags: typeof newBlogPost.tags === 'string' ? newBlogPost.tags.split(',').map(t => t.trim()) : newBlogPost.tags };
      await axios.post(\`\${API_URL}/v2/blog\`, payload, { headers });
      toast.success('Blog post created!', { id: 'save-blog' });
      setShowBlogModal(false);
      setNewBlogPost({ slug: '', title: '', author: 'OS Interiors', content: '', coverImage: '', tags: '', isPublished: false });
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save post', { id: 'save-blog' });
    }
  };

  const handleBlogImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewBlogPost({ ...newBlogPost, coverImage: reader.result });
    };
    reader.readAsDataURL(file);
  };
`;

content = content.replace(
  "const handleSavePortfolio = async",
  handleSaveBlog + "\n  const handleSavePortfolio = async"
);

// Add blog render logic
const renderBlogTab = `
  const renderBlogTab = () => (
    <div className={\`\${styles.tableContainer} \${styles.fadeInUp} \${styles.delay1}\`}>
      <div className={styles.tableHeader}>
        <h2 className={styles.pageTitle} style={{fontSize: '1.5rem', margin: 0}}>Blog Posts</h2>
        <button className={styles.btn} onClick={() => setShowBlogModal(true)}>+ Write Post</button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogPosts.map((post) => (
            <tr key={post._id} className="hover-float">
              <td style={{fontWeight: '500'}}>{post.title}</td>
              <td>{post.author}</td>
              <td>
                <span style={{ 
                  padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem',
                  background: post.isPublished ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: post.isPublished ? '#10b981' : '#f59e0b'
                }}>
                  {post.isPublished ? 'Published' : 'Draft'}
                </span>
              </td>
              <td>{new Date(post.createdAt).toLocaleDateString()}</td>
              <td>
                <button className={styles.btnSecondary} onClick={() => toast('Edit coming soon!')} style={{padding: '0.2rem 0.5rem', fontSize: '0.8rem'}}>Edit</button>
              </td>
            </tr>
          ))}
          {blogPosts.length === 0 && (
            <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No blog posts found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
`;

content = content.replace(
  "const renderPortfolioTab = () => (",
  renderBlogTab + "\n  const renderPortfolioTab = () => ("
);

content = content.replace(
  "{activeTab === 'portfolio' && renderPortfolioTab()}",
  "{activeTab === 'portfolio' && renderPortfolioTab()}\n          {activeTab === 'blog' && renderBlogTab()}"
);

// Add Blog modal
const blogModal = `
      {showBlogModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '800px', width: '90%' }}>
            <h2>Write Blog Post</h2>
            <form onSubmit={handleSaveBlog} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{display: 'flex', gap: '1rem'}}>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Title</label>
                  <input required type="text" className={styles.input} value={newBlogPost.title} onChange={e => setNewBlogPost({...newBlogPost, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')})} />
                </div>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Slug (URL)</label>
                  <input required type="text" className={styles.input} value={newBlogPost.slug} onChange={e => setNewBlogPost({...newBlogPost, slug: e.target.value})} />
                </div>
              </div>
              <div style={{display: 'flex', gap: '1rem'}}>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Tags (comma separated)</label>
                  <input type="text" className={styles.input} value={newBlogPost.tags} onChange={e => setNewBlogPost({...newBlogPost, tags: e.target.value})} placeholder="design, commercial, trends" />
                </div>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Status</label>
                  <select className={styles.input} value={newBlogPost.isPublished} onChange={e => setNewBlogPost({...newBlogPost, isPublished: e.target.value === 'true'})}>
                    <option value="false" style={{color: 'black'}}>Draft (Hidden)</option>
                    <option value="true" style={{color: 'black'}}>Published (Public)</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Content (Markdown Supported)</label>
                <textarea required className={styles.input} style={{ minHeight: '200px' }} value={newBlogPost.content} onChange={e => setNewBlogPost({...newBlogPost, content: e.target.value})} placeholder="Write your post here..."></textarea>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Cover Image</label>
                <input type="file" accept="image/*" onChange={handleBlogImageUpload} className={styles.input} />
                {newBlogPost.coverImage && <img src={newBlogPost.coverImage} style={{marginTop: '1rem', height: '100px', borderRadius: '4px'}} />}
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowBlogModal(false)}>Cancel</button>
                <button type="submit" className={styles.btn}>Save Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
`;

content = content.replace(
  "{/* Create Project Modal */}",
  blogModal + "\n      {/* Create Project Modal */}"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('AdminDashboard.jsx updated with Blog UI');
