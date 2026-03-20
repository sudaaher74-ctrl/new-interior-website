import {
  FIREBASE_COLLECTIONS,
  addDoc,
  auth,
  collection,
  db,
  deleteDoc,
  doc,
  firebaseReady,
  firebaseSetupError,
  getDoc,
  onAuthStateChanged,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  signInWithEmailAndPassword,
  signOut,
  updateDoc
} from './firebase-client.js';

let leads = [];
let adminProjects = [];
let activePanel = 'overview';
let currentProjectEditId = null;
let leadsUnsubscribe = null;
let projectsUnsubscribe = null;
let retainedLoginMessage = '';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeDateValue(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function formatDisplayDate(value) {
  const dateValue = normalizeDateValue(value);
  if (!dateValue) return '-';

  return dateValue.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function formatProjectDate(value) {
  const dateValue = normalizeDateValue(value);
  if (!dateValue) return '-';

  return dateValue.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric'
  });
}

function formatStatusLabel(status) {
  const normalizedStatus = String(status || 'new').trim().toLowerCase();
  return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
}

function getStatusClass(status) {
  return String(status || 'new').trim().toLowerCase();
}

function renderEmptyTableRow(columnCount, message) {
  return `
    <tr>
      <td colspan="${columnCount}">
        <div class="empty-state">${escapeHtml(message)}</div>
      </td>
    </tr>
  `;
}

function renderEmptyBlock(container, message) {
  container.innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
}

function renderBarChart(containerId, items, emptyMessage, valueFormatter = value => String(value)) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!items.length) {
    renderEmptyBlock(container, emptyMessage);
    return;
  }

  const maxValue = Math.max(...items.map(item => item.value), 1);
  container.innerHTML = items.map(item => {
    const width = item.value > 0 ? Math.max(Math.round((item.value / maxValue) * 100), 8) : 0;
    return `
      <div class="chart-bar-item">
        <span class="chart-bar-label">${escapeHtml(item.label)}</span>
        <div class="chart-bar-track">
          <div class="chart-bar-fill" style="width:${width}%"></div>
        </div>
        <span class="chart-bar-value">${escapeHtml(valueFormatter(item.value))}</span>
      </div>
    `;
  }).join('');
}

function getLeadTypeCounts() {
  const counts = leads.reduce((result, lead) => {
    const label = String(lead.projectType || 'Unspecified').trim() || 'Unspecified';
    result[label] = (result[label] || 0) + 1;
    return result;
  }, {});

  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((firstItem, secondItem) => secondItem.value - firstItem.value || firstItem.label.localeCompare(secondItem.label));
}

function getLeadStatusCounts() {
  const counts = leads.reduce((result, lead) => {
    const label = formatStatusLabel(lead.status);
    result[label] = (result[label] || 0) + 1;
    return result;
  }, {});

  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((firstItem, secondItem) => secondItem.value - firstItem.value || firstItem.label.localeCompare(secondItem.label));
}

function setLoginMessage(message, isError = true) {
  const error = document.getElementById('login-error');
  if (!error) return;

  error.style.display = message ? 'block' : 'none';
  error.textContent = message;
  error.style.color = isError ? '#dc2626' : 'var(--text-muted)';
}

function setLoginFormDisabled(disabled) {
  document.querySelectorAll('#admin-login input, #admin-login button').forEach(element => {
    element.disabled = disabled;
  });
}

function showLoggedOutState() {
  document.getElementById('admin-login').style.display = 'flex';
  document.getElementById('admin-dashboard').style.display = 'none';
}

function showLoggedInState() {
  document.getElementById('admin-login').style.display = 'none';
  document.getElementById('admin-dashboard').style.display = 'block';
}

function normalizeLeadRecord(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name || '',
    phone: data.phone || '',
    email: data.email || '',
    projectType: data.projectType || '',
    message: data.message || '',
    status: data.status || 'new',
    createdAt: data.createdAt || null
  };
}

