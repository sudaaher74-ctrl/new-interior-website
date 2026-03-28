/* ============================================================
   OS INTERIORS — ADMIN DASHBOARD JS
   ============================================================ */

const PROJECTS = [];

let leads = [];

let adminProjects = [...PROJECTS];
let nextLeadId = 1;
let nextProjectId = 1;

// ── LOGIN ─────────────────────────────────────────────
function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  const error = document.getElementById('login-error');
  if (email === 'admin@osinteriors.com' && password === 'os@2024') {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    renderAdminDashboard();
    showAdminPanel('overview');
  } else {
    error.style.display = 'block';
    error.textContent = 'Invalid credentials.';
  }
}

function adminLogout() {
  document.getElementById('admin-login').style.display = 'flex';
  document.getElementById('admin-dashboard').style.display = 'none';
}

// ── PANELS ────────────────────────────────────────────
function showAdminPanel(panel) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(btn => btn.classList.remove('active'));
  document.getElementById('panel-' + panel).classList.add('active');
  document.querySelectorAll(`[data-panel="${panel}"]`).forEach(el => el.classList.add('active'));
  document.getElementById('admin-panel-title').textContent = {
    overview:'Dashboard Overview', projects:'Project Management', leads:'Contact Leads', analytics:'Analytics'
  }[panel] || panel;
  document.getElementById('admin-panel-breadcrumb').textContent = 'Admin / ' + panel;
  if (panel === 'leads') renderLeadsTable();
  if (panel === 'projects') renderAdminProjectsTable();
  if (panel === 'analytics') renderAnalytics();
}

function renderAdminDashboard() {
  document.getElementById('stat-visitors').textContent = '12,847';
  document.getElementById('stat-projects').textContent = adminProjects.length;
  document.getElementById('stat-leads').textContent = leads.length;
  const conversion = leads.length
    ? Math.round((leads.filter(l => l.status === 'contacted').length / leads.length) * 100)
    : 0;
  document.getElementById('stat-conversion').textContent = conversion + '%';
  renderRecentLeads();
  renderTopProjects();
}

function renderRecentLeads() {
  const c = document.getElementById('recent-leads-list');
  if (!c) return;
  if (!leads.length) {
    c.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);">No leads yet.</td></tr>';
    return;
  }
  c.innerHTML = leads.slice(0,4).map(l => `
    <tr>
      <td><strong style="color:var(--text-primary)">${l.name}</strong></td>
      <td>${l.projectType}</td><td>${l.createdAt}</td>
      <td><span class="status-badge status-${l.status}">${l.status}</span></td>
    </tr>`).join('');
}

function renderTopProjects() {
  const c = document.getElementById('top-projects-list');
  if (!c) return;
  const sorted = [...adminProjects].sort((a,b) => b.views - a.views).slice(0,5);
  if (!sorted.length) {
    c.innerHTML = '<div style="color:var(--text-muted);text-align:center;">No project data available.</div>';
    return;
  }
  c.innerHTML = sorted.map(p => `
    <div class="chart-bar-item">
      <span class="chart-bar-label">${p.title}</span>
      <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${Math.round(p.views/sorted[0].views*100)}%"></div></div>
      <span class="chart-bar-value">${p.views.toLocaleString()}</span>
    </div>`).join('');
}

