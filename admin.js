/* ============================================================
   OS INTERIORS — ADMIN DASHBOARD JS (MongoDB & Express Backend)
   ============================================================ */

// ── DATA STATE ─────────────────────────────────────────────
let leads = [];
let adminProjects = [];
let currentLeadFilter = 'all';
let selectedLeadId = null;

// ── AUTH HELPERS ───────────────────────────────────────────
function getToken() {
    return localStorage.getItem('os_admin_token');
}

function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'x-auth-token': getToken()
    };
}

// ── CORE INITIALIZATION ─────────────────────────────────────
async function initAdmin() {
    await loadLeads();
    await loadProjects();
    renderAdminDashboard();
}

async function loadLeads() {
    try {
        const res = await fetch(window.API_CONFIG.ENDPOINTS.LEADS, {
            headers: getAuthHeaders()
        });
        if (res.status === 401) return adminLogout();
        leads = await res.json();
    } catch (err) {
        console.error('Error loading leads:', err);
        showToast('Error loading leads.');
    }
}

async function loadProjects() {
    try {
        const res = await fetch(window.API_CONFIG.ENDPOINTS.PROJECTS);
        adminProjects = await res.json();
    } catch (err) {
        console.error('Error loading projects:', err);
        showToast('Error loading projects.');
    }
}

// ── LOGIN ─────────────────────────────────────────────
async function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const error = document.getElementById('login-error');
    
    try {
        const res = await fetch(window.API_CONFIG.ENDPOINTS.LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            localStorage.setItem('os_admin_token', data.token);
            document.getElementById('admin-login').style.display = 'none';
            document.getElementById('admin-dashboard').style.display = 'block';
            initAdmin();
        } else {
            error.style.display = 'block';
            error.textContent = data.msg || 'Invalid credentials.';
        }
    } catch (err) {
        error.style.display = 'block';
        error.textContent = 'Server connection failed.';
    }
}

// Auto-login if token exists
if (getToken()) {
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        initAdmin();
    });
}

function adminLogout() {
    localStorage.removeItem('os_admin_token');
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
    
    const recent = [...leads].slice(0, 5);
    if (!recent.length) {
        c.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--text-muted);">No leads yet.</td></tr>';
        return;
    }
    
    c.innerHTML = recent.map(l => `
        <tr onclick="viewLead('${l._id}')" style="cursor:pointer;">
            <td><strong>${l.name}</strong></td>
            <td>${l.projectType}</td>
            <td>${new Date(l.createdAt).toLocaleDateString()}</td>
            <td><span class="status-badge status-${l.status}">${l.status}</span></td>
            <td><span class="priority-tag priority-${l.priority || 'none'}">${l.priority || '—'}</span></td>
        </tr>`).join('');
}

function renderTopProjects() {
    const c = document.getElementById('top-projects-list');
    if (!c) return;
    if (!adminProjects.length) {
        c.innerHTML = '<p style="text-align:center;padding:20px;color:var(--text-muted);">No projects yet.</p>';
        return;
    }
    const sorted = [...adminProjects].sort((a,b) => b.views - a.views).slice(0,5);
    const maxViews = sorted[0].views || 1;
    c.innerHTML = sorted.map(p => `
        <div class="chart-bar-item">
            <span class="chart-bar-label">${p.title}</span>
            <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${Math.round(p.views/maxViews*100)}%"></div></div>
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

    let filtered = [...leads];
    if (currentLeadFilter !== 'all') filtered = filtered.filter(l => l.status === currentLeadFilter);
    if (search) {
        filtered = filtered.filter(l => 
            l.name.toLowerCase().includes(search) || 
            (l.phone && l.phone.includes(search)) || 
            (l.email && l.email.toLowerCase().includes(search))
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
            <td>${l.phone || '—'}</td>
            <td>${l.projectType}</td>
            <td><span style="font-size:0.7rem;color:var(--text-muted);">${l.source || 'Website'}</span></td>
            <td>${new Date(l.createdAt).toLocaleDateString()}</td>
            <td><span class="priority-tag priority-${l.priority || 'none'}">${l.priority || '—'}</span></td>
            <td><span class="status-badge status-${l.status}">${l.status}</span></td>
            <td>
                <div class="admin-actions">
                    <button class="action-btn" onclick="viewLead('${l._id}')" title="View Details">
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14" height="14"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </button>
                    <button class="action-btn danger" onclick="deleteLead('${l._id}', event)" title="Delete">
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        </tr>`).join('');
}