function normalizeProjectRecord(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    title: data.title || '',
    category: data.category || 'Residential',
    location: data.location || '',
    budget: data.budget || '',
    area: data.area || '',
    description: data.description || '',
    tags: Array.isArray(data.tags) ? data.tags : ['New'],
    views: Number(data.views) || 0,
    cover: data.cover || 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=90',
    gallery: Array.isArray(data.gallery) ? data.gallery : [],
    beforeImg: data.beforeImg || '',
    afterImg: data.afterImg || '',
    testimonial: data.testimonial || { name: 'Client', role: 'Homeowner', text: 'Exceptional work.' },
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null
  };
}

function teardownListeners() {
  if (typeof leadsUnsubscribe === 'function') {
    leadsUnsubscribe();
    leadsUnsubscribe = null;
  }

  if (typeof projectsUnsubscribe === 'function') {
    projectsUnsubscribe();
    projectsUnsubscribe = null;
  }
}

async function userHasAdminAccess(user) {
  if (!db || !user) return false;

  const adminDoc = await getDoc(doc(db, FIREBASE_COLLECTIONS.admins, user.uid));
  return adminDoc.exists();
}

function updateProjectFormUi() {
  const title = document.getElementById('project-form-title');
  const submitButton = document.getElementById('project-submit-btn');
  const clearButton = document.getElementById('project-clear-btn');

  if (title) {
    title.textContent = currentProjectEditId ? 'Edit Project' : 'Add New Project';
  }

  if (submitButton) {
    submitButton.textContent = currentProjectEditId ? 'Update Project' : 'Add Project';
  }

  if (clearButton) {
    clearButton.textContent = currentProjectEditId ? 'Cancel Edit' : 'Clear Form';
  }
}

function resetProjectForm() {
  const form = document.querySelector('.add-project-form');
  if (form) form.reset();
  currentProjectEditId = null;
  updateProjectFormUi();
}

function refreshActivePanel() {
  renderAdminDashboard();

  if (activePanel === 'leads') renderLeadsTable();
  if (activePanel === 'projects') renderAdminProjectsTable();
  if (activePanel === 'analytics') renderAnalytics();
}

function formatAuthError(error) {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return 'Unable to sign in right now. Please try again.';
  }
}

function startRealtimeListeners() {
  teardownListeners();

  leadsUnsubscribe = onSnapshot(
    query(collection(db, FIREBASE_COLLECTIONS.leads), orderBy('createdAt', 'desc')),
    snapshot => {
      leads = snapshot.docs.map(normalizeLeadRecord);
      refreshActivePanel();
    },
    error => {
      console.error('Unable to load leads from Firestore.', error);
      showToast('Unable to load leads. Check your Firestore rules.');
    }
  );

  projectsUnsubscribe = onSnapshot(
    query(collection(db, FIREBASE_COLLECTIONS.projects), orderBy('createdAt', 'desc')),
    snapshot => {
      adminProjects = snapshot.docs.map(normalizeProjectRecord);
      refreshActivePanel();
    },
    error => {
      console.error('Unable to load projects from Firestore.', error);
      showToast('Unable to load projects. Check your Firestore rules.');
    }
  );
}

async function handleAdminAuthState(user) {
  if (!firebaseReady || !auth || !db) {
    showLoggedOutState();
    setLoginFormDisabled(true);
    setLoginMessage(firebaseSetupError);
    return;
  }

  if (!user) {
    teardownListeners();
    showLoggedOutState();
    setLoginFormDisabled(false);
    if (retainedLoginMessage) {
      setLoginMessage(retainedLoginMessage);
      retainedLoginMessage = '';
    } else {
      setLoginMessage('');
    }
    return;
  }

  try {
    const hasAccess = await userHasAdminAccess(user);
    if (!hasAccess) {
      retainedLoginMessage = `This account is signed in but not approved yet. Create Firestore document admins/${user.uid} to grant access.`;
      await signOut(auth);
      return;
    }

    retainedLoginMessage = '';
    setLoginMessage('');
    showLoggedInState();
    setLoginFormDisabled(false);
    startRealtimeListeners();
    showAdminPanel(activePanel);
  } catch (error) {
    console.error('Unable to verify admin access.', error);
    retainedLoginMessage = 'Unable to verify admin access. Check Firestore rules and try again.';
    await signOut(auth);
  }
}

