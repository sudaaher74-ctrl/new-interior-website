/* ============================================================
   OS INTERIORS — ADMIN DASHBOARD JS (localStorage Persistence)
   ============================================================ */

// ── DATA STATE ─────────────────────────────────────────────
let leads = [];
let adminProjects = [];
let nextLeadId = 1;
let currentLeadFilter = 'all';
let selectedLeadId = null;

// Initial Projects Data (Fallback)
const INITIAL_PROJECTS = [
  { id: 1, title: "Lakhani Centrium", category: "Residential", location: "Mumbai, Maharashtra", views: 3842, date: "March 2024", cover: "images/IMG_2695.JPG" },
  { id: 2, title: "Nexus Corporate HQ", category: "Corporate", location: "Pune, Maharashtra", views: 2910, date: "January 2024", cover: "images/hall.jpeg" },
  { id: 3, title: "Ritz Turnkey Villa", category: "Turnkey", location: "Lonavala, Maharashtra", views: 4201, date: "November 2023", cover: "images/IMG_2701.JPG" }
];

// ── CORE INITIALIZATION ─────────────────────────────────────
function initAdmin() {
  loadLeads();
  loadProjects();
  renderAdminDashboard();
  
  // Listen for storage changes (sync between tabs)
  window.addEventListener('storage', (e) => {
    if (e.key === 'os_interiors_leads') {
      loadLeads();
      renderCurrentPanel();
    }
  });
}

function loadLeads() {
  const stored = localStorage.getItem('os_interiors_leads');
  if (stored) {
    leads = JSON.parse(stored);
    nextLeadId = leads.length > 0 ? Math.max(...leads.map(l => l.id)) + 1 : 1;
  } else {
    leads = [];
  }
}

function saveLeads() {
  localStorage.setItem('os_interiors_leads', JSON.stringify(leads));
}

function loadProjects() {
  const stored = localStorage.getItem('os_interiors_projects');
  if (stored) {
    adminProjects = JSON.parse(stored);
  } else {
    adminProjects = [...INITIAL_PROJECTS];
    localStorage.setItem('os_interiors_projects', JSON.stringify(adminProjects));
  }
}

// ── LOGIN ─────────────────────────────────────────────
function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  const error = document.getElementById('login-error');
  
  // Basic validation (Replace with Firebase Auth for production)
  if (email === 'admin@osinteriors.com' && password === 'os@2024') {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    sessionStorage.setItem('os_admin_session', 'active');
    initAdmin();
  } else {
    error.style.display = 'block';
    error.textContent = 'Invalid credentials.';
  }
}

// Auto-login if session exists
if (sessionStorage.getItem('os_admin_session') === 'active') {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    initAdmin();
  });
}

function adminLogout() {
  sessionStorage.removeItem('os_admin_session');
  location.reload();
}

// ── PANELS ────────────────────────────────────────────
function showAdminPanel(panel) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(btn => btn.classList.remove('active'));
  
  const targetPanel = document.getElementById('panel-' + panel);
  if (targetPanel) targetPanel.classList.add('active');
  
  document.querySelectorAll(`[data-panel="${panel}"]`).forEach(el => el.classList.add('active'));
  
  document.getElementById('admin-panel-title').textContent = {
    overview:'Dashboard Overview', 
    leads:'Lead Management', 
    projects:'Project Management', 
    analytics:'Analytics'
  }[panel] || panel;
  
  document.getElementById('admin-panel-breadcrumb').textContent = 'Admin / ' + panel;
  
  renderCurrentPanel();
}

function renderCurrentPanel() {
  const activePanel = document.querySelector('.admin-panel.active').id;
  if (activePanel === 'panel-overview') renderOverview();
  if (activePanel === 'panel-leads') renderLeadsTable();
  if (activePanel === 'panel-projects') renderAdminProjectsTable();
  if (activePanel === 'panel-analytics') renderAnalytics();
}

// ── OVERVIEW ──────────────────────────────────────────
function renderAdminDashboard() {
  renderOverview();
}