function viewLead(id) {
    const lead = leads.find(l => l._id === id);
    if (!lead) return;
    
    selectedLeadId = id;
    document.getElementById('modal-lead-name').textContent = lead.name;
    document.getElementById('modal-lead-date').textContent = 'Received: ' + new Date(lead.createdAt).toLocaleString();
    document.getElementById('modal-lead-phone').textContent = lead.phone || '—';
    document.getElementById('modal-lead-email').textContent = lead.email || '—';
    document.getElementById('modal-lead-type').textContent = lead.projectType;
    document.getElementById('modal-lead-source').textContent = lead.source || 'Website Form';
    document.getElementById('modal-lead-message').textContent = lead.message || 'No message provided.';
    document.getElementById('modal-lead-status').value = lead.status;
    document.getElementById('modal-lead-priority').value = lead.priority || 'none';
    
    // Links
    if (lead.phone) {
        document.getElementById('modal-whatsapp-btn').href = `https://wa.me/${lead.phone.replace(/\D/g,'')}?text=Hello%20${encodeURIComponent(lead.name)}%2C%20this%20is%20OS%20Interiors...`;
        document.getElementById('modal-call-btn').href = `tel:${lead.phone}`;
        document.getElementById('modal-whatsapp-btn').style.display = 'inline-flex';
        document.getElementById('modal-call-btn').style.display = 'inline-flex';
    } else {
        document.getElementById('modal-whatsapp-btn').style.display = 'none';
        document.getElementById('modal-call-btn').style.display = 'none';
    }
    
    renderLeadNotes();
    
    document.getElementById('lead-modal-overlay').classList.add('active');
    document.getElementById('lead-modal').classList.add('active');
}

function closeLeadModal() {
    document.getElementById('lead-modal-overlay').classList.remove('active');
    document.getElementById('lead-modal').classList.remove('active');
    selectedLeadId = null;
}

async function updateLeadFromModal(field) {
    const lead = leads.find(l => l._id === selectedLeadId);
    if (!lead) return;
    
    const val = document.getElementById('modal-lead-' + field).value;
    const oldVal = lead[field];
    
    if (oldVal === val) return;

    const updateData = { [field]: val };
    
    // Auto-log note
    const systemNote = {
        text: `${field.charAt(0).toUpperCase() + field.slice(1)} changed from ${oldVal} to ${val}`,
        system: true
    };
    
    try {
        const res = await fetch(`${window.API_CONFIG.ENDPOINTS.LEADS}/${selectedLeadId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                ...updateData,
                $push: { notes: systemNote }
            })
        });
        
        if (res.ok) {
            await loadLeads();
            renderCurrentPanel();
            renderLeadNotes();
            showToast(`Lead ${field} updated.`);
        }
    } catch (err) {
        showToast('Update failed.');
    }
}

async function addLeadNote() {
    const input = document.getElementById('modal-note-input');
    const text = input.value.trim();
    if (!text || !selectedLeadId) return;
    
    const note = { text, system: false };
    
    try {
        const res = await fetch(`${window.API_CONFIG.ENDPOINTS.LEADS}/${selectedLeadId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                $push: { notes: note }
            })
        });
        
        if (res.ok) {
            input.value = '';
            await loadLeads();
            renderLeadNotes();
            showToast('Note added.');
        }
    } catch (err) {
        showToast('Failed to add note.');
    }
}

function renderLeadNotes() {
    const lead = leads.find(l => l._id === selectedLeadId);
    const container = document.getElementById('modal-notes-timeline');
    if (!container) return;
    
    if (!lead.notes || lead.notes.length === 0) {
        container.innerHTML = '<div style="font-size:0.75rem;color:var(--text-muted);text-align:center;padding:20px;">No activity yet.</div>';
        return;
    }
    
    container.innerHTML = [...lead.notes].reverse().map(n => `
        <div class="note-item ${n.system ? 'system-note' : ''}">
            <div class="note-date">${new Date(n.date).toLocaleString()}</div>
            <div class="note-text">${n.text}</div>
        </div>
    `).join('');
}

