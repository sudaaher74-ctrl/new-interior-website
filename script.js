/* ============================================================
   OS INTERIORS — MAIN JAVASCRIPT
   ============================================================ */

// ── DATA ─────────────────────────────────────────────────────
const PROJECTS = [];

const TESTIMONIALS = [
  { name: "Aditya Birla", role: "CEO, Birla Estates", text: "OS Interiors didn't just design our office — they designed a culture. The space communicates our values better than any brand campaign ever could.", initials: "AB" },
  { name: "Nisha Malhotra", role: "Homeowner, Mumbai", text: "I've worked with designers across Europe and nothing compares to OS Interiors' attention to detail. My penthouse is my most prized possession in the world.", initials: "NM" },
  { name: "Rajan Tata", role: "Director, Tata Realty", text: "We've commissioned OS Interiors for six projects across India. They consistently deliver beyond brief. They are our benchmark partner for all premium developments.", initials: "RT" },
  { name: "Pooja Hegde", role: "Film Producer", text: "My farmhouse became a cover story in Architectural Digest after OS Interiors worked their magic. The design is timeless — it will never feel dated.", initials: "PH" }
];

let leads = [];
let adminProjects = [...PROJECTS];
let nextLeadId = 1;
let nextProjectId = PROJECTS.length + 1;

// ── NAVIGATION ────────────────────────────────────────────────
function navigateTo(pageId, data = null) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) {
    page.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === pageId);
  });

  if (pageId === 'page-project-detail' && data !== null) {
    renderProjectDetail(data);
  }
  if (pageId === 'page-projects') {
    renderProjectsPage();
  }
  closeMobileMenu();
  initRevealAnimations();
}

// ── CUSTOM CURSOR ─────────────────────────────────────────────
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();
}

// ── NAVBAR ────────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── MOBILE MENU ───────────────────────────────────────────────
function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
}

// ── HERO SLIDER ───────────────────────────────────────────────
let heroSlideIndex = 0;
const heroSlides = [
  "images/IMG_2695.JPG",
  "images/IMG_2696.JPG",
  "images/IMG_2705.JPG",
  "images/IMG_2706.JPG"
];

function initHeroSlider() {
  const track = document.getElementById('hero-slides');
  const dotsContainer = document.getElementById('hero-dots');
  if (!track) return;

  track.innerHTML = '';
  dotsContainer.innerHTML = '';

  heroSlides.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'hero-slide' + (i === 0 ? ' active' : '');
    slide.style.backgroundImage = `url('${src}')`;
    track.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToHeroSlide(i);
    dotsContainer.appendChild(dot);
  });

  setInterval(() => {
    heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
    updateHeroSlide();
  }, 5000);
}

function goToHeroSlide(index) {
  heroSlideIndex = index;
  updateHeroSlide();
}

function updateHeroSlide() {
  document.querySelectorAll('.hero-slide').forEach((s, i) => s.classList.toggle('active', i === heroSlideIndex));
  document.querySelectorAll('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === heroSlideIndex));
}

// ── SCROLL ANIMATIONS ─────────────────────────────────────────
function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const children = entry.target.querySelectorAll('.reveal-child');
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('visible'), i * 120);
        });
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── HOME PAGE – FEATURED PROJECTS ─────────────────────────────
function renderFeaturedProjects(filter = 'All') {
  const container = document.getElementById('featured-projects-grid');
  if (!container) return;

  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === filter);
  const display = filtered.slice(0, 5);

  container.innerHTML = display.map((p, i) => {
    const isLarge = i === 0;
    const isWide = i === 3;
    const cls = isLarge ? 'project-card large reveal' : (isWide ? 'project-card wide reveal' : 'project-card reveal');
    return `
      <div class="${cls}" onclick="openProject(${p.id})" style="animation-delay:${i * 0.1}s">
        <img src="${p.cover}" alt="${p.title}" loading="lazy">
        <div class="project-card-info">
          <div class="project-card-meta">
            <span class="project-tag">${p.category}</span>
          </div>
          <h3>${p.title}</h3>
          <p class="project-card-location">📍 ${p.location}</p>
        </div>
        <div class="project-card-hover">
          <button class="project-view-btn">
            View Project
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>`;
  }).join('');

  initRevealAnimations();
}

function openProject(id) {
  const project = PROJECTS.find(p => p.id === id);
  if (project) navigateTo('page-project-detail', project);
}

// ── TESTIMONIALS SLIDER ────────────────────────────────────────
let testimonialIndex = 0;