function renderLeadsTable() {
  const tbody = document.getElementById('leads-tbody');
  if (!tbody) return;
  if (!leads.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);">No leads found.</td></tr>';
    return;
  }
  tbody.innerHTML = leads.map(l => `
    <tr>
      <td><strong style="color:var(--text-primary)">${l.name}</strong></td>
      <td>${l.phone}</td><td>${l.email}</td><td>${l.projectType}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${l.message}</td>
      <td>${l.createdAt}</td>
      <td><span class="status-badge status-${l.status}">${l.status}</span></td>
      <td>
        <div class="admin-actions">
          <button class="action-btn" onclick="toggleLeadStatus(${l.id})" title="Toggle Status">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
          <button class="action-btn danger" onclick="deleteLead(${l.id})" title="Delete">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

function toggleLeadStatus(id) {
  const lead = leads.find(l => l.id === id);
  if (lead) { lead.status = lead.status === 'new' ? 'contacted' : 'new'; renderLeadsTable(); renderAdminDashboard(); showToast('Lead status updated.'); }
}

function deleteLead(id) {
  if (confirm('Delete this lead?')) { leads = leads.filter(l => l.id !== id); renderLeadsTable(); renderAdminDashboard(); showToast('Lead deleted.'); }
}

function exportLeads() {
  const csv = [['Name','Phone','Email','Project Type','Message','Date','Status'], ...leads.map(l => [l.name,l.phone,l.email,l.projectType,l.message,l.createdAt,l.status])].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'os-leads.csv'; a.click();
  showToast('Leads exported to CSV.');
}

function renderAdminProjectsTable() {
  const tbody = document.getElementById('admin-projects-tbody');
  if (!tbody) return;
  if (!adminProjects.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">No projects added yet.</td></tr>';
    return;
  }
  tbody.innerHTML = adminProjects.map(p => `
    <tr>
      <td><img src="${p.cover}" style="width:56px;height:40px;object-fit:cover;display:block;border-radius:4px;"></td>
      <td><strong style="color:var(--text-primary)">${p.title}</strong></td>
      <td>${p.category}</td><td>${p.location}</td>
      <td>${p.views.toLocaleString()}</td><td>${p.date}</td>
      <td>
        <div class="admin-actions">
          <button class="action-btn" onclick="editProject(${p.id})" title="Edit">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="action-btn danger" onclick="deleteProject(${p.id})" title="Delete">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

function deleteProject(id) {
  if (confirm('Delete this project?')) { adminProjects = adminProjects.filter(p => p.id !== id); renderAdminProjectsTable(); renderAdminDashboard(); showToast('Project deleted.'); }
}

function editProject(id) {
  const p = adminProjects.find(proj => proj.id === id);
  if (!p) return;
  document.getElementById('add-project-form').scrollIntoView({ behavior: 'smooth' });
  document.getElementById('proj-title').value = p.title;
  document.getElementById('proj-category').value = p.category;
  document.getElementById('proj-location').value = p.location;
  document.getElementById('proj-budget').value = p.budget;
  document.getElementById('proj-area').value = p.area;
  document.getElementById('proj-description').value = p.description;
  showToast('Editing project: ' + p.title);
}

function handleAddProject(e) {
  e.preventDefault();
  const newProject = {
    id: nextProjectId++,
    title: document.getElementById('proj-title').value,
    category: document.getElementById('proj-category').value,
    location: document.getElementById('proj-location').value,
    budget: document.getElementById('proj-budget').value,
    area: document.getElementById('proj-area').value,
    description: document.getElementById('proj-description').value,
    tags:['New'], views:0, date: new Date().toLocaleDateString('en-IN',{month:'long',year:'numeric'}),
    cover:"https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=90",
    gallery:[], beforeImg:"", afterImg:"",
    testimonial:{name:"Client",role:"Homeowner",text:"Exceptional work."}
  };
  adminProjects.unshift(newProject);
  e.target.reset();
  renderAdminProjectsTable(); renderAdminDashboard();
  showToast('✓ Project added successfully!');
}

function renderAnalytics() {
  const c = document.getElementById('analytics-projects-chart');
  if (!c) return;
  const sorted = [...adminProjects].sort((a,b) => b.views - a.views);
  if (!sorted.length) {
    c.innerHTML = '<div style="color:var(--text-muted);text-align:center;">No project analytics available.</div>';
  } else {
    c.innerHTML = sorted.map(p => `
      <div class="chart-bar-item">
        <span class="chart-bar-label">${p.title}</span>
        <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${Math.round(p.views/sorted[0].views*100)}%"></div></div>
        <span class="chart-bar-value">${p.views.toLocaleString()}</span>
      </div>`).join('');
  }

  const catC = document.getElementById('analytics-category-chart');
  const cats = {};
  PROJECTS.forEach(p => { cats[p.category] = (cats[p.category]||0) + p.views; });
  const catEntries = Object.entries(cats);
  if (!catEntries.length) {
    catC.innerHTML = '<div style="color:var(--text-muted);text-align:center;">No category analytics available.</div>';
    return;
  }
  const maxCat = Math.max(...Object.values(cats));
  catC.innerHTML = catEntries.map(([cat,views]) => `
    <div class="chart-bar-item">
      <span class="chart-bar-label">${cat}</span>
      <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${Math.round(views/maxCat*100)}%"></div></div>
      <span class="chart-bar-value">${views.toLocaleString()}</span>
    </div>`).join('');
}

// ── TOAST ─────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4000);
}

