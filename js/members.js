/* ============================================
   Members Page — JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ---- Bio Thought Bubble ---- */
  function buildBioBubble(bio) {
    if (!bio || !bio.trim()) return '';
    return `<div class="bio-thought-bubble">
      <div class="thought-cloud">
        <span class="cloud-bump cb1"></span>
        <span class="cloud-bump cb2"></span>
        <span class="cloud-bump cb3"></span>
        <span class="cloud-bump cb4"></span>
        <span class="cloud-bump cb5"></span>
        <span class="cloud-bump cb6"></span>
        <div class="bubble-text">${escapeHTML(bio)}</div>
      </div>
      <div class="thought-dots">
        <span></span><span></span><span></span>
      </div>
    </div>`;
  }




  const ROLE_PRIORITY = {
    'principal investigator': 1,
    'postdoc': 2,
    'phd student': 3,
    'phd': 3,
    'phd candidate': 3,
    'master student': 4,
    'master': 4,
    'undergraduate': 5,
    'alumni': 6
  };

  let allMembers = [];
  let currentFilter = 'all';

  function getRolePriority(role) {
    if (!role) return 99;
    const lower = role.toLowerCase().trim();
    for (const [key, priority] of Object.entries(ROLE_PRIORITY)) {
      if (lower.includes(key)) return priority;
    }
    return 50;
  }

  function sortMembers(members) {
    return members.slice().sort((a, b) => {
      const orderA = parseInt(a.order, 10);
      const orderB = parseInt(b.order, 10);
      const hasA = !isNaN(orderA);
      const hasB = !isNaN(orderB);

      if (hasA && hasB) return orderA - orderB;
      if (hasA) return -1;
      if (hasB) return 1;

      const roleDiff = getRolePriority(a.role) - getRolePriority(b.role);
      if (roleDiff !== 0) return roleDiff;

      return (a.name || '').localeCompare(b.name || '');
    });
  }

  function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function buildMemberCard(member) {
    const name = escapeHTML(member.name || 'Unknown');
    const role = escapeHTML(member.role || '');
    const title = escapeHTML(member.title || '');
    const bio = escapeHTML(member.bio || '');
    const rawBio = member.bio || '';
    const photoUrl = cleanGoogleDriveUrl((member.photo || member.photo_url || '').trim());

    // Build speech bubble from bio (shown above avatar)
    const bubbleHTML = buildBioBubble(rawBio);

    let photoHTML;
    if (photoUrl) {
      photoHTML = `<img class="member-photo" src="${escapeHTML(photoUrl)}" alt="${name}" loading="lazy" onerror="this.onerror=null; this.outerHTML='<div class=&quot;member-photo-placeholder&quot;>${name.charAt(0)}</div>';">`;
    } else {
      photoHTML = `<div class="member-photo-placeholder">${name.charAt(0)}</div>`;
    }

    const interests = (member.interests || member.research_interests || '')
      .split(/[;,]/)
      .map(s => s.trim())
      .filter(Boolean);

    let interestsHTML = '';
    if (interests.length) {
      interestsHTML = `
        <div class="member-interests">
          ${interests.map(t => `<span class="interest-tag">${escapeHTML(t)}</span>`).join('')}
        </div>`;
    }

    const email = (member.email || '').trim();
    const scholar = (member.scholar || member.google_scholar || '').trim();
    const website = (member.website || '').trim();

    let links = [];

    if (email) links.push(`<a href="mailto:${escapeHTML(email)}" title="Email">📧</a>`);
    if (scholar) links.push(`<a href="${escapeHTML(scholar)}" target="_blank" title="Google Scholar">🎓</a>`);
    if (website) links.push(`<a href="${escapeHTML(website)}" target="_blank" title="Website/GitHub">🌐</a>`);

    return `
      <div class="member-card glass-card reveal" data-name="${name}" style="cursor: pointer;">
        <div class="member-avatar-area">
          ${bubbleHTML}
          ${photoHTML}
        </div>
        <h3>${name}</h3>
        <div class="member-role">${role}</div>
        ${title ? `<div class="member-title">${title}</div>` : ''}
        ${interestsHTML}
        ${links.length ? `<div class="member-links">${links.join(' ')}</div>` : ''}
      </div>
    `;
  }

  function renderMembers(members, container) {
    const categories = {
      'Staff': [],
      'PhD Student': [],
      'Masters Student': [],
      'Undergraduate Student': [],
      'Alumni': []
    };

    // Map section values to category keys
    const SECTION_MAP = {
      'staff': 'Staff',
      'principal investigator': 'Staff',
      'pi': 'Staff',
      'postdoc': 'Staff',
      'phd student': 'PhD Student',
      'phd': 'PhD Student',
      'master student': 'Masters Student',
      'master': 'Masters Student',
      'masters': 'Masters Student',
      'undergraduate': 'Undergraduate Student',
      'undergrad': 'Undergraduate Student',
      'alumni': 'Alumni'
    };

    members.forEach(member => {
      const section = (member.section || '').toLowerCase().trim();
      const matched = SECTION_MAP[section];
      if (matched) {
        categories[matched].push(member);
      } else {
        // Fallback: try partial matching
        let placed = false;
        for (const [key, cat] of Object.entries(SECTION_MAP)) {
          if (section.includes(key)) {
            categories[cat].push(member);
            placed = true;
            break;
          }
        }
        if (!placed) {
          categories['Undergraduate Student'].push(member);
        }
      }
    });

    let html = '';
    for (const [catName, catMembers] of Object.entries(categories)) {
      if (catMembers.length > 0) {
        html += `
          <div class="member-category-section" style="margin-bottom: var(--space-3xl);">
            <h2 class="category-title" style="margin-top: 0; margin-bottom: var(--space-xl); border-bottom: 2px solid var(--border-subtle); padding-bottom: var(--space-xs); color: var(--primary); font-size: 1.8rem; font-weight: 600; text-align: left;">${catName}</h2>
            <div class="members-grid">
              ${catMembers.map(buildMemberCard).join('')}
            </div>
          </div>
        `;
      }
    }

    container.innerHTML = html || `<div class="empty-state"><h3>No members found</h3></div>`;
    initScrollReveal();
  }

  function filterMembers() {
    const container = document.getElementById("membersContainer");
    if (!container) return;

    if (currentFilter === 'all') {
      renderMembers(allMembers, container);
    } else {
      const filtered = allMembers.filter(member => {
        const section = (member.section || '').toLowerCase();
        return section.includes(currentFilter);
      });
      if (filtered.length === 0) {
        showEmptyState(container, '👥', 'No Members Found', `No members found matching "${currentFilter}".`);
      } else {
        renderMembers(filtered, container);
      }
    }
  }

  function bindFilterEvents() {
    const tabsContainer = document.getElementById('filterTabs');
    if (!tabsContainer) return;

    tabsContainer.addEventListener('click', (e) => {
      const tab = e.target.closest('.filter-tab');
      if (!tab) return;

      // Update active tab styling
      tabsContainer.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter members
      currentFilter = tab.getAttribute('data-filter').toLowerCase();
      filterMembers();
    });
  }

  async function loadAndRender(container, forceRefresh = false) {
    try {
      const members = await fetchMembers(forceRefresh);

      if (!members.length) {
        showEmptyState(container, '👥', 'No Members Found', 'Add member details in your Google Sheet.');
        return;
      }

      allMembers = sortMembers(members);
      filterMembers();
    } catch (err) {
      console.error('Failed to load members:', err);
      showEmptyState(container, '⚠️', 'Error Loading Team', 'Check Google Sheets configurations.');
    }
  }

  function openMemberModal(member) {
    let modal = document.getElementById('memberDetailModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'memberDetailModal';
      modal.className = 'member-modal';
      modal.innerHTML = `
        <div class="member-modal-overlay"></div>
        <div class="member-modal-wrapper">
          <button class="member-modal-close" aria-label="Close modal">&times;</button>
          <div class="member-modal-body" id="memberModalBody"></div>
        </div>
      `;
      document.body.appendChild(modal);

      // Close events
      modal.querySelector('.member-modal-close').addEventListener('click', closeModal);
      modal.querySelector('.member-modal-overlay').addEventListener('click', closeModal);
      
      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
          closeModal();
        }
      });
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    const name = escapeHTML(member.name || 'Unknown');
    const role = escapeHTML(member.role || '');
    const title = escapeHTML(member.title || '');
    const bio = escapeHTML(member.bio || 'No biography details provided.');
    const photoUrl = cleanGoogleDriveUrl((member.photo || member.photo_url || '').trim());

    let photoHTML;
    if (photoUrl) {
      photoHTML = `<img class="member-modal-photo" src="${escapeHTML(photoUrl)}" alt="${name}" onerror="this.onerror=null; this.outerHTML='<div class=&quot;member-modal-photo-placeholder&quot;>${name.charAt(0)}</div>';">`;
    } else {
      photoHTML = `<div class="member-modal-photo-placeholder">${name.charAt(0)}</div>`;
    }

    const interests = (member.interests || member.research_interests || '')
      .split(/[;,]/)
      .map(s => s.trim())
      .filter(Boolean);

    let interestsHTML = '';
    if (interests.length) {
      interestsHTML = `
        <div class="member-modal-section-title">Research Interests</div>
        <div class="member-interests" style="margin-bottom: var(--space-xl);">
          ${interests.map(t => `<span class="interest-tag">${escapeHTML(t)}</span>`).join('')}
        </div>`;
    }

    const email = (member.email || '').trim();
    const scholar = (member.scholar || member.google_scholar || '').trim();
    const website = (member.website || '').trim();

    let linksHTML = '';
    if (email || scholar || website) {
      let linkItems = [];
      if (email) linkItems.push(`<a href="mailto:${escapeHTML(email)}" class="member-modal-link-item"><span>📧</span> Email</a>`);
      if (scholar) linkItems.push(`<a href="${escapeHTML(scholar)}" target="_blank" class="member-modal-link-item"><span>🎓</span> Google Scholar</a>`);
      if (website) linkItems.push(`<a href="${escapeHTML(website)}" target="_blank" class="member-modal-link-item"><span>🌐</span> Website / GitHub</a>`);
      
      linksHTML = `
        <div class="member-modal-section-title">Links & Contact</div>
        <div class="member-modal-links-grid">
          ${linkItems.join('')}
        </div>
      `;
    }

    document.getElementById('memberModalBody').innerHTML = `
      <div class="member-modal-header">
        ${photoHTML}
        <div class="member-modal-info">
          <h2>${name}</h2>
          <div class="member-modal-role">${role}</div>
          ${title ? `<div class="member-modal-title">${title}</div>` : ''}
        </div>
      </div>
      <div class="member-modal-bio">
        <div class="member-modal-section-title">Biography</div>
        <p>${bio}</p>
      </div>
      ${interestsHTML}
      ${linksHTML}
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function initModalEvents() {
    const container = document.getElementById('membersContainer');
    if (!container) return;

    container.addEventListener('click', (e) => {
      const card = e.target.closest('.member-card');
      if (!card) return;

      // Avoid opening modal if clicking directly on links inside the card
      if (e.target.closest('.member-links a') || e.target.closest('.interest-tag')) {
        return;
      }

      const name = card.getAttribute('data-name');
      const member = allMembers.find(m => escapeHTML(m.name || 'Unknown') === name);
      if (member) {
        openMemberModal(member);
      }
    });
  }

  async function init() {
    // Render layout first
    renderLayout('members.html');

    const container = document.getElementById("membersContainer");
    if (!container) return;

    if (!isSheetsConfigured()) {
      showConfigNotice(container);
      return;
    }

    showLoadingSkeletons(container, 6, 'member');

    bindFilterEvents();
    initModalEvents();
    await loadAndRender(container);

    // Auto update setup
    setInterval(() => {
      loadAndRender(container, true);
    }, 30000);
  }

  init();

})();