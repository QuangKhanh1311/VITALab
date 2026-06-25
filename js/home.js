/* ============================================
   Home Page — JavaScript
   Particle animation, data loading, stats
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     1. Particle Canvas Animation
     ------------------------------------------ */
  function initParticleCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let width, height;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      particles = [];
      const count = Math.min(60, Math.floor((width * height) / 15000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.8 + 0.8,
          opacity: Math.random() * 0.4 + 0.15
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      // Update & draw particles
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;

        // Boundary bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(11, 100, 90, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.18;
            ctx.strokeStyle = `rgba(11, 100, 90, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(drawParticles);
    }

    // Handle resize with debounce
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
        createParticles();
      }, 200);
    });

    // Pause animation when hero is not visible
    const heroSection = canvas.closest('.hero');
    if (heroSection && 'IntersectionObserver' in window) {
      const visibilityObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          if (!animationId) drawParticles();
        } else {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }, { threshold: 0 });
      visibilityObserver.observe(heroSection);
    }

    resize();
    createParticles();
    drawParticles();
  }

  /* ------------------------------------------
     2. Render Hero Content
     ------------------------------------------ */
  function renderHeroContent() {
    const titleEl = document.getElementById('heroTitle');
    const descEl = document.getElementById('heroDescription');

    if (titleEl) {
      const words = (LAB_CONFIG.name || 'VITA LAB').split(' ');
      if (words.length > 1) {
        titleEl.innerHTML = `<span class="hero-vita">${words[0]}</span> <span class="hero-lab">${words.slice(1).join(' ')}</span>`;
      } else {
        titleEl.textContent = words[0];
      }
    }

    if (descEl) {
      descEl.textContent = LAB_CONFIG.description || '';
    }
  }

  /* ------------------------------------------
     3. Load Team Preview
     ------------------------------------------ */
  async function loadTeamPreview() {
    const grid = document.getElementById('teamPreviewGrid');
    if (!grid) return;

    if (!isSheetsConfigured()) {
      showConfigNotice(grid);
      return;
    }

    showLoadingSkeletons(grid, 6, 'member');

    try {
      const members = await fetchMembers();
      // Show up to 8 members
      const previewMembers = members.slice(0, 8);

      if (previewMembers.length === 0) {
        showEmptyState(grid, '👥', 'No Members Found', 'Add member details in your Google Sheet.');
        return;
      }

      grid.innerHTML = previewMembers.map(function (member) {
        let photoHTML = '';
        const photoUrl = cleanGoogleDriveUrl((member.photo || member.photo_url || '').trim());
        const initial = (member.name || '?').charAt(0).toUpperCase();
        const titleStr = `${member.name} (${member.role || ''})`;
        if (photoUrl) {
          photoHTML = `<img class="team-preview-avatar" src="${photoUrl}" alt="${member.name}" title="${titleStr}" loading="lazy" onerror="this.onerror=null; this.outerHTML='<div class=&quot;team-preview-avatar&quot; title=&quot;${titleStr}&quot; style=&quot;display:flex;align-items:center;justify-content:center;background:var(--primary-glass-strong);color:var(--primary);font-weight:700;font-size:1.1rem;cursor:pointer;&quot;>${initial}</div>';">`;
        } else {
          photoHTML = `
            <div class="team-preview-avatar" title="${titleStr}" style="display:flex;align-items:center;justify-content:center;background:var(--primary-glass-strong);color:var(--primary);font-weight:700;font-size:1.1rem;cursor:pointer;">
              ${initial}
            </div>
          `;
        }
        return photoHTML;
      }).join('');
    } catch (err) {
      console.error('Failed to load team preview:', err);
      showEmptyState(grid, '⚠️', 'Error Loading Team', 'Check Google Sheets configurations.');
    }
  }

  /* ------------------------------------------
     4. Stats Animation Setup
     ------------------------------------------ */
  function initStatsAnimation(membersCount, pubsCount) {
    const statsSection = document.getElementById('heroStats');
    if (!statsSection) return;

    updateStatTarget('statMembers', membersCount);
    updateStatTarget('statPublications', pubsCount);

    const items = [
      { id: 'statMembers', value: membersCount },
      { id: 'statPublications', value: pubsCount }
    ];

    const observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        items.forEach(function (item) {
          const el = document.getElementById(item.id);
          if (el) {
            animateCountUp(el, item.value, 2000);
          }
        });
        observer.unobserve(statsSection);
      }
    }, {
      threshold: 0.3
    });

    observer.observe(statsSection);
  }

  function updateStatTarget(id, val) {
    const el = document.getElementById(id);
    if (el) el.setAttribute('data-target', val);
  }

  /* ------------------------------------------
     5. Load data and populate stats
     ------------------------------------------ */
  async function loadDataForStats() {
    const defaultMembers = 15;
    const defaultPubs = 50;

    if (!isSheetsConfigured()) {
      initStatsAnimation(defaultMembers, defaultPubs);
      return;
    }

    try {
      const [members, pubs] = await Promise.all([
        fetchMembers(),
        fetchPublications()
      ]);

      initStatsAnimation(members.length, pubs.length);
    } catch (err) {
      console.error('Failed to load stats data:', err);
      initStatsAnimation(defaultMembers, defaultPubs);
    }
  }

  /* ------------------------------------------
     6. Initialize Everything
     ------------------------------------------ */
  initParticleCanvas();
  renderHeroContent();
  loadTeamPreview();
  loadDataForStats();

  // Layout & navigation
  renderLayout('index.html');
})();
