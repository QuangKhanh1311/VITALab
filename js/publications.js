(function () {
  'use strict';

  const listContainer = document.getElementById('publicationsList');
  const resultsCount = document.getElementById('resultsCount');
  const searchInput = document.getElementById('searchInput');
  const yearFilter = document.getElementById('yearFilter');
  const typeFilter = document.getElementById('typeFilter');

  let allPublications = [];
  let debounceTimer = null;

  init();

  async function init() {
    renderLayout('publications.html');

    if (!isSheetsConfigured()) {
      showConfigNotice(listContainer);
      return;
    }

    showLoadingSkeletons(listContainer, 5, 'publication');

    await loadData();
    bindEvents();
    initModalEvents();

    // Auto refresh data every 30s
    setInterval(async () => {
      await loadData(true);
      applyFilters();
    }, 30000);
  }

  async function loadData(forceRefresh = false) {
    try {
      const data = await fetchPublications(forceRefresh);

      if (!data || data.length === 0) {
        showEmptyState(
          listContainer,
          '📄',
          'No Publications Yet',
          'Publications will appear here once data is added.'
        );
        return;
      }

      allPublications = data;

      populateYearFilter(allPublications);
      applyFilters();

    } catch (error) {
      console.error('Failed to load publications:', error);
      showEmptyState(listContainer, '⚠️', 'Error Loading Publications', 'Try again later.');
    }
  }

  function bindEvents() {
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(applyFilters, 300);
    });

    yearFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
  }

  function populateYearFilter(publications) {
    yearFilter.innerHTML = `<option value="all">All Years</option>`;

    const years = [...new Set(publications.map(p => p.year).filter(Boolean))];
    years.sort((a, b) => Number(b) - Number(a));

    years.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearFilter.appendChild(option);
    });
  }

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedYear = yearFilter.value;
    const selectedType = typeFilter.value.toLowerCase();

    let filtered = allPublications;

    if (query) {
      filtered = filtered.filter(pub =>
        `${pub.title} ${pub.authors} ${pub.venue} ${pub.abstract}`
          .toLowerCase()
          .includes(query)
      );
    }

    if (selectedYear !== 'all') {
      filtered = filtered.filter(pub => pub.year === selectedYear);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(pub => (pub.type || '').toLowerCase() === selectedType);
    }

    updateResultsCount(filtered.length, allPublications.length);
    renderPublications(filtered);
  }

  function updateResultsCount(shown, total) {
    resultsCount.innerHTML =
      `Showing <span>${shown}</span> of <span>${total}</span> publications`;
  }

  function renderPublications(publications) {
    listContainer.innerHTML = '';

    if (!publications.length) {
      listContainer.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>No publications found</h3>
        </div>
      `;
      return;
    }

    const groups = {};
    publications.forEach(pub => {
      const year = pub.year || 'Unknown';
      if (!groups[year]) groups[year] = [];
      groups[year].push(pub);
    });

    Object.keys(groups)
      .sort((a, b) => Number(b) - Number(a))
      .forEach(year => {
        const div = document.createElement('div');
        div.className = 'year-group reveal';

        const papers = groups[year];

        div.innerHTML = `
          <h3>${year} <span class="paper-count">${papers.length}</span></h3>
          <div class="pub-list">
            ${papers.map(renderPubCard).join('')}
          </div>
        `;

        listContainer.appendChild(div);
      });

    initScrollReveal();
  }

  function renderPubCard(pub) {
    const typeClass = getTypeClass(pub.type);

    let links = '';
    if (pub.doi) links += `<a href="${escapeAttr(pub.doi)}" target="_blank" onclick="event.stopPropagation();">DOI</a>`;
    if (pub.pdf) links += `<a href="${escapeAttr(pub.pdf)}" target="_blank" onclick="event.stopPropagation();">PDF</a>`;

    const titleAttr = escapeAttr(pub.title || '');
    const modelImgUrl = cleanGoogleDriveUrl((pub.model_img || pub.model_image || '').trim());
    
    let hasImage = false;
    let imageWrapperHTML = '';
    if (modelImgUrl && !modelImgUrl.includes('/folders/')) {
      hasImage = true;
      imageWrapperHTML = `
        <div class="pub-card-image-wrapper">
          <img class="pub-card-thumbnail" src="${escapeHTML(modelImgUrl)}" alt="${titleAttr} Preview" loading="lazy" onerror="this.onerror=null; this.parentNode.style.display='flex'; this.parentNode.style.alignItems='center'; this.parentNode.style.justifyContent='center'; this.outerHTML='<span style=&quot;font-size: 2rem; opacity: 0.2;&quot;>📄</span>';">
        </div>`;
    } else {
      // Empty/Placeholder thumbnail box to force image to the left and details to the right
      imageWrapperHTML = `
        <div class="pub-card-image-wrapper" style="display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 2rem; opacity: 0.2;">📄</span>
        </div>`;
    }

    const cardClass = `pub-card glass-card`;

    return `
      <article class="${cardClass}" data-title="${titleAttr}" style="cursor: pointer;">
        ${imageWrapperHTML}
        <div class="pub-card-content">
          <h4 class="pub-title">${escapeHTML(pub.title || '')}</h4>
          <p class="pub-authors">${escapeHTML(pub.authors || '')}</p>
          <div class="pub-venue-line">
            ${pub.venue ? `<span class="pub-venue">${escapeHTML(pub.venue)}</span>` : ''}
            <span class="pub-type-badge ${typeClass}">${pub.type || ''}</span>
          </div>
          ${links ? `<div class="pub-links">${links}</div>` : ''}
        </div>
      </article>
    `;
  }

  function openPubModal(pub) {
    let modal = document.getElementById('pubDetailModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'pubDetailModal';
      modal.className = 'member-modal pub-modal';
      modal.innerHTML = `
        <div class="member-modal-overlay"></div>
        <div class="member-modal-wrapper">
          <button class="member-modal-close" aria-label="Close modal">&times;</button>
          <div class="member-modal-body" id="pubModalBody"></div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('.member-modal-close').addEventListener('click', closeModal);
      modal.querySelector('.member-modal-overlay').addEventListener('click', closeModal);
      
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

    const title = escapeHTML(pub.title || '');
    const authors = escapeHTML(pub.authors || '');
    const abstract = escapeHTML(pub.abstract || 'No abstract available.');
    const typeClass = getTypeClass(pub.type);
    const modelImgUrl = cleanGoogleDriveUrl((pub.model_img || pub.model_image || '').trim());

    let modelImgHTML = '';
    if (modelImgUrl && !modelImgUrl.includes('/folders/')) {
      modelImgHTML = `<img class="pub-modal-model-img" src="${escapeHTML(modelImgUrl)}" alt="${title} Model Architecture" onerror="this.onerror=null; this.style.display='none';">`;
    }

    let linksHTML = '';
    const doi = (pub.doi || '').trim();
    const pdf = (pub.pdf || '').trim();
    if (doi || pdf) {
      let linkItems = [];
      if (doi) linkItems.push(`<a href="${escapeHTML(doi)}" target="_blank" class="member-modal-link-item"><span>🔗</span> DOI URL</a>`);
      if (pdf) linkItems.push(`<a href="${escapeHTML(pdf)}" target="_blank" class="member-modal-link-item"><span>📄</span> PDF Document</a>`);
      
      linksHTML = `
        <div class="member-modal-section-title">Resources</div>
        <div class="member-modal-links-grid">
          ${linkItems.join('')}
        </div>
      `;
    }

    document.getElementById('pubModalBody').innerHTML = `
      <h2 style="font-size: 1.5rem; margin-top: 0; margin-bottom: var(--space-md); color: var(--text-primary); line-height: 1.4;">${title}</h2>
      
      <div class="pub-modal-authors">${authors}</div>
      
      <div class="pub-modal-meta">
        ${pub.venue ? `<span class="pub-venue" style="font-size: 0.9rem; font-style: italic; background: var(--bg-secondary); padding: 4px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">${escapeHTML(pub.venue)}</span>` : ''}
        <span class="pub-type-badge ${typeClass}">${pub.type || ''}</span>
        ${pub.year ? `<span style="font-size: 0.9rem; font-weight: 600; color: var(--text-tertiary); background: var(--bg-secondary); padding: 4px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">${pub.year}</span>` : ''}
      </div>

      ${modelImgHTML}

      <div class="member-modal-section-title">Abstract</div>
      <div class="pub-modal-abstract">
        ${abstract}
      </div>

      ${linksHTML}
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function initModalEvents() {
    listContainer.addEventListener('click', (e) => {
      const card = e.target.closest('.pub-card');
      if (!card) return;

      if (e.target.closest('.pub-links a') || e.target.closest('a')) {
        return;
      }

      const titleAttr = card.getAttribute('data-title');
      const pub = allPublications.find(p => escapeAttr(p.title || '') === titleAttr);
      if (pub) {
        openPubModal(pub);
      }
    });
  }

  function getTypeClass(type) {
    if (!type) return '';
    const t = type.toLowerCase();
    if (t === 'journal') return 'journal';
    if (t === 'conference') return 'conference';
    if (t === 'preprint') return 'preprint';
    return '';
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

})();