function renderOverview() {
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const pipeline = leads.filter(l => ['contacted', 'meeting', 'quoted'].includes(l.status)).length;
  const won = leads.filter(l => l.status === 'won').length;
  const convRate = totalLeads ? Math.round((won / totalLeads) * 100) : 0;

  document.getElementById('stat-total-leads').textContent = totalLeads;
  document.getElementById('stat-new-leads').textContent = newLeads;
  document.getElementById('stat-pipeline').textContent = pipeline;
  document.getElementById('stat-conversion').textContent = convRate + '%';

  renderPipelineFunnel();
  renderRecentLeads();
  renderTopProjects();
}

function renderPipelineFunnel() {
  const funnel = document.getElementById('pipeline-funnel');
  if (!funnel) return;
  
  const statuses = ['new', 'contacted', 'meeting', 'quoted', 'won', 'lost'];
  const counts = statuses.map(s => leads.filter(l => l.status === s).length);
  const max = Math.max(...counts, 1);
  
  funnel.innerHTML = statuses.map((s, i) => `
    <div class="funnel-step">
      <div class="funnel-bar" style="height: ${Math.max((counts[i]/max)*100, 10)}%">
        <span class="funnel-count">${counts[i]}</span>
      </div>
      <div class="funnel-label">${s}</div>
    </div>
  `).join('');
}

function renderRecentLeads() {
  const c = document.getElementById('recent-leads-list');
  if (!c) return;
  
  const recent = [...leads].reverse().slice(0, 5);
  if (!recent.length) {
    c.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--text-muted);">No leads yet.</td></tr>';
    return;
  }
  
  c.innerHTML = recent.map(l => `
    <tr onclick="viewLead(${l.id})" style="cursor:pointer;">
      <td><strong>${l.name}</strong></td>
      <td>${l.projectType}</td>
      <td>${l.createdAt}</td>
      <td><span class="status-badge status-${l.status}">${l.status}</span></td>
      <td><span class="priority-tag priority-${l.priority || 'none'}">${l.priority || '—'}</span></td>
    </tr>`).join('');
}

function renderTopProjects() {
  const c = document.getElementById('top-projects-list');
  if (!c) return;
  const sorted = [...adminProjects].sort((a,b) => b.views - a.views).slice(0,5);
  c.innerHTML = sorted.map(p => `
    <div class="chart-bar-item">
      <span class="chart-bar-label">${p.title}</span>
      <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${Math.round(p.views/sorted[0].views*100)}%"></div></div>
      <span class="chart-bar-value">${p.views.toLocaleString()}</span>
    </div>`).join('');
}

// ── LEADS MANAGEMENT ──────────────────────────────────
function setLeadFilter(filter) {
  currentLeadFilter = filter;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.toggle('active', c.dataset.filter === filter));
  renderLeadsTable();
}

function renderLeadsTable() {
  const tbody = document.getElementById('leads-tbody');
  const search = document.getElementById('lead-search').value.toLowerCase();
  if (!tbody) return;

  let filtered = [...leads].reverse();
  if (currentLeadFilter !== 'all') filtered = filtered.filter(l => l.status === currentLeadFilter);
  if (search) {
    filtered = filtered.filter(l => 
      l.name.toLowerCase().includes(search) || 
      l.phone.includes(search) || 
      l.email.toLowerCase().includes(search)
    );
  }

  document.getElementById('leads-count').textContent = `(${filtered.length})`;

  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-muted);">No leads found.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(l => `
    <tr>
      <td><strong>${l.name}</strong></td>
      <td>${l.phone}</td>
      <td>${l.projectType}</td>
      <td><span style="font-size:0.7rem;color:var(--text-muted);">${l.source || 'Website'}</span></td>
      <td>${l.createdAt}</td>
      <td><span class="priority-tag priority-${l.priority || 'none'}">${l.priority || '—'}</span></td>
      <td><span class="status-badge status-${l.status}">${l.status}</span></td>
      <td>
        <div class="admin-actions">
          <button class="action-btn" onclick="viewLead(${l.id})" title="View Details">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14" height="14"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </button>
          <button class="action-btn danger" onclick="deleteLead(${l.id}, event)" title="Delete">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