async function handleAdminLogin(event) {
  event.preventDefault();

  if (!firebaseReady || !auth || !db) {
    setLoginMessage(firebaseSetupError);
    return;
  }

  const email = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-password').value;

  setLoginFormDisabled(true);
  setLoginMessage('Signing in...', false);

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Unable to sign in.', error);
    setLoginMessage(formatAuthError(error));
    setLoginFormDisabled(false);
  }
}

async function adminLogout() {
  if (!auth) {
    showLoggedOutState();
    return;
  }

  try {
    await signOut(auth);
  } catch (error) {
    console.error('Unable to sign out.', error);
    showToast('Unable to sign out right now.');
  }
}

function showAdminPanel(panel) {
  activePanel = panel;

  document.querySelectorAll('.admin-panel').forEach(panelElement => panelElement.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(button => button.classList.remove('active'));

  const panelElement = document.getElementById(`panel-${panel}`);
  if (panelElement) panelElement.classList.add('active');
  document.querySelectorAll(`[data-panel="${panel}"]`).forEach(button => button.classList.add('active'));

  document.getElementById('admin-panel-title').textContent = {
    overview: 'Dashboard Overview',
    projects: 'Project Management',
    leads: 'Customer Leads',
    analytics: 'Lead Analytics'
  }[panel] || panel;

  document.getElementById('admin-panel-breadcrumb').textContent = `Admin / ${panel}`;

  if (panel === 'leads') renderLeadsTable();
  if (panel === 'projects') renderAdminProjectsTable();
  if (panel === 'analytics') renderAnalytics();
}

function renderAdminDashboard() {
  const totalLeads = leads.length;
  const newLeads = leads.filter(lead => getStatusClass(lead.status) === 'new').length;
  const contactedLeads = leads.filter(lead => getStatusClass(lead.status) === 'contacted').length;
  const followUpRate = totalLeads ? `${Math.round((contactedLeads / totalLeads) * 100)}%` : '0%';

  document.getElementById('stat-visitors').textContent = String(totalLeads);
  document.getElementById('stat-projects').textContent = String(newLeads);
  document.getElementById('stat-leads').textContent = String(contactedLeads);
  document.getElementById('stat-conversion').textContent = followUpRate;

  renderRecentLeads();
  renderBarChart(
    'top-projects-list',
    getLeadTypeCounts(),
    'Inquiry types will appear here after customers submit the website form.'
  );
}

function renderRecentLeads() {
  const container = document.getElementById('recent-leads-list');
  if (!container) return;

  if (!leads.length) {
    container.innerHTML = renderEmptyTableRow(4, 'No customer inquiries yet. New form submissions will appear here automatically.');
    return;
  }

  container.innerHTML = leads.slice(0, 4).map(lead => `
    <tr>
      <td><strong style="color:var(--text-primary)">${escapeHtml(lead.name || 'Unknown')}</strong></td>
      <td>${escapeHtml(lead.projectType || 'Unspecified')}</td>
      <td>${formatDisplayDate(lead.createdAt)}</td>
      <td><span class="status-badge status-${escapeHtml(getStatusClass(lead.status))}">${escapeHtml(formatStatusLabel(lead.status))}</span></td>
    </tr>
  `).join('');
}

function renderLeadsTable() {
  const tbody = document.getElementById('leads-tbody');
  if (!tbody) return;

  if (!leads.length) {
    tbody.innerHTML = renderEmptyTableRow(8, 'No customer inquiries have been submitted from the website yet.');
    return;
  }

  tbody.innerHTML = leads.map(lead => `
    <tr>
      <td><strong style="color:var(--text-primary)">${escapeHtml(lead.name || 'Unknown')}</strong></td>
      <td>${escapeHtml(lead.phone || '-')}</td>
      <td>${escapeHtml(lead.email || '-')}</td>
      <td>${escapeHtml(lead.projectType || 'Unspecified')}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(lead.message || '-')}</td>
      <td>${formatDisplayDate(lead.createdAt)}</td>
      <td><span class="status-badge status-${escapeHtml(getStatusClass(lead.status))}">${escapeHtml(formatStatusLabel(lead.status))}</span></td>
      <td>
        <div class="admin-actions">
          <button class="action-btn" onclick="toggleLeadStatus('${escapeHtml(lead.id)}')" title="Toggle Status">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
          <button class="action-btn danger" onclick="deleteLead('${escapeHtml(lead.id)}')" title="Delete">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function toggleLeadStatus(id) {
  const lead = leads.find(item => item.id === id);
  if (!lead) return;

  const nextStatus = getStatusClass(lead.status) === 'new' ? 'contacted' : 'new';
  try {
    await updateDoc(doc(db, FIREBASE_COLLECTIONS.leads, id), {
      status: nextStatus,
      updatedAt: serverTimestamp()
    });
    showToast('Lead status updated.');
  } catch (error) {
    console.error('Unable to update lead status.', error);
    showToast('Unable to update the lead right now.');
  }
}

async function deleteLead(id) {
  if (!confirm('Delete this lead?')) return;

  try {
    await deleteDoc(doc(db, FIREBASE_COLLECTIONS.leads, id));
    showToast('Lead deleted.');
  } catch (error) {
    console.error('Unable to delete lead.', error);
    showToast('Unable to delete the lead right now.');
  }
}

function csvEscape(value) {
  const safeValue = String(value ?? '');
  const escaped = /^[=+\-@]/.test(safeValue) ? `'${safeValue}` : safeValue;
  return `"${escaped.replace(/"/g, '""')}"`;
}

function exportLeads() {
  if (!leads.length) {
    showToast('No leads to export yet.');
    return;
  }

  const csv = [
    ['Name', 'Phone', 'Email', 'Project Type', 'Message', 'Date', 'Status'],
    ...leads.map(lead => [
      lead.name,
      lead.phone,
      lead.email,
      lead.projectType,
      lead.message,
      formatDisplayDate(lead.createdAt),
      lead.status
    ])
  ].map(row => row.map(csvEscape).join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');

  link.href = URL.createObjectURL(blob);
  link.download = 'os-leads.csv';
  link.click();

  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  showToast('Leads exported to CSV.');
}

function renderAdminProjectsTable() {
  const tbody = document.getElementById('admin-projects-tbody');
  const projectsCount = document.getElementById('projects-count');
  if (!tbody) return;

  if (projectsCount) {
    const projectLabel = adminProjects.length === 1 ? 'project' : 'projects';
    projectsCount.textContent = `${adminProjects.length} ${projectLabel} saved`;
  }

  if (!adminProjects.length) {
    tbody.innerHTML = renderEmptyTableRow(7, 'No admin projects have been added yet.');
    return;
  }

  tbody.innerHTML = adminProjects.map(project => `
    <tr>
      <td><img src="${escapeHtml(project.cover)}" alt="${escapeHtml(project.title || 'Project cover')}" style="width:56px;height:40px;object-fit:cover;display:block;border-radius:4px;"></td>
      <td><strong style="color:var(--text-primary)">${escapeHtml(project.title || 'Untitled Project')}</strong></td>
      <td>${escapeHtml(project.category || '-')}</td>
      <td>${escapeHtml(project.location || '-')}</td>
      <td>${escapeHtml(String(project.views || 0))}</td>
      <td>${formatProjectDate(project.createdAt || project.updatedAt)}</td>
      <td>
        <div class="admin-actions">
          <button class="action-btn" onclick="editProject('${escapeHtml(project.id)}')" title="Edit">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="action-btn danger" onclick="deleteProject('${escapeHtml(project.id)}')" title="Delete">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function deleteProject(id) {
  if (!confirm('Delete this project?')) return;

  try {
    await deleteDoc(doc(db, FIREBASE_COLLECTIONS.projects, id));
    if (currentProjectEditId === id) resetProjectForm();
    showToast('Project deleted.');
  } catch (error) {
    console.error('Unable to delete project.', error);
    showToast('Unable to delete the project right now.');
  }
}

function editProject(id) {
  const project = adminProjects.find(item => item.id === id);
  if (!project) return;

  currentProjectEditId = id;
  document.getElementById('add-project-form').scrollIntoView({ behavior: 'smooth' });
  document.getElementById('proj-title').value = project.title || '';
  document.getElementById('proj-category').value = project.category || 'Residential';
  document.getElementById('proj-location').value = project.location || '';
  document.getElementById('proj-budget').value = project.budget || '';
  document.getElementById('proj-area').value = project.area || '';
  document.getElementById('proj-description').value = project.description || '';

  updateProjectFormUi();
  showToast('Project loaded. Save the form to update it.');
}

async function handleAddProject(event) {
  event.preventDefault();

  const submitButton = document.getElementById('project-submit-btn');
  const form = event.target;
  const existingProject = adminProjects.find(project => project.id === currentProjectEditId) || {};
  const payload = {
    title: document.getElementById('proj-title').value.trim(),
    category: document.getElementById('proj-category').value,
    location: document.getElementById('proj-location').value.trim(),
    budget: document.getElementById('proj-budget').value.trim(),
    area: document.getElementById('proj-area').value.trim(),
    description: document.getElementById('proj-description').value.trim(),
    tags: Array.isArray(existingProject.tags) && existingProject.tags.length ? existingProject.tags : ['New'],
    views: Number(existingProject.views) || 0,
    cover: existingProject.cover || 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=90',
    gallery: Array.isArray(existingProject.gallery) ? existingProject.gallery : [],
    beforeImg: existingProject.beforeImg || '',
    afterImg: existingProject.afterImg || '',
    testimonial: existingProject.testimonial || { name: 'Client', role: 'Homeowner', text: 'Exceptional work.' },
    updatedAt: serverTimestamp()
  };

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = currentProjectEditId ? 'Updating...' : 'Saving...';
  }

  try {
    if (currentProjectEditId) {
      await updateDoc(doc(db, FIREBASE_COLLECTIONS.projects, currentProjectEditId), payload);
      showToast('Project updated.');
    } else {
      await addDoc(collection(db, FIREBASE_COLLECTIONS.projects), {
        ...payload,
        createdAt: serverTimestamp()
      });
      showToast('Project added successfully.');
    }

    form.reset();
    currentProjectEditId = null;
    updateProjectFormUi();
  } catch (error) {
    console.error('Unable to save project.', error);
    showToast('Unable to save the project right now.');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = currentProjectEditId ? 'Update Project' : 'Add Project';
    }
  }
}

function renderRecentMessages() {
  const container = document.getElementById('analytics-recent-messages');
  if (!container) return;

  if (!leads.length) {
    renderEmptyBlock(container, 'Customer messages will appear here after the website form is submitted.');
    return;
  }

  container.innerHTML = leads.slice(0, 4).map(lead => `
    <div class="message-item">
      <div class="message-meta">
        <div class="message-author">${escapeHtml(lead.name || 'Unknown')}</div>
        <div class="message-date">${formatDisplayDate(lead.createdAt)}</div>
      </div>
      <div class="message-type">${escapeHtml(lead.projectType || 'Unspecified')}</div>
      <p class="message-snippet">${escapeHtml(lead.message || 'No message provided.')}</p>
    </div>
  `).join('');
}

function renderAnalytics() {
  const totalLeads = leads.length;
  const newLeads = leads.filter(lead => getStatusClass(lead.status) === 'new').length;
  const contactedLeads = leads.filter(lead => getStatusClass(lead.status) === 'contacted').length;
  const followUpRate = totalLeads ? `${Math.round((contactedLeads / totalLeads) * 100)}%` : '0%';

  document.getElementById('analytics-total-inquiries').textContent = String(totalLeads);
  document.getElementById('analytics-new-inquiries').textContent = String(newLeads);
  document.getElementById('analytics-contacted').textContent = String(contactedLeads);
  document.getElementById('analytics-follow-up').textContent = followUpRate;

  renderBarChart(
    'analytics-projects-chart',
    getLeadTypeCounts(),
    'Inquiry type analytics will appear after the first website submission.'
  );

  renderBarChart(
    'analytics-category-chart',
    getLeadStatusCounts(),
    'Lead status analytics will appear after the first website submission.'
  );

  renderRecentMessages();
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

Object.assign(window, {
  adminLogout,
  deleteLead,
  deleteProject,
  editProject,
  exportLeads,
  handleAddProject,
  handleAdminLogin,
  resetProjectForm,
  showAdminPanel,
  toggleLeadStatus
});

updateProjectFormUi();
showLoggedOutState();

if (firebaseReady && auth && db) {
  onAuthStateChanged(auth, user => {
    handleAdminAuthState(user);
  });
} else {
  setLoginFormDisabled(true);
  setLoginMessage(firebaseSetupError);
}