async function deleteLead(id, event) {
    if (event) event.stopPropagation();
    if (confirm('Are you sure you want to delete this lead?')) {
        try {
            const res = await fetch(`${window.API_CONFIG.ENDPOINTS.LEADS}/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                await loadLeads();
                renderCurrentPanel();
                showToast('Lead deleted.');
            }
        } catch (err) {
            showToast('Delete failed.');
        }
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
async function handleAddLead(e) {
    e.preventDefault();
    const newLead = {
        name: document.getElementById('add-lead-name').value,
        phone: document.getElementById('add-lead-phone').value,
        email: document.getElementById('add-lead-email').value,
        projectType: document.getElementById('add-lead-type').value,
        source: document.getElementById('add-lead-source').value,
        message: document.getElementById('add-lead-message').value,
        status: 'new',
        priority: 'none',
        notes: [{ text: 'Lead manually added.', system: true }]
    };
    
    try {
        const res = await fetch(window.API_CONFIG.ENDPOINTS.LEADS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newLead)
        });
        
        if (res.ok) {
            await loadLeads();
            e.target.reset();
            closeAddLeadModal();
            renderCurrentPanel();
            showToast('Lead added successfully.');
        }
    } catch (err) {
        showToast('Failed to add lead.');
    }
}

// ── PROJECTS ──────────────────────────────────────────
function renderAdminProjectsTable() {
    const tbody = document.getElementById('admin-projects-tbody');
    if (!tbody) return;
    
    document.getElementById('projects-count').textContent = `(${adminProjects.length})`;

    tbody.innerHTML = adminProjects.map(p => `
        <tr>
            <td><img src="${p.cover || 'images/IMG_2695.JPG'}" style="width:50px;height:35px;object-fit:cover;border-radius:4px;"></td>
            <td><strong>${p.title}</strong></td>
            <td>${p.category}</td>
            <td>${p.location}</td>
            <td>${p.views.toLocaleString()}</td>
            <td>${p.date || '—'}</td>
            <td>
                <div class="admin-actions">
                    <button class="action-btn danger" onclick="deleteProject('${p._id}')" title="Delete">
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        </tr>`).join('');
}

async function deleteProject(id) {
    if (confirm('Delete this project?')) {
        try {
            const res = await fetch(`${window.API_CONFIG.ENDPOINTS.PROJECTS}/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                await loadProjects();
                renderCurrentPanel();
                showToast('Project deleted.');
            }
        } catch (err) {
            showToast('Delete failed.');
        }
    }
}

async function handleAddProject(e) {
    e.preventDefault();
    const newProject = {
        title: document.getElementById('proj-title').value,
        category: document.getElementById('proj-category').value,
        location: document.getElementById('proj-location').value,
        budget: document.getElementById('proj-budget').value,
        area: document.getElementById('proj-area').value,
        description: document.getElementById('proj-description').value,
        views: 0,
        date: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
        cover: "images/IMG_2695.JPG", // Placeholder
        tags: ["New"]
    };
    
    try {
        const res = await fetch(window.API_CONFIG.ENDPOINTS.PROJECTS, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(newProject)
        });
        
        if (res.ok) {
            await loadProjects();
            e.target.reset();
            renderCurrentPanel();
            showToast('Project added.');
        }
    } catch (err) {
        showToast('Failed to add project.');
    }
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
    if (srcC) {
        const maxSrc = Math.max(...Object.values(sources), 1);
        srcC.innerHTML = Object.entries(sources).map(([s, c]) => `
            <div class="chart-bar-item">
                <span class="chart-bar-label">${s}</span>
                <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${(c/maxSrc)*100}%"></div></div>
                <span class="chart-bar-value">${c}</span>
            </div>`).join('');
    }

    // Type Chart
    const types = {};
    leads.forEach(l => { types[l.projectType] = (types[l.projectType]||0) + 1; });
    const typeC = document.getElementById('analytics-type-chart');
    if (typeC) {
        const maxType = Math.max(...Object.values(types), 1);
        typeC.innerHTML = Object.entries(types).map(([t, c]) => `
            <div class="chart-bar-item">
                <span class="chart-bar-label">${t}</span>
                <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${(c/maxType)*100}%"></div></div>
                <span class="chart-bar-value">${c}</span>
            </div>`).join('');
    }
        
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
    const rows = leads.map(l => [l._id, l.name, l.phone, l.email, l.projectType, l.source, l.status, l.priority, l.createdAt]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `OS_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
}

// Expose functions to window
window.showAdminPanel = showAdminPanel;
window.setLeadFilter = setLeadFilter;
window.viewLead = viewLead;
window.closeLeadModal = closeLeadModal;
window.updateLeadFromModal = updateLeadFromModal;
window.addLeadNote = addLeadNote;
window.deleteLead = deleteLead;
window.showAddLeadModal = showAddLeadModal;
window.closeAddLeadModal = closeAddLeadModal;
window.handleAddLead = handleAddLead;
window.deleteProject = deleteProject;
window.handleAddProject = handleAddProject;
window.adminLogout = adminLogout;
window.handleAdminLogin = handleAdminLogin;
window.exportLeads = exportLeads;