function viewLead(id) {
  const lead = leads.find(l => l.id === id);
  if (!lead) return;
  
  selectedLeadId = id;
  document.getElementById('modal-lead-name').textContent = lead.name;
  document.getElementById('modal-lead-date').textContent = 'Received: ' + lead.createdAt;
  document.getElementById('modal-lead-phone').textContent = lead.phone;
  document.getElementById('modal-lead-email').textContent = lead.email || '—';
  document.getElementById('modal-lead-type').textContent = lead.projectType;
  document.getElementById('modal-lead-source').textContent = lead.source || 'Website Form';
  document.getElementById('modal-lead-message').textContent = lead.message || 'No message provided.';
  document.getElementById('modal-lead-status').value = lead.status;
  document.getElementById('modal-lead-priority').value = lead.priority || 'none';
  
  // Links
  document.getElementById('modal-whatsapp-btn').href = `https://wa.me/${lead.phone.replace(/\D/g,'')}?text=Hello%20${encodeURIComponent(lead.name)}%2C%20this%20is%20OS%20Interiors...`;
  document.getElementById('modal-call-btn').href = `tel:${lead.phone}`;
  
  renderLeadNotes();
  
  document.getElementById('lead-modal-overlay').classList.add('active');
  document.getElementById('lead-modal').classList.add('active');
}

function closeLeadModal() {
  document.getElementById('lead-modal-overlay').classList.remove('active');
  document.getElementById('lead-modal').classList.remove('active');
  selectedLeadId = null;
}

function updateLeadFromModal(field) {
  const lead = leads.find(l => l.id === selectedLeadId);
  if (!lead) return;
  
  const val = document.getElementById('modal-lead-' + field).value;
  const oldVal = lead[field];
  lead[field] = val;
  lead.updatedAt = new Date().toISOString();
  
  // Auto-log note
  if (oldVal !== val) {
    if (!lead.notes) lead.notes = [];
    lead.notes.unshift({
      text: `Status changed from ${oldVal} to ${val}`,
      date: new Date().toLocaleString(),
      system: true
    });
  }
  
  saveLeads();
  renderCurrentPanel();
  renderLeadNotes();
  showToast(`Lead ${field} updated.`);
}

function addLeadNote() {
  const input = document.getElementById('modal-note-input');
  const text = input.value.trim();
  if (!text || !selectedLeadId) return;
  
  const lead = leads.find(l => l.id === selectedLeadId);
  if (!lead.notes) lead.notes = [];
  
  lead.notes.unshift({
    text: text,
    date: new Date().toLocaleString(),
    system: false
  });
  
  input.value = '';
  saveLeads();
  renderLeadNotes();
  showToast('Note added.');
}

function renderLeadNotes() {
  const lead = leads.find(l => l.id === selectedLeadId);
  const container = document.getElementById('modal-notes-timeline');
  if (!container) return;
  
  if (!lead.notes || lead.notes.length === 0) {
    container.innerHTML = '<div style="font-size:0.75rem;color:var(--text-muted);text-align:center;padding:20px;">No activity yet.</div>';
    return;
  }
  
  container.innerHTML = lead.notes.map(n => `
    <div class="note-item ${n.system ? 'system-note' : ''}">
      <div class="note-date">${n.date}</div>
      <div class="note-text">${n.text}</div>
    </div>
  `).join('');
}

function deleteLead(id, event) {
  if (event) event.stopPropagation();
  if (confirm('Are you sure you want to delete this lead?')) {
    leads = leads.filter(l => l.id !== id);
    saveLeads();
    renderCurrentPanel();
    showToast('Lead deleted.');
  }
}

