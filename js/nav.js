/* ============================================
   Navigation Component
   Responsive navigation with scroll effects
   ============================================ */

/**
 * Initialize navigation on page load
 */
function initNavigation(activePage) {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (!navbar) return;

  // --- Set active page ---
  if (activePage) {
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === activePage || (activePage === 'index.html' && (href === '/' || href === 'index.html'))) {
        link.classList.add('active');
      }
    });
  }

  // --- Scroll effect ---
  let lastScroll = 0;
  
  function onScroll() {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial check

  // --- Mobile hamburger ---
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
}

/**
 * Initialize scroll reveal animations
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => observer.observe(el));
}

/**
 * Animate counting up numbers
 */
function animateCountUp(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target + '+';
    }
  }
  
  requestAnimationFrame(update);
}

/**
 * Generate the navigation HTML
 */
function getNavHTML() {
  return `
    <nav class="navbar" id="navbar">
      <div class="container">
        <a href="index.html" class="nav-logo">
          <img src="VITAlogo.png" alt="VITA Lab" style="height: 36px; width: auto; object-fit: contain;">
          <span class="logo-text"><span class="logo-vita">VITA</span> <span class="logo-lab">LAB</span></span>
        </a>
        <div class="nav-links" id="navLinks">
          <a href="index.html" data-page="index.html">Home</a>
          <a href="members.html" data-page="members.html">Team</a>
          <a href="publications.html" data-page="publications.html">Publications</a>
          <a href="contact.html" data-page="contact.html">Contact</a>
        </div>
        <button class="nav-hamburger" id="navHamburger" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  `;
}

/**
 * Generate the footer HTML
 */
function getFooterHTML() {
  const year = new Date().getFullYear();
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-text">
          © ${year} ${LAB_CONFIG.name || 'Research Lab'}. All rights reserved.
        </div>
        <div class="footer-links">
          <a href="index.html">Home</a>
          <a href="members.html">Team</a>
          <a href="publications.html">Publications</a>
          <a href="contact.html">Contact</a>
        </div>
      </div>
    </footer>
  `;
}

/**
 * Insert nav and footer into page
 */
function renderLayout(activePage) {
  // Insert nav
  const navPlaceholder = document.getElementById('nav-placeholder');
  if (navPlaceholder) {
    navPlaceholder.innerHTML = getNavHTML();
  }

  // Insert footer
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = getFooterHTML();
  }

  // Initialize navigation behavior
  initNavigation(activePage);
  
  // Initialize scroll reveal
  initScrollReveal();
}