function initTestimonials() {
  const track = document.getElementById('testimonials-track');
  if (!track) return;

  track.innerHTML = TESTIMONIALS.map(t => `
    <div class="testimonial-slide">
      <div style="display:flex;justify-content:center;gap:4px;margin-bottom:24px;">
        ${[...Array(5)].map(() => `<svg width="14" height="14" fill="#c9a84c" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`).join('')}
      </div>
      <blockquote class="testimonial-quote">"${t.text}"</blockquote>
      <div class="testimonial-author-img">${t.initials}</div>
      <p class="testimonial-name">${t.name}</p>
      <p class="testimonial-role">${t.role}</p>
    </div>
  `).join('');

  setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % TESTIMONIALS.length;
    updateTestimonials();
  }, 5500);
}

function slideTestimonial(dir) {
  testimonialIndex = (testimonialIndex + dir + TESTIMONIALS.length) % TESTIMONIALS.length;
  updateTestimonials();
}

function updateTestimonials() {
  const track = document.getElementById('testimonials-track');
  if (track) track.style.transform = `translateX(-${testimonialIndex * 100}%)`;
}

// ── PROJECTS PAGE ─────────────────────────────────────────────
let projectFilter = 'All';
let searchQuery = '';

function renderProjectsPage() {
  const container = document.getElementById('all-projects-grid');
  if (!container) return;

  let filtered = PROJECTS;
  if (projectFilter !== 'All') filtered = filtered.filter(p => p.category === projectFilter);
  if (searchQuery) filtered = filtered.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:80px;color:var(--text-muted);">
      <p style="font-size:1.1rem;">No projects found matching your criteria.</p>
    </div>`;
    return;
  }

  container.innerHTML = filtered.map((p, i) => `
    <div class="project-card reveal" onclick="openProject(${p.id})" style="animation-delay:${i * 0.08}s">
      <img src="${p.cover}" alt="${p.title}" loading="lazy">
      <div class="project-card-info">
        <div class="project-card-meta">
          <span class="project-tag">${p.category}</span>
          ${p.tags.slice(0, 1).map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
        <h3>${p.title}</h3>
        <p class="project-card-location">📍 ${p.location}</p>
      </div>
      <div class="project-card-hover">
        <button class="project-view-btn">
          View Project
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  initRevealAnimations();
}

function setProjectFilter(filter) {
  projectFilter = filter;
  document.querySelectorAll('#projects-page .filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderProjectsPage();
}

// ── PROJECT DETAIL ─────────────────────────────────────────────
let gallerySlideIndex = 0;
let currentGalleryImages = [];

function renderProjectDetail(project) {
  document.getElementById('detail-hero-img').src = project.cover;
  document.getElementById('detail-hero-img').alt = project.title;
  document.getElementById('detail-title').textContent = project.title;
  document.getElementById('detail-category-tag').textContent = project.category;
  document.getElementById('detail-description').textContent = project.description;
  document.getElementById('detail-tags').innerHTML = project.tags.map(t => `<span class="project-tag">${t}</span>`).join('');

  document.getElementById('spec-category').textContent = project.category;
  document.getElementById('spec-location').textContent = project.location;
  document.getElementById('spec-budget').textContent = project.budget;
  document.getElementById('spec-area').textContent = project.area;
  document.getElementById('spec-date').textContent = project.date;
  document.getElementById('spec-views').textContent = project.views.toLocaleString();

  currentGalleryImages = project.gallery;
  gallerySlideIndex = 0;
  renderGallerySlider();

  document.getElementById('detail-before').src = project.beforeImg;
  document.getElementById('detail-after').src = project.afterImg;

  document.getElementById('detail-testimonial-text').textContent = `"${project.testimonial.text}"`;
  document.getElementById('detail-testimonial-name').textContent = project.testimonial.name;
  document.getElementById('detail-testimonial-role').textContent = project.testimonial.role;
}

function renderGallerySlider() {
  const track = document.getElementById('gallery-track');
  const dots = document.getElementById('gallery-dots');
  if (!track) return;

  track.innerHTML = currentGalleryImages.map(src => `
    <div class="project-gallery-slide">
      <img src="${src}" alt="Project image" loading="lazy">
    </div>
  `).join('');

  dots.innerHTML = currentGalleryImages.map((_, i) => `
    <button class="gallery-dot ${i === 0 ? 'active' : ''}" onclick="goGallerySlide(${i})"></button>
  `).join('');

  updateGallerySlider();
}

function slideGallery(dir) {
  gallerySlideIndex = (gallerySlideIndex + dir + currentGalleryImages.length) % currentGalleryImages.length;
  updateGallerySlider();
}

function goGallerySlide(i) {
  gallerySlideIndex = i;
  updateGallerySlider();
}

function updateGallerySlider() {
  const track = document.getElementById('gallery-track');
  if (track) track.style.transform = `translateX(-${gallerySlideIndex * 100}%)`;
  document.querySelectorAll('.gallery-dot').forEach((d, i) => d.classList.toggle('active', i === gallerySlideIndex));
}

// ── CONTACT FORM ──────────────────────────────────────────────
function handleContactSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const btn = form.querySelector('button[type="submit"]');

  if (!btn) return;
  btn.textContent = 'Sending...';
  btn.disabled = true;

  const newLead = {
    name: document.getElementById('cf-name').value,
    phone: document.getElementById('cf-phone').value,
    email: document.getElementById('cf-email').value,
    projectType: document.getElementById('cf-type').value,
    message: document.getElementById('cf-message').value,
    source: 'Website Form',
    notes: [{ text: 'Lead received from website contact form.', system: true }]
  };

  fetch(window.API_CONFIG.ENDPOINTS.LEADS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newLead)
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to send');
      return res.json();
    })
    .then(() => {
      form.style.display = 'none';
      if (success) success.style.display = 'block';
      showToast('✓ Your inquiry has been received. We will contact you within 24 hours.');
    })
    .catch(err => {
      console.error(err);
      showToast('❌ Failed to send inquiry. Please try again.');
    })
    .finally(() => {
      btn.textContent = 'Send Inquiry';
      btn.disabled = false;
    });
}

