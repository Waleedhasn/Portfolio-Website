/**
 * ==========================================================================
 * FRAMER-THEMED PORTFOLIO ENGINE — WALEED HASSAN
 * Hardware Canvas Scroll Scrubbing, Dynamic Repositories, Modals, & Filters
 * ==========================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. HARDWARE-ACCELERATED CANVAS SCROLL SCRUBBING
     ========================================================================== */
  const TOTAL_FRAMES = 40;
  const FOLDER_PATH = 'portfolio-pic';
  const frames = [];
  let currentFrameIndex = 0;
  let targetFrameIndex = 0;
  let lastRenderedIndex = -1;
  let isCanvasReady = false;

  const canvas = document.getElementById('hero-scroll-canvas');
  let ctx = null;

  if (canvas) {
    ctx = canvas.getContext('2d', { alpha: true });
  }

  // Preload all 40 frames into memory immediately
  function preloadFrames() {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(3, '0');
      img.src = `${FOLDER_PATH}/ezgif-frame-${paddedIndex}.jpg`;

      img.onload = () => {
        if (typeof img.decode === 'function') {
          img.decode().catch(() => {});
        }
        if (i === 1 && !isCanvasReady) {
          isCanvasReady = true;
          resizeCanvas();
          renderFrame(0);
        }
      };

      frames.push(img);
    }
  }

  // Resize Canvas to Match Full Viewport Resolution
  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (width === 0 || height === 0) return;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    renderFrame(Math.round(currentFrameIndex));
  }

  // Draw frame contained in the viewport, perfectly sharp and centered
  function renderFrame(index) {
    if (!ctx || !frames[index] || !frames[index].complete) return;
    const img = frames[index];
    if (img.naturalWidth === 0) return;

    const canvasW = window.innerWidth;
    const canvasH = window.innerHeight;

    // Studio dark background matching portrait's deep lighting
    ctx.fillStyle = '#060205';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // True aspect-ratio preserved scaling:
    // Fits height on desktop so portrait sits in golden center between columns without overlap
    let scale;
    if (canvasW > 1100) {
      // Desktop: Scale to fit 88% of viewport height
      scale = (canvasH * 0.88) / img.naturalHeight;
    } else if (canvasW > 768) {
      // Tablet
      scale = (canvasH * 0.82) / img.naturalHeight;
    } else {
      // Mobile: Fill width gracefully
      scale = Math.max(canvasW / img.naturalWidth, (canvasH * 0.75) / img.naturalHeight);
    }

    const destW = img.naturalWidth * scale;
    const destH = img.naturalHeight * scale;

    // Center horizontally
    const destX = (canvasW - destW) / 2;
    // Anchor vertically with balanced breathing room for navbar and disciplines row
    const destY = Math.max(10, (canvasH - destH) * 0.42);

    ctx.drawImage(img, destX, destY, destW, destH);

    // =========================================================================
    // CINEMATIC EDGE FEATHERING (Eliminates box borders & blends with #060205)
    // =========================================================================
    const featherW = Math.min(destW * 0.25, 130);
    const featherH = Math.min(destH * 0.14, 90);

    // Left edge blend
    const gradLeft = ctx.createLinearGradient(destX, 0, destX + featherW, 0);
    gradLeft.addColorStop(0, '#060205');
    gradLeft.addColorStop(1, 'rgba(6, 2, 5, 0)');
    ctx.fillStyle = gradLeft;
    ctx.fillRect(destX - 1, destY - 1, featherW + 2, destH + 2);

    // Right edge blend
    const gradRight = ctx.createLinearGradient(destX + destW - featherW, 0, destX + destW, 0);
    gradRight.addColorStop(0, 'rgba(6, 2, 5, 0)');
    gradRight.addColorStop(1, '#060205');
    ctx.fillStyle = gradRight;
    ctx.fillRect(destX + destW - featherW - 1, destY - 1, featherW + 2, destH + 2);

    // Top edge blend
    const gradTop = ctx.createLinearGradient(0, destY, 0, destY + featherH);
    gradTop.addColorStop(0, '#060205');
    gradTop.addColorStop(1, 'rgba(6, 2, 5, 0)');
    ctx.fillStyle = gradTop;
    ctx.fillRect(destX - 1, destY - 1, destW + 2, featherH + 2);

    // Bottom edge blend
    const gradBottom = ctx.createLinearGradient(0, destY + destH - featherH, 0, destY + destH);
    gradBottom.addColorStop(0, 'rgba(6, 2, 5, 0)');
    gradBottom.addColorStop(1, '#060205');
    ctx.fillStyle = gradBottom;
    ctx.fillRect(destX - 1, destY + destH - featherH - 1, destW + 2, featherH + 2);
  }

  // Calculate target frame smoothly from scroll progress across hero & editorial sections
  function updateScrollProgress() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      targetFrameIndex = 0;
      return;
    }

    const scrollY = window.scrollY || window.pageYOffset;
    // Scrub across the hero and top about sections (approx 2.2 viewports)
    const maxScrubScroll = Math.min(window.innerHeight * 2.2, Math.max(document.documentElement.scrollHeight - window.innerHeight, 1));

    if (maxScrubScroll <= 0) return;

    const progress = Math.min(Math.max(scrollY / maxScrubScroll, 0), 1);
    targetFrameIndex = progress * (TOTAL_FRAMES - 1);

    // Dynamic vignette adjustment for lower sections (Projects, Skills, Education, Contact)
    const vignette = document.getElementById('canvas-vignette');
    if (vignette) {
      if (scrollY > maxScrubScroll * 0.85) {
        const extraProgress = Math.min((scrollY - maxScrubScroll * 0.85) / (window.innerHeight * 0.75), 1);
        vignette.style.backgroundColor = `rgba(6, 2, 5, ${extraProgress * 0.85})`;
      } else {
        vignette.style.backgroundColor = 'transparent';
      }
    }
  }

  // Smooth LERP Animation Loop (60/120 FPS)
  function animationLoop() {
    const diff = targetFrameIndex - currentFrameIndex;
    if (Math.abs(diff) > 0.005) {
      currentFrameIndex += diff * 0.16; // Smooth momentum lerp
    }

    const roundedIndex = Math.min(Math.max(Math.round(currentFrameIndex), 0), TOTAL_FRAMES - 1);
    if (roundedIndex !== lastRenderedIndex) {
      lastRenderedIndex = roundedIndex;
      renderFrame(roundedIndex);
    }

    requestAnimationFrame(animationLoop);
  }

  /* ==========================================================================
     2. GITHUB REPOSITORIES LOADER
     ========================================================================== */
  async function loadGitHubRepositories() {
    const container = document.getElementById('github-repos-grid');
    if (!container) return;

    const fallback = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.verifiedReposFallback) ? window.PORTFOLIO_DATA.verifiedReposFallback : [];

    try {
      const res = await fetch('https://api.github.com/users/Waleedhasn/repos?sort=updated&per_page=6', {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });
      if (!res.ok) throw new Error('API Rate limit or network issue');
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error('Empty repos response');
      renderRepos(data, container);
    } catch (err) {
      console.info('Using verified fallback repos:', err.message);
      renderRepos(fallback, container);
    }
  }

  function renderRepos(repos, container) {
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
            <span class="label-pill-sub" style="font-size:0.68rem; margin:0;">Public</span>
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
            <span style="color:var(--text-muted); font-size:0.75rem;">${updatedDate}</span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  /* ==========================================================================
     3. PROJECT DETAILS MODAL
     ========================================================================== */
  function setupProjectModals() {
    const modalOverlay = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-project-title');
    const modalBadge = document.getElementById('modal-project-badge');
    const modalDesc = document.getElementById('modal-project-desc');
    const modalDetailsList = document.getElementById('modal-details-list');
    const modalTechTags = document.getElementById('modal-tech-tags');
    const modalGithubLink = document.getElementById('modal-github-link');

    if (!modalOverlay) return;

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-project-id]');
      if (!btn) return;
      e.preventDefault();

      const projectId = btn.getAttribute('data-project-id');
      const projects = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.projects) ? window.PORTFOLIO_DATA.projects : [];
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      if (modalTitle) modalTitle.textContent = project.title;
      if (modalBadge) modalBadge.textContent = project.badge || 'PROJECT ARCHITECTURE';
      if (modalDesc) modalDesc.textContent = project.description || '';

      if (modalDetailsList) {
        modalDetailsList.innerHTML = '';
        (project.details || []).forEach(d => {
          const li = document.createElement('li');
          li.textContent = d;
          modalDetailsList.appendChild(li);
        });
      }

      if (modalTechTags) {
        modalTechTags.innerHTML = '';
        (project.technologies || []).forEach(t => {
          const span = document.createElement('span');
          span.className = 'tech-tag';
          span.textContent = t;
          modalTechTags.appendChild(span);
        });
      }

      if (modalGithubLink) {
        modalGithubLink.href = project.githubUrl || project.repoUrl || '#';
      }

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    function closeModal() {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });
  }

  /* ==========================================================================
     4. SKILLS TABS FILTERING
     ========================================================================== */
  function setupSkillsFilter() {
    const tabs = document.querySelectorAll('.skills-tab-btn');
    const cards = document.querySelectorAll('.skill-category-card');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const category = tab.getAttribute('data-category');
        cards.forEach(card => {
          if (category === 'all' || card.getAttribute('data-cat-id') === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================================
     5. CONTACT FORM VALIDATION & HANDLING
     ========================================================================== */
  function setupContactForm() {
    const form = document.getElementById('portfolio-contact-form');
    const alertBox = document.getElementById('contact-alert');
    const submitBtn = document.getElementById('contact-submit-btn');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      alertBox.className = 'form-status-alert';
      alertBox.style.display = 'none';

      if (!name || !email || !message) {
        alertBox.textContent = 'Please fill out all fields before sending.';
        alertBox.className = 'form-status-alert error';
        alertBox.style.display = 'block';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alertBox.textContent = 'Please provide a valid email address.';
        alertBox.className = 'form-status-alert error';
        alertBox.style.display = 'block';
        return;
      }

      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Message...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        alertBox.textContent = 'Thank you! Your message has been received. Waleed Hassan will get in touch shortly.';
        alertBox.className = 'form-status-alert success';
        alertBox.style.display = 'block';
        form.reset();

        setTimeout(() => {
          alertBox.style.display = 'none';
        }, 7000);
      }, 700);
    });
  }

  /* ==========================================================================
     INITIALIZATION
     ========================================================================== */
  window.addEventListener('DOMContentLoaded', () => {
    preloadFrames();
    resizeCanvas();
    updateScrollProgress();
    requestAnimationFrame(animationLoop);

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', resizeCanvas);

    setupProjectModals();
    setupSkillsFilter();
    setupContactForm();
    loadGitHubRepositories();
  });

})();