// Add Lead Modal
function showAddLeadModal() {
  document.getElementById('add-lead-overlay').classList.add('active');
  document.getElementById('add-lead-modal').classList.add('active');
}
function closeAddLeadModal() {
  document.getElementById('add-lead-overlay').classList.remove('active');
  document.getElementById('add-lead-modal').classList.remove('active');
}
function handleAddLead(e) {
  e.preventDefault();
  const newLead = {
    id: nextLeadId++,
    name: document.getElementById('add-lead-name').value,
    phone: document.getElementById('add-lead-phone').value,
    email: document.getElementById('add-lead-email').value,
    projectType: document.getElementById('add-lead-type').value,
    source: document.getElementById('add-lead-source').value,
    message: document.getElementById('add-lead-message').value,
    status: 'new',
    priority: 'none',
    notes: [{ text: 'Lead manually added.', date: new Date().toLocaleString(), system: true }],
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  leads.push(newLead);
  saveLeads();
  e.target.reset();
  closeAddLeadModal();
  renderCurrentPanel();
  showToast('Lead added successfully.');
}

// ── PROJECTS ──────────────────────────────────────────
function renderAdminProjectsTable() {
  const tbody = document.getElementById('admin-projects-tbody');
  if (!tbody) return;
  
  document.getElementById('projects-count').textContent = `(${adminProjects.length})`;

  tbody.innerHTML = adminProjects.map(p => `
    <tr>
      <td><img src="${p.cover}" style="width:50px;height:35px;object-fit:cover;border-radius:4px;"></td>
      <td><strong>${p.title}</strong></td>
      <td>${p.category}</td>
      <td>${p.location}</td>
      <td>${p.views.toLocaleString()}</td>
      <td>${p.date}</td>
      <td>
        <div class="admin-actions">
          <button class="action-btn danger" onclick="deleteProject(${p.id})" title="Delete">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

function deleteProject(id) {
  if (confirm('Delete this project?')) {
    adminProjects = adminProjects.filter(p => p.id !== id);
    localStorage.setItem('os_interiors_projects', JSON.stringify(adminProjects));
    renderCurrentPanel();
    showToast('Project deleted.');
  }
}

function handleAddProject(e) {
  e.preventDefault();
  const newProject = {
    id: Date.now(),
    title: document.getElementById('proj-title').value,
    category: document.getElementById('proj-category').value,
    location: document.getElementById('proj-location').value,
    budget: document.getElementById('proj-budget').value,
    area: document.getElementById('proj-area').value,
    description: document.getElementById('proj-description').value,
    views: 0,
    date: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    cover: "images/IMG_2695.JPG"
  };
  
  adminProjects.unshift(newProject);
  localStorage.setItem('os_interiors_projects', JSON.stringify(adminProjects));
  e.target.reset();
  renderCurrentPanel();
  showToast('Project added.');
}

// ── ANALYTICS ─────────────────────────────────────────
function renderAnalytics() {
  document.getElementById('analytics-total').textContent = leads.length;
  const won = leads.filter(l => l.status === 'won').length;
  document.getElementById('analytics-won').textContent = leads.length ? Math.round((won/leads.length)*100) + '%' : '0%';
  
  // Source Chart
  const sources = {};
  leads.forEach(l => { const s = l.source || 'Website'; sources[s] = (sources[s]||0) + 1; });
  const srcC = document.getElementById('analytics-source-chart');
  const maxSrc = Math.max(...Object.values(sources), 1);
  srcC.innerHTML = Object.entries(sources).map(([s, c]) => `
    <div class="chart-bar-item">
      <span class="chart-bar-label">${s}</span>
      <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${(c/maxSrc)*100}%"></div></div>
      <span class="chart-bar-value">${c}</span>
    </div>`).join('');

  // Type Chart
  const types = {};
  leads.forEach(l => { types[l.projectType] = (types[l.projectType]||0) + 1; });
  const typeC = document.getElementById('analytics-type-chart');
  const maxType = Math.max(...Object.values(types), 1);
  typeC.innerHTML = Object.entries(types).map(([t, c]) => `
    <div class="chart-bar-item">
      <span class="chart-bar-label">${t}</span>
      <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${(c/maxType)*100}%"></div></div>
      <span class="chart-bar-value">${c}</span>
    </div>`).join('');
    
  // Project Views
  renderTopProjects();
}

// ── UTILS ─────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4000);
}

function exportLeads() {
  if (!leads.length) { showToast('No leads to export.'); return; }
  const headers = ['ID', 'Name', 'Phone', 'Email', 'Type', 'Source', 'Status', 'Priority', 'Date'];
  const rows = leads.map(l => [l.id, l.name, l.phone, l.email, l.projectType, l.source, l.status, l.priority, l.createdAt]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `OS_Leads_${new Date().toISOString().split('T')[0]}.csv`);
  a.click();
}
