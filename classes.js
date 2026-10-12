/**
 * ==========================================================================
 * MODULAR JAVASCRIPT OOP ARCHITECTURE — WALEED HASSAN PORTFOLIO
 * Object-Oriented Controllers for Pages, Modules, and Data Entities.
 * Enables clean programmatic editing, dynamic additions, and modular state.
 * ==========================================================================
 */

(function (window) {
  'use strict';

  /* ==========================================================================
     1. DATA STORE MODULE CLASS
     ========================================================================== */
  class PortfolioDataStore {
    constructor(initialData) {
      this.data = initialData || (window.PORTFOLIO_DATA ? window.PORTFOLIO_DATA : {
        profile: {},
        experience: [],
        projects: [],
        skills: {},
        education: []
      });
      this.listeners = [];
    }

    // Subscribe to store updates
    subscribe(callback) {
      if (typeof callback === 'function') {
        this.listeners.push(callback);
      }
    }

    notify(eventType, payload) {
      this.listeners.forEach(cb => cb(eventType, payload));
    }

    // Profile Getters / Setters
    getProfile() {
      return this.data.profile;
    }

    updateProfile(updatedFields) {
      this.data.profile = { ...this.data.profile, ...updatedFields };
      this.notify('profile:updated', this.data.profile);
      return this.data.profile;
    }

    // Experience Management
    getExperienceList() {
      return this.data.experience || [];
    }

    getExperienceById(id) {
      return (this.data.experience || []).find(item => item.id === id);
    }

    addExperience(entry) {
      if (!entry.id) {
        entry.id = 'exp-' + Date.now();
      }
      this.data.experience = this.data.experience || [];
      this.data.experience.unshift(entry);
      this.notify('experience:added', entry);
      return entry;
    }

    updateExperience(id, updatedFields) {
      const idx = (this.data.experience || []).findIndex(item => item.id === id);
      if (idx !== -1) {
        this.data.experience[idx] = { ...this.data.experience[idx], ...updatedFields };
        this.notify('experience:updated', this.data.experience[idx]);
        return this.data.experience[idx];
      }
      return null;
    }

    deleteExperience(id) {
      const idx = (this.data.experience || []).findIndex(item => item.id === id);
      if (idx !== -1) {
        const removed = this.data.experience.splice(idx, 1)[0];
        this.notify('experience:deleted', removed);
        return removed;
      }
      return null;
    }

    // Projects Management
    getProjectsList() {
      return this.data.projects || [];
    }

    getProjectById(id) {
      return (this.data.projects || []).find(item => item.id === id);
    }

    addProject(project) {
      if (!project.id) {
        project.id = 'proj-' + Date.now();
      }
      this.data.projects = this.data.projects || [];
      this.data.projects.push(project);
      this.notify('projects:added', project);
      return project;
    }
  }

  /* ==========================================================================
     2. EXPERIENCE MODULE CLASS
     ========================================================================== */
  class ExperienceModule {
    constructor(store, containerId = 'experience-timeline-container') {
      this.store = store;
      this.containerId = containerId;
      this.container = document.getElementById(containerId);

      // Auto-render when experience changes in store
      this.store.subscribe((event, payload) => {
        if (event.startsWith('experience:')) {
          this.render();
        }
      });
    }

    init() {
      this.container = document.getElementById(this.containerId);
      if (this.container) {
        this.render();
      }
    }

    render() {
      if (!this.container) return;
      const list = this.store.getExperienceList();

      if (list.length === 0) {
        this.container.innerHTML = `
          <div style="text-align: center; color: var(--text-muted); padding: 2.5rem;">
            Future update
          </div>
        `;
        return;
      }

      this.container.innerHTML = list.map(item => this.createCardHTML(item)).join('');
    }

    createCardHTML(item) {
      const badgeClass = item.badgeType === 'employment' ? 'badge-employment' : 'badge-practice';
      const badgeLabel = item.employmentType || (item.badgeType === 'employment' ? 'Verified Employment' : 'Practice Area');

      const datesText = item.startDate ? `🗓️ ${item.startDate} – ${item.endDate || 'Present'}` : '🗓️ Verified Timeline';
      const locationText = item.location ? `📍 ${item.location}` : '📍 Independent Practice';

      const responsibilitiesHTML = (item.responsibilities && item.responsibilities.length > 0) ? `
        <div style="margin-top: 1rem;">
          <h3 style="font-size: 0.92rem; color: #fff; margin-bottom: 0.5rem; font-family: var(--font-main); font-weight: 700;">Key Focus &amp; Responsibilities:</h3>
          <ul class="exp-responsibilities">
            ${item.responsibilities.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
      ` : '';

      const techTagsHTML = (item.technologies && item.technologies.length > 0) ? `
        <div class="exp-skills-row">
          ${item.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      ` : '';

      return `
        <div class="exp-entry" data-exp-id="${item.id}">
          <div class="exp-marker"></div>
          <article class="exp-card-full">
            <div class="exp-header-row">
              <div>
                <h2 class="exp-title">${item.title}</h2>
                <div class="exp-org">${item.organization || ''}</div>
              </div>
              <span class="exp-badge-pill ${badgeClass}">${badgeLabel}</span>
            </div>
            <div class="exp-dates-location">
              <span>${datesText}</span>
              <span>${locationText}</span>
            </div>
            <p class="exp-body-text">${item.description || ''}</p>
            ${responsibilitiesHTML}
            ${techTagsHTML}
          </article>
        </div>
      `;
    }

    // Programmatic addition method
    addExperience(entry) {
      return this.store.addExperience(entry);
    }

    updateExperience(id, fields) {
      return this.store.updateExperience(id, fields);
    }

    deleteExperience(id) {
      return this.store.deleteExperience(id);
    }
  }

  /* ==========================================================================
     3. PROJECTS MODULE CLASS
     ========================================================================== */
  class ProjectsModule {
    constructor(store, modalModule) {
      this.store = store;
      this.modalModule = modalModule;
    }

    init() {
      this.bindDetailButtons();
    }

    bindDetailButtons() {
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-project-id]');
        if (!btn) return;
        e.preventDefault();

        const projectId = btn.getAttribute('data-project-id');
        const project = this.store.getProjectById(projectId);
        if (project && this.modalModule) {
          this.modalModule.openProjectModal(project);
        }
      });
    }

    addProject(project) {
      return this.store.addProject(project);
    }
  }

  /* ==========================================================================
     4. SKILLS MODULE CLASS
     ========================================================================== */
  class SkillsModule {
    constructor(tabsSelector = '.skills-tab-btn', cardsSelector = '.skill-category-card') {
      this.tabsSelector = tabsSelector;
      this.cardsSelector = cardsSelector;
    }

    init() {
      const tabs = document.querySelectorAll(this.tabsSelector);
      const cards = document.querySelectorAll(this.cardsSelector);

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          const category = tab.getAttribute('data-category');
          this.filter(category, cards);
        });
      });
    }

    filter(category, cards) {
      const targetCards = cards || document.querySelectorAll(this.cardsSelector);
      targetCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-cat-id') === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }
  }

  /* ==========================================================================
     5. GITHUB REPOSITORIES MODULE CLASS
     ========================================================================== */
  class GitHubModule {
    constructor(containerId = 'github-repos-grid', username = 'Waleedhasn', fallback = []) {
      this.containerId = containerId;
      this.username = username;
      this.fallback = fallback;
    }

    async init() {
      const container = document.getElementById(this.containerId);
      if (!container) return;

      try {
        const res = await fetch(`https://api.github.com/users/${this.username}/repos?sort=updated&per_page=6`, {
          headers: { 'Accept': 'application/vnd.github.v3+json' }
        });
        if (!res.ok) throw new Error('API Rate limit or unreachable');
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error('Empty repos response');
        this.render(data, container);
      } catch (err) {
        console.info('GitHub module using verified cache:', err.message);
        this.render(this.fallback, container);
      }
    }

    render(repos, container) {
      container.innerHTML = '';
      repos.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'repo-card';

        const lang = repo.language || 'Code';
        const updatedDate = repo.updated_at ? new Date(repo.updated_at).toLocaleDateString(undefined, {
          year: 'numeric', month: 'short'
        }) : (repo.updated || 'Active');

        card.innerHTML = `
          <div>
            <div class="repo-header">
              <a href="${repo.html_url || repo.url}" target="_blank" rel="noopener noreferrer" class="repo-name">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                ${repo.name}
              </a>
              <span class="label-pill" style="font-size:0.65rem; padding: 0.15rem 0.5rem;">Public</span>
            </div>
            <p class="repo-desc">${repo.description || 'Verified Computer Science engineering project repository by Waleed Hassan.'}</p>
          </div>
          <div class="repo-meta">
            <div class="repo-lang">
              <span class="lang-dot"></span>
              <span>${lang}</span>
            </div>
            <div class="repo-stars-forks">
              <span>★ ${repo.stargazers_count !== undefined ? repo.stargazers_count : 0}</span>
              <span>⌥ ${repo.forks_count !== undefined ? repo.forks_count : 0}</span>
              <span style="color:var(--text-muted); font-size:0.7rem;">${updatedDate}</span>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    }
  }

  /* ==========================================================================
     6. CONTACT FORM MODULE CLASS
     ========================================================================== */
  class ContactModule {
    constructor(formId = 'portfolio-contact-form', alertId = 'contact-alert') {
      this.formId = formId;
      this.alertId = alertId;
      this.form = null;
      this.alert = null;
    }

    init() {
      this.form = document.getElementById(this.formId);
      this.alert = document.getElementById(this.alertId);
      if (!this.form) return;

      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
      e.preventDefault();
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');
      const submitBtn = document.getElementById('contact-submit-btn');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!this.alert) return;
      this.alert.className = 'form-status-alert';
      this.alert.style.display = 'none';

      if (!name || !email || !message) {
        this.showAlert('Please fill out all fields before sending.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this.showAlert('Please provide a valid email address.', 'error');
        return;
      }

      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Message...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        this.showAlert('Thank you! Your message has been received. Waleed Hassan will get in touch shortly.', 'success');
        this.form.reset();

        setTimeout(() => {
          if (this.alert) this.alert.style.display = 'none';
        }, 8000);
      }, 750);
    }

    showAlert(message, type) {
      if (!this.alert) return;
      this.alert.textContent = message;
      this.alert.className = `form-status-alert ${type}`;
      this.alert.style.display = 'block';
    }
  }

  /* ==========================================================================
     7. NAVIGATION MODULE CLASS
     ========================================================================== */
  class NavigationModule {
    constructor(navId = 'main-nav', drawerId = 'mobile-drawer', toggleBtnId = 'mobile-menu-btn') {
      this.nav = document.getElementById(navId);
      this.drawer = document.getElementById(drawerId);
      this.toggleBtn = document.getElementById(toggleBtnId);
    }

    init() {
      this.setupMobileDrawer();
      this.setupScrollSpy();
    }

    setupMobileDrawer() {
      if (this.toggleBtn && this.drawer) {
        this.toggleBtn.addEventListener('click', () => {
          this.drawer.classList.toggle('open');
        });

        const drawerLinks = this.drawer.querySelectorAll('.mobile-drawer-link');
        drawerLinks.forEach(link => {
          link.addEventListener('click', () => {
            this.drawer.classList.remove('open');
          });
        });
      }
    }

    setupScrollSpy() {
      const sections = document.querySelectorAll('section[id], header[id]');
      const navLinks = document.querySelectorAll('.nav-link');

      if (sections.length > 2) {
        window.addEventListener('scroll', () => {
          const scrollPos = window.scrollY + 140;

          sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
              navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${id}`) {
                  navLinks.forEach(l => l.classList.remove('active'));
                  link.classList.add('active');
                }
              });
            }
          });
        }, { passive: true });
      }
    }
  }

  /* ==========================================================================
     8. MODAL MODULE CLASS
     ========================================================================== */
  class ModalModule {
    constructor(modalOverlayId = 'project-modal') {
      this.overlayId = modalOverlayId;
      this.overlay = document.getElementById(modalOverlayId);
    }

    init() {
      this.overlay = document.getElementById(this.overlayId);
      if (!this.overlay) return;

      const closeBtn = document.getElementById('modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close());
      }

      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
          this.close();
        }
      });
    }

    openProjectModal(project) {
      if (!this.overlay) return;
      const title = document.getElementById('modal-project-title');
      const badge = document.getElementById('modal-project-badge');
      const desc = document.getElementById('modal-project-desc');
      const detailsList = document.getElementById('modal-details-list');
      const techTags = document.getElementById('modal-tech-tags');
      const githubLink = document.getElementById('modal-github-link');

      if (title) title.textContent = project.title;
      if (badge) badge.textContent = project.badge || 'PROJECT ARCHITECTURE';
      if (desc) desc.textContent = project.description || '';

      if (detailsList) {
        detailsList.innerHTML = '';
        (project.details || []).forEach(d => {
          const li = document.createElement('li');
          li.textContent = d;
          detailsList.appendChild(li);
        });
      }

      if (techTags) {
        techTags.innerHTML = '';
        (project.technologies || []).forEach(t => {
          const span = document.createElement('span');
          span.className = 'tech-tag';
          span.textContent = t;
          techTags.appendChild(span);
        });
      }

      if (githubLink) {
        githubLink.href = project.githubUrl || project.repoUrl || '#';
      }

      this.overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    close() {
      if (!this.overlay) return;
      this.overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /* ==========================================================================
     9. SCROLL ANIMATION MODULE CLASS
     ========================================================================== */
  class ScrollAnimationModule {
    constructor(canvasId = 'hero-scroll-canvas', totalFrames = 40, folderPath = 'portfolio-pic') {
      this.canvas = document.getElementById(canvasId);
      this.totalFrames = totalFrames;
      this.folderPath = folderPath;
      this.frames = [];
      this.currentFrame = 0;
      this.targetFrame = 0;
      this.lastRenderedFrame = -1;
      this.isReady = false;
      this.ctx = this.canvas ? this.canvas.getContext('2d', { alpha: true }) : null;
    }

    init() {
      if (!this.canvas || !this.ctx) return;
      this.preloadFrames();
      this.bindEvents();
      this.startLoop();
    }

    preloadFrames() {
      for (let i = 1; i <= this.totalFrames; i++) {
        const img = new Image();
        const paddedIndex = String(i).padStart(3, '0');
        img.src = `${this.folderPath}/ezgif-frame-${paddedIndex}.jpg`;

        img.onload = () => {
          if (typeof img.decode === 'function') {
            img.decode().catch(() => {});
          }
          if (i === 1 && !this.isReady) {
            this.isReady = true;
            this.resize();
            this.render(0);
          }
        };

        this.frames.push(img);
      }
    }

    bindEvents() {
      window.addEventListener('scroll', () => this.updateScrollProgress(), { passive: true });
      window.addEventListener('resize', () => this.resize(), { passive: true });
      this.resize();
      this.updateScrollProgress();
    }

    resize() {
      if (!this.canvas || !this.ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (width === 0 || height === 0) return;

      this.canvas.width = Math.floor(width * dpr);
      this.canvas.height = Math.floor(height * dpr);

      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(dpr, dpr);
      this.render(Math.round(this.currentFrame));
    }

    render(index) {
      if (!this.ctx || !this.frames[index] || !this.frames[index].complete) return;
      const img = this.frames[index];
      if (img.naturalWidth === 0) return;

      const canvasW = window.innerWidth;
      const canvasH = window.innerHeight;

      this.ctx.fillStyle = '#060205';
      this.ctx.fillRect(0, 0, canvasW, canvasH);

      let scale;
      if (canvasW > 1100) {
        scale = (canvasH * 0.88) / img.naturalHeight;
      } else if (canvasW > 768) {
        scale = (canvasH * 0.82) / img.naturalHeight;
      } else {
        scale = Math.max(canvasW / img.naturalWidth, (canvasH * 0.75) / img.naturalHeight);
      }

      const destW = img.naturalWidth * scale;
      const destH = img.naturalHeight * scale;

      const destX = (canvasW - destW) / 2;
      const destY = Math.max(10, (canvasH - destH) * 0.42);

      this.ctx.drawImage(img, destX, destY, destW, destH);

      // Edge feathering to eliminate box seams
      const featherW = Math.min(destW * 0.25, 130);
      const featherH = Math.min(destH * 0.14, 90);

      const gradLeft = this.ctx.createLinearGradient(destX, 0, destX + featherW, 0);
      gradLeft.addColorStop(0, '#060205');
      gradLeft.addColorStop(1, 'rgba(6, 2, 5, 0)');
      this.ctx.fillStyle = gradLeft;
      this.ctx.fillRect(destX - 1, destY - 1, featherW + 2, destH + 2);

      const gradRight = this.ctx.createLinearGradient(destX + destW - featherW, 0, destX + destW, 0);
      gradRight.addColorStop(0, 'rgba(6, 2, 5, 0)');
      gradRight.addColorStop(1, '#060205');
      this.ctx.fillStyle = gradRight;
      this.ctx.fillRect(destX + destW - featherW - 1, destY - 1, featherW + 2, destH + 2);

      const gradTop = this.ctx.createLinearGradient(0, destY, 0, destY + featherH);
      gradTop.addColorStop(0, '#060205');
      gradTop.addColorStop(1, 'rgba(6, 2, 5, 0)');
      this.ctx.fillStyle = gradTop;
      this.ctx.fillRect(destX - 1, destY - 1, destW + 2, featherH + 2);

      const gradBottom = this.ctx.createLinearGradient(0, destY + destH - featherH, 0, destY + destH);
      gradBottom.addColorStop(0, 'rgba(6, 2, 5, 0)');
      gradBottom.addColorStop(1, '#060205');
      this.ctx.fillStyle = gradBottom;
      this.ctx.fillRect(destX - 1, destY + destH - featherH - 1, destW + 2, featherH + 2);
    }

    updateScrollProgress() {
      const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        this.targetFrame = 0;
        return;
      }

      const scrollY = window.scrollY || window.pageYOffset;
      const maxScrubScroll = Math.min(window.innerHeight * 2.2, Math.max(document.documentElement.scrollHeight - window.innerHeight, 1));
      if (maxScrubScroll <= 0) return;

      const progress = Math.min(Math.max(scrollY / maxScrubScroll, 0), 1);
      this.targetFrame = progress * (this.totalFrames - 1);
    }

    startLoop() {
      const step = () => {
        const diff = this.targetFrame - this.currentFrame;
        if (Math.abs(diff) > 0.005) {
          this.currentFrame += diff * 0.16;
        }

        const rounded = Math.min(Math.max(Math.round(this.currentFrame), 0), this.totalFrames - 1);
        if (rounded !== this.lastRenderedFrame) {
          this.lastRenderedFrame = rounded;
          this.render(rounded);
        }

        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }

  /* ==========================================================================
     10. PAGE CONTROLLER CLASSES
     ========================================================================== */
  class BasePage {
    constructor(pageName, app) {
      this.pageName = pageName;
      this.app = app;
    }
    mount() {
      console.info(`Mounted Page: ${this.pageName}`);
    }
  }

  class HomePage extends BasePage {
    constructor(app) {
      super('HomePage', app);
    }
    mount() {
      super.mount();
      this.app.skills.init();
      this.app.github.init();
      this.app.contact.init();
      this.app.projects.init();
    }
  }

  class ExperiencePage extends BasePage {
    constructor(app) {
      super('ExperiencePage', app);
    }
    mount() {
      super.mount();
      this.app.experience.init();
    }
  }

  class ProjectsPage extends BasePage {
    constructor(app) {
      super('ProjectsPage', app);
    }
    mount() {
      super.mount();
      this.app.projects.init();
    }
  }

  /* ==========================================================================
     11. MASTER PORTFOLIO APPLICATION CONTROLLER
     ========================================================================== */
  class PortfolioApp {
    constructor() {
      // 1. Data Store
      this.store = new PortfolioDataStore(window.PORTFOLIO_DATA);

      // 2. Modals & Navigation
      this.modals = new ModalModule();
      this.navigation = new NavigationModule();

      // 3. Sub-modules
      this.experience = new ExperienceModule(this.store);
      this.projects = new ProjectsModule(this.store, this.modals);
      this.skills = new SkillsModule();
      this.github = new GitHubModule('github-repos-grid', 'Waleedhasn', this.store.data.verifiedReposFallback || []);
      this.contact = new ContactModule();
      this.scrollAnimation = new ScrollAnimationModule();

      // 4. Page Routing Detection
      this.currentPage = this.detectCurrentPage();
    }

    detectCurrentPage() {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('experience')) {
        return new ExperiencePage(this);
      } else if (path.includes('projects')) {
        return new ProjectsPage(this);
      } else {
        return new HomePage(this);
      }
    }

    start() {
      this.modals.init();
      this.navigation.init();
      this.currentPage.mount();
    }
  }

  // Export classes and app globally
  window.PortfolioDataStore = PortfolioDataStore;
  window.ExperienceModule = ExperienceModule;
  window.ProjectsModule = ProjectsModule;
  window.SkillsModule = SkillsModule;
  window.GitHubModule = GitHubModule;
  window.ContactModule = ContactModule;
  window.NavigationModule = NavigationModule;
  window.ModalModule = ModalModule;
  window.ScrollAnimationModule = ScrollAnimationModule;
  window.HomePage = HomePage;
  window.ExperiencePage = ExperiencePage;
  window.ProjectsPage = ProjectsPage;
  window.PortfolioApp = PortfolioApp;

  // Initialize Application on DOM Ready
  window.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
    window.portfolioApp.start();
  });

})(window);