// ── HOME FILTER BUTTONS ───────────────────────────────────────
function setHomeFilter(filter) {
  document.querySelectorAll('#home-filter .filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderFeaturedProjects(filter);
}

// ── TOAST ────────────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ── ADMIN: LOGIN ──────────────────────────────────────────────
function handleAdminLogin(e) {
  e.preventDefault();
  const error = document.getElementById('login-error');
  if (!error) return;
  error.style.display = 'block';
  error.textContent = 'Admin sign-in now runs from admin.html with Firebase Authentication.';
}

function adminLogout() {
  document.getElementById('admin-login').style.display = 'flex';
  document.getElementById('admin-dashboard').style.display = 'none';
}

// ── ADMIN: PANELS ─────────────────────────────────────────────
function showAdminPanel(panel) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(btn => btn.classList.remove('active'));
  document.getElementById('panel-' + panel).classList.add('active');
  // Highlight both sidebar + mobile nav buttons
  document.querySelectorAll(`[data-panel="${panel}"]`).forEach(el => el.classList.add('active'));
  document.getElementById('admin-panel-title').textContent = {
    overview: 'Dashboard Overview',
    projects: 'Project Management',
    leads: 'Contact Leads',
    analytics: 'Analytics'
  }[panel] || panel;
  document.getElementById('admin-panel-breadcrumb').textContent = 'Admin / ' + panel;

  if (panel === 'leads') renderLeadsTable();
  if (panel === 'projects') renderAdminProjectsTable();
  if (panel === 'analytics') renderAnalytics();
}

function renderAdminDashboard() {
  const newLeads = leads.filter(l => l.status === 'new').length;
  const contactedLeads = leads.filter(l => l.status === 'contacted').length;
  const followUpRate = leads.length ? Math.round((contactedLeads / leads.length) * 100) + '%' : '0%';
  document.getElementById('stat-visitors').textContent = String(leads.length);
  document.getElementById('stat-projects').textContent = String(newLeads);
  document.getElementById('stat-leads').textContent = String(contactedLeads);
  document.getElementById('stat-conversion').textContent = followUpRate;
  renderRecentLeads();
  renderTopProjects();
}

function renderRecentLeads() {
  const container = document.getElementById('recent-leads-list');
  if (!container) return;
  container.innerHTML = leads.slice(0, 4).map(l => `
    <tr>
      <td><strong style="color:var(--text-primary)">${l.name}</strong></td>
      <td>${l.projectType}</td>
      <td>${l.createdAt}</td>
      <td><span class="status-badge status-${l.status}">${l.status}</span></td>
    </tr>
  `).join('');
}

function renderTopProjects() {
  const container = document.getElementById('top-projects-list');
  if (!container) return;
  const sorted = [...adminProjects].sort((a, b) => b.views - a.views).slice(0, 5);
  container.innerHTML = sorted.map(p => `
    <div class="chart-bar-item">
      <span class="chart-bar-label">${p.title}</span>
      <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${Math.round(p.views / sorted[0].views * 100)}%"></div></div>
      <span class="chart-bar-value">${p.views.toLocaleString()}</span>
    </div>
  `).join('');
}

