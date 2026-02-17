document.addEventListener('DOMContentLoaded', () => {

  // ---- Nav scroll state ----
  const nav = document.getElementById('nav');
  let ticking = false;

  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  });

  // ---- Mobile menu ----
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuOpen = false;

  toggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    toggle.setAttribute('aria-expanded', String(menuOpen));
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---- Smooth scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        const offset = nav.offsetHeight + 12;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Tab switching ----
  function syncTabHeights() {
    document.querySelectorAll('.project-tabs').forEach(tabContainer => {
      const tabsContent = tabContainer.querySelector('.tabs-content');
      const panels = Array.from(tabContainer.querySelectorAll('.tab-panel'));
      if (!tabsContent || !panels.length) return;

      let tallest = 0;

      panels.forEach(panel => {
        const isActive = panel.classList.contains('active');
        const prevDisplay = panel.style.display;
        const prevVisibility = panel.style.visibility;
        const prevPosition = panel.style.position;
        const prevInset = panel.style.inset;
        const prevPointerEvents = panel.style.pointerEvents;

        if (!isActive) {
          panel.style.display = 'flex';
          panel.style.visibility = 'hidden';
          panel.style.position = 'absolute';
          panel.style.inset = '0';
          panel.style.pointerEvents = 'none';
        }

        tallest = Math.max(tallest, panel.scrollHeight);

        if (!isActive) {
          panel.style.display = prevDisplay;
          panel.style.visibility = prevVisibility;
          panel.style.position = prevPosition;
          panel.style.inset = prevInset;
          panel.style.pointerEvents = prevPointerEvents;
        }
      });

      if (tallest > 0) {
        tabsContent.style.minHeight = `${Math.ceil(tallest)}px`;
      }
    });
  }

  document.querySelectorAll('.project-tabs').forEach(tabContainer => {
    const buttons = tabContainer.querySelectorAll('.tab-btn');
    const panels = tabContainer.querySelectorAll('.tab-panel');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabIndex = btn.dataset.tab;

        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        panels.forEach(p => p.classList.remove('active'));
        const target = tabContainer.querySelector(`.tab-panel[data-panel="${tabIndex}"]`);
        if (target) target.classList.add('active');
        syncTabHeights();
      });
    });
  });

  document.querySelectorAll('.panel-screenshot').forEach(image => {
    if (!image.complete) {
      image.addEventListener('load', syncTabHeights, { once: true });
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(syncTabHeights, 120);
  });

  window.addEventListener('load', syncTabHeights);
  syncTabHeights();

  // ---- Scroll animations ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.project-block').forEach(block => {
    observer.observe(block);
  });

});
