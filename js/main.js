// =========================================================
// DRAGONDOC AI — Main JavaScript
// Navigation, Scroll Animations, FAQ, Tabs, Counter
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  // ─── NAV SCROLL BEHAVIOR ─────────────────────────────
  const nav = document.querySelector('.nav');
  const navScrollThreshold = 50;

  window.addEventListener('scroll', () => {
    if (window.scrollY > navScrollThreshold) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  }, { passive: true });

  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── INTERSECTION OBSERVER — REVEAL ON SCROLL ────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
  });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // ─── COUNTER ANIMATION ───────────────────────────────
  function animateCounter(el, target, duration = 2000, suffix = '') {
    const start = performance.now();
    const startVal = 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(startVal + (target - startVal) * eased);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count || '0');
        const suffix = el.dataset.suffix || '';
        const duration = parseInt(el.dataset.duration || '2000');
        animateCounter(el, target, duration, suffix);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
  });

  // ─── FAQ ACCORDION ───────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // Open first FAQ by default
  const firstFaq = document.querySelector('.faq-item');
  if (firstFaq) firstFaq.classList.add('open');

  // ─── USE CASE TABS ───────────────────────────────────
  document.querySelectorAll('.usecase-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      document.querySelectorAll('.usecase-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.usecase-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const content = document.querySelector(`.usecase-content[data-tab="${target}"]`);
      if (content) {
        content.classList.add('active');
        // Re-trigger reveal animations in newly shown content
        content.querySelectorAll('.reveal').forEach(el => {
          el.classList.remove('revealed');
          setTimeout(() => el.classList.add('revealed'), 50);
        });
      }
    });
  });

  // Activate first tab
  const firstTab = document.querySelector('.usecase-tab');
  if (firstTab) firstTab.click();

  // ─── PRICING TOGGLE (Annual / Monthly) ───────────────
  const pricingToggle = document.getElementById('pricing-toggle');
  if (pricingToggle) {
    pricingToggle.addEventListener('change', () => {
      const isAnnual = pricingToggle.checked;
      document.querySelectorAll('[data-monthly]').forEach(el => {
        const monthly = el.dataset.monthly;
        const annual = el.dataset.annual;
        el.textContent = isAnnual ? annual : monthly;
      });
      const label = document.getElementById('pricing-period-label');
      if (label) label.textContent = isAnnual ? '/tháng (thanh toán năm)' : '/tháng';
    });
  }

  // ─── DEMO DRAG AND DROP UPLOAD ZONE ──────────────────
  const uploadZone = document.getElementById('upload-zone');
  if (uploadZone) {
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
      // Visual feedback only — this is the landing page demo
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        showUploadFeedback(files[0].name);
      }
    });
  }

  function showUploadFeedback(filename) {
    const feedback = document.getElementById('upload-feedback');
    if (feedback) {
      feedback.textContent = `✓ "${filename}" đã sẵn sàng để xử lý`;
      feedback.style.display = 'block';
      setTimeout(() => { feedback.style.display = 'none'; }, 3000);
    }
  }

  // ─── MOBILE MENU ─────────────────────────────────────
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.style.display !== 'none';
      mobileMenu.style.display = isOpen ? 'none' : 'flex';
    });
  }

  // ─── ACTIVE NAV LINK ON SCROLL ───────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // ─── HERO TYPING EFFECT ──────────────────────────────
  const heroTypingEl = document.getElementById('hero-typing');
  if (heroTypingEl) {
    const phrases = [
      'Luật AI 134/2025/QH15',
      'Nghị định 142/2026/NĐ-CP',
      'Nghị định 13 Bảo vệ DLCN',
      'Bộ Luật Lao Động 2025',
      'Quy chế Compliance Nội bộ',
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let pauseTimer = null;

    function typeLoop() {
      const current = phrases[phraseIdx];
      if (!deleting) {
        heroTypingEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          deleting = true;
          pauseTimer = setTimeout(typeLoop, 2200);
          return;
        }
      } else {
        heroTypingEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }
      setTimeout(typeLoop, deleting ? 50 : 80 + Math.random() * 30);
    }

    typeLoop();
  }

  console.log(
    '%c🐉 DRAGONDOC AI%c\nYour Intelligent Knowledge Guardian\nVân Long Hội (雲龍會)',
    'color:#00E5FF;font-size:18px;font-weight:900;font-family:monospace',
    'color:#8CA0C4;font-size:11px;font-family:monospace'
  );
});