function renderLeadsTable() {
  const tbody = document.getElementById('leads-tbody');
  if (!tbody) return;
  tbody.innerHTML = leads.map(l => `
    <tr>
      <td><strong style="color:var(--text-primary)">${l.name}</strong></td>
      <td>${l.phone}</td>
      <td>${l.email}</td>
      <td>${l.projectType}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${l.message}</td>
      <td>${l.createdAt}</td>
      <td><span class="status-badge status-${l.status}">${l.status}</span></td>
      <td>
        <div class="admin-actions">
          <button class="action-btn" onclick="toggleLeadStatus(${l.id})" title="Toggle Status">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
          <button class="action-btn danger" onclick="deleteLead(${l.id})" title="Delete">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function toggleLeadStatus(id) {
  const lead = leads.find(l => l.id === id);
  if (lead) {
    lead.status = lead.status === 'new' ? 'contacted' : 'new';
    renderLeadsTable();
    renderAdminDashboard();
    showToast('Lead status updated.');
  }
}

function deleteLead(id) {
  if (confirm('Delete this lead?')) {
    leads = leads.filter(l => l.id !== id);
    renderLeadsTable();
    renderAdminDashboard();
    showToast('Lead deleted.');
  }
}

function exportLeads() {
  const csv = [
    ['Name', 'Phone', 'Email', 'Project Type', 'Message', 'Date', 'Status'],
    ...leads.map(l => [l.name, l.phone, l.email, l.projectType, l.message, l.createdAt, l.status])
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'os-leads.csv';
  a.click();
  showToast('Leads exported to CSV.');
}

function renderAdminProjectsTable() {
  const tbody = document.getElementById('admin-projects-tbody');
  if (!tbody) return;
  tbody.innerHTML = adminProjects.map(p => `
    <tr>
      <td><img src="${p.cover}" style="width:56px;height:40px;object-fit:cover;display:block;"></td>
      <td><strong style="color:var(--text-primary)">${p.title}</strong></td>
      <td>${p.category}</td>
      <td>${p.location}</td>
      <td>${p.views.toLocaleString()}</td>
      <td>${p.date}</td>
      <td>
        <div class="admin-actions">
          <button class="action-btn" onclick="editProject(${p.id})" title="Edit">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="action-btn danger" onclick="deleteProject(${p.id})" title="Delete">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function deleteProject(id) {
  if (confirm('Delete this project?')) {
    adminProjects = adminProjects.filter(p => p.id !== id);
    renderAdminProjectsTable();
    renderAdminDashboard();
    showToast('Project deleted.');
  }
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
    tags: ['New'], views: 0, date: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    cover: "images/IMG_2695.JPG",
    gallery: ["images/IMG_2695.JPG"],
    beforeImg: "images/IMG_2702.JPG",
    afterImg: "images/IMG_2705.JPG",
    testimonial: { name: "Client", role: "Homeowner", text: "Exceptional work by the OS Interiors team." }
  };
  adminProjects.unshift(newProject);
  e.target.reset();
  renderAdminProjectsTable();
  renderAdminDashboard();
  showToast('✓ Project added successfully!');
}

function renderAnalytics() {
  const container = document.getElementById('analytics-projects-chart');
  if (!container) return;
  const sorted = [...adminProjects].sort((a, b) => b.views - a.views);
  if (!sorted.length) {
    container.innerHTML = '';
    const catContainer = document.getElementById('analytics-category-chart');
    if (catContainer) catContainer.innerHTML = '';
    return;
  }
  container.innerHTML = sorted.map(p => `
    <div class="chart-bar-item">
      <span class="chart-bar-label">${p.title}</span>
      <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${Math.round(p.views / sorted[0].views * 100)}%"></div></div>
      <span class="chart-bar-value">${p.views.toLocaleString()}</span>
    </div>
  `).join('');

  const catContainer = document.getElementById('analytics-category-chart');
  const cats = {};
  adminProjects.forEach(p => { cats[p.category] = (cats[p.category] || 0) + p.views; });
  const maxCat = Math.max(...Object.values(cats));
  catContainer.innerHTML = Object.entries(cats).map(([cat, views]) => `
    <div class="chart-bar-item">
      <span class="chart-bar-label">${cat}</span>
      <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${Math.round(views / maxCat * 100)}%"></div></div>
      <span class="chart-bar-value">${views.toLocaleString()}</span>
    </div>
  `).join('');
}

// ── INIT ──────────────────────────────────────────────────────
Object.assign(window, {
  closeMobileMenu,
  goGallerySlide,
  handleContactSubmit,
  navigateTo,
  openProject,
  setHomeFilter,
  setProjectFilter,
  slideGallery,
  slideTestimonial,
  toggleMobileMenu
});

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initHeroSlider();
  initTestimonials();
  renderFeaturedProjects();
  initRevealAnimations();

  // Intersection Observer for all pages
  const observer = new MutationObserver(() => initRevealAnimations());
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // Scroll to trigger animations on initial load
  setTimeout(initRevealAnimations, 300);
});
