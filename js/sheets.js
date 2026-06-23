/* ============================================
   Google Sheets Data Fetching Module
   Fetches CSV data from published Google Sheets
   with caching and error handling
   ============================================ */

/**
 * Parse CSV text into an array of objects
 * Handles quoted fields (commas inside quotes, escaped quotes)
 */
function parseCSV(csvText) {
  const result = [];
  let row = [''];
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const c = csvText[i];
    const next = csvText[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      result.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }

  if (row.length > 1 || row[0] !== '') {
    result.push(row);
  }

  if (result.length < 2) return [];

  const headers = result[0].map(h => h.toLowerCase().trim().replace(/\s+/g, '_'));
  const data = [];

  for (let i = 1; i < result.length; i++) {
    const values = result[i];
    if (values.length === 0 || (values.length === 1 && !values[0])) continue;

    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = values[idx] !== undefined ? values[idx].trim() : '';
    });
    data.push(obj);
  }

  return data;
}

/**
 * Fetch data from a Google Sheets CSV URL with caching
 */
async function fetchSheetData(url, cacheKey, forceRefresh = false) {
  if (!url) return [];
  
  // Check cache first
  const cacheDuration = LAB_CONFIG.cacheDuration !== undefined ? LAB_CONFIG.cacheDuration : 60;
  const ttl = cacheDuration * 60 * 1000;
  const cached = sessionStorage.getItem(cacheKey);
  
  if (ttl === 0) {
    sessionStorage.removeItem(cacheKey);
  }
  
  if (cached && !forceRefresh && ttl > 0) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < ttl) {
        return data;
      }
    } catch (e) {
      sessionStorage.removeItem(cacheKey);
    }
  }
  
  try {
    const response = await fetch(url, {
      cache: "no-store"
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    const data = parseCSV(csvText);
    
    // Cache the result if caching is enabled (ttl > 0)
    if (ttl > 0) {
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      } catch (e) {
        // sessionStorage might be full or disabled
        console.warn('Could not cache data:', e);
      }
    } else {
      sessionStorage.removeItem(cacheKey);
    }
    
    return data;
  } catch (error) {
    console.error(`Failed to fetch sheet data from ${url}:`, error);
    
    // Return cached data even if expired or forced (better than nothing on error)
    if (cached) {
      try {
        return JSON.parse(cached).data;
      } catch (e) {
        // ignore
      }
    }
    
    return [];
  }
}

/**
 * Fetch members data
 */
async function fetchMembers(forceRefresh = false) {
  const url = getSheetUrl('members');
  return fetchSheetData(url, 'lab_members_cache', forceRefresh);
}

/**
 * Fetch publications data
 */
async function fetchPublications(forceRefresh = false) {
  const url = getSheetUrl('publications');
  return fetchSheetData(url, 'lab_publications_cache', forceRefresh);
}

/**
 * Show loading skeletons in a container
 */
function showLoadingSkeletons(container, count, type = 'card') {
  container.innerHTML = '';
  
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    
    if (type === 'member') {
      skeleton.className = 'glass-card member-card';
      skeleton.innerHTML = `
        <div class="loading-skeleton skeleton-avatar"></div>
        <div class="loading-skeleton skeleton-text" style="width: 70%; margin: 0 auto 8px;"></div>
        <div class="loading-skeleton skeleton-text short" style="width: 50%; margin: 0 auto 8px;"></div>
        <div class="loading-skeleton skeleton-text" style="width: 40%; margin: 0 auto;"></div>
      `;
    } else if (type === 'publication') {
      skeleton.className = 'glass-card pub-card';
      skeleton.innerHTML = `
        <div class="loading-skeleton skeleton-text" style="width: 90%; height: 16px;"></div>
        <div class="loading-skeleton skeleton-text" style="width: 70%;"></div>
        <div class="loading-skeleton skeleton-text short" style="width: 50%;"></div>
      `;
    } else {
      skeleton.className = 'glass-card';
      skeleton.style.padding = 'var(--space-2xl)';
      skeleton.innerHTML = `
        <div class="loading-skeleton skeleton-text"></div>
        <div class="loading-skeleton skeleton-text medium"></div>
        <div class="loading-skeleton skeleton-text short"></div>
      `;
    }
    
    container.appendChild(skeleton);
  }
}

/**
 * Show empty state message
 */
function showEmptyState(container, icon, title, message) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${message}</p>
    </div>
  `;
}

/**
 * Check if Google Sheets is configured
 */
function isSheetsConfigured() {
  return LAB_CONFIG.spreadsheetId && LAB_CONFIG.spreadsheetId !== "YOUR_SPREADSHEET_ID_HERE";
}

/**
 * Show configuration notice when sheets are not set up
 */
function showConfigNotice(container) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">⚙️</div>
      <h3>Google Sheets Not Configured</h3>
      <p>Edit <code>js/config.js</code> and add your Google Spreadsheet ID to connect your data. See <code>GOOGLE_SHEETS_SETUP.md</code> for instructions.</p>
    </div>
  `;
}

/**
 * Clean Google Drive sharing links to raw direct image source URLs
 */
function cleanGoogleDriveUrl(url) {
  if (!url) return '';
  url = url.trim();
  
  // Extract ID from different Google Drive link formats
  let fileId = '';
  
  if (url.includes('drive.google.com')) {
    const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch && fileDMatch[1]) {
      fileId = fileDMatch[1];
    } else {
      const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        fileId = idMatch[1];
      }
    }
  } else if (url.includes('lh3.googleusercontent.com/d/')) {
    const lh3Match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (lh3Match && lh3Match[1]) {
      fileId = lh3Match[1];
    }
  }
  
  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }
  
  return url;
}